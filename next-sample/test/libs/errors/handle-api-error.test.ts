import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { AppError } from "../../../lib/errors/app-error"
import { handleApiError } from "../../../lib/errors/handle-api-error"
import {
  ERROR_DEFAULT_TITLE,
  ERROR_TYPES,
} from "../../../lib/errors/error-type"
import { createRequest } from "../../helpers/create-request"

vi.mock("../../../lib/logger/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}))

import { logger } from "../../../lib/logger/logger"

describe("handleApiError", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(crypto, "randomUUID").mockReturnValue("generated-trace-id")
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns problem details for AppError and preserves retry-after headers", async () => {
    const request = createRequest()
    const error = new AppError({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      statusCode: 422,
      type: ERROR_TYPES.VALIDATION,
      title: ERROR_DEFAULT_TITLE.VALIDATION,
      traceId: "trace-from-error",
      details: {
        errors: [
          {
            field: "email",
            code: "INVALID",
            message: "Email is invalid",
          },
        ],
        retryAfter: 60,
      },
    })

    const response = handleApiError({
      error,
      request,
    })

    expect(response.status).toBe(422)
    expect(response.headers.get("content-type")).toContain("application/problem+json")
    expect(response.headers.get("x-trace-id")).toBe("trace-from-error")
    expect(response.headers.get("retry-after")).toBe("60")
    await expect(response.json()).resolves.toEqual({
      type: ERROR_TYPES.VALIDATION,
      title: ERROR_DEFAULT_TITLE.VALIDATION,
      status: 422,
      detail: "Validation failed",
      instance: "/api/test",
      code: "VALIDATION_ERROR",
      retryable: false,
      traceId: "trace-from-error",
      errors: [
        {
          field: "email",
          code: "INVALID",
          message: "Email is invalid",
        },
      ],
      retryAfter: 60,
    })
    expect(logger.error).toHaveBeenCalledTimes(2)
  })

  it("falls back to internal server error for unknown errors", async () => {
    const request = createRequest("/api/unknown", { method: "GET" })
    const error = new Error("database connection lost")

    const response = handleApiError({
      error,
      request,
      traceId: "request-trace-id",
    })

    expect(response.status).toBe(500)
    expect(response.headers.get("x-trace-id")).toBe("request-trace-id")
    expect(response.headers.get("retry-after")).toBeNull()
    await expect(response.json()).resolves.toEqual({
      type: ERROR_TYPES.INTERNAL,
      title: ERROR_DEFAULT_TITLE.INTERNAL,
      status: 500,
      detail: "予期しないエラーが発生しました。",
      instance: "/api/unknown",
      code: "INTERNAL_SERVER_ERROR",
      retryable: false,
      traceId: "request-trace-id",
    })
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith({
      message: ERROR_DEFAULT_TITLE.INTERNAL,
      context: {
        problem: {
          type: ERROR_TYPES.INTERNAL,
          title: ERROR_DEFAULT_TITLE.INTERNAL,
          status: 500,
          detail: "予期しないエラーが発生しました。",
          instance: "/api/unknown",
          code: "INTERNAL_SERVER_ERROR",
          retryable: false,
          traceId: "request-trace-id",
        },
        path: "/api/unknown",
        method: "GET",
      },
      error,
    })
  })

  it("generates a trace id when one is not provided", async () => {
    const request = createRequest("/api/missing-trace", { method: "PATCH" })

    const response = handleApiError({
      error: new Error("boom"),
      request,
    })

    expect(response.headers.get("x-trace-id")).toBe("generated-trace-id")
    await expect(response.json()).resolves.toMatchObject({
      traceId: "generated-trace-id",
      instance: "/api/missing-trace",
    })
    expect(logger.error).toHaveBeenNthCalledWith(1, {
      message: "traceId was missing in handleApiError.",
      context: {
        traceId: "generated-trace-id",
        path: "/api/missing-trace",
        method: "PATCH",
      },
    })
  })
})
