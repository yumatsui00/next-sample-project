import { AppError } from "./app-error"
import { ProblemDetail } from "./problem-detail"
import { logger } from "../logger/logger"
import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type"

type HandleApiErrorParams = {
  error: unknown
  request: Request
  traceId?: string
}

function getRequestPath(request: Request): string {
  return new URL(request.url).pathname
}

function buildProblemDetails(
  error: unknown,
  request: Request,
  fallbackTraceId: string
): ProblemDetail {
  const path = getRequestPath(request)

  if (error instanceof AppError) {
    return {
      type: error.type,
      title: error.title,
      status: error.statusCode,
      detail: error.message,
      instance: error.instance ?? path,
      code: error.code,
      retryable: error.retryable,
      traceId: error.traceId ?? fallbackTraceId,
      errors: error.details?.errors,
      retryAfter:
        typeof error.details?.retryAfter === "number"
          ? error.details.retryAfter
          : undefined,
    }
  }

  return {
    type: ERROR_TYPES.INTERNAL,
    title: ERROR_DEFAULT_TITLE.INTERNAL,
    status: 500,
    detail: "予期しないエラーが発生しました。",
    instance: path,
    code: "INTERNAL_SERVER_ERROR",
    retryable: false,
    traceId: fallbackTraceId,
  }
}

export function handleApiError({
  error,
  request,
  traceId,
}: HandleApiErrorParams): Response {
  const resolvedTraceId = traceId ?? crypto.randomUUID()
  const path = getRequestPath(request)

  if (!traceId) {
    logger.error({
      message: "traceId was missing in handleApiError.",
      context: {
        traceId: resolvedTraceId,
        path,
        method: request.method,
      },
    })
  }

  const problem = buildProblemDetails(error, request, resolvedTraceId)
  logger.error({
    message: problem.title,
    context: {
      problem,
      path,
      method: request.method,
    },
    error,
  })
  const headers = new Headers({
    "Content-Type": "application/problem+json",
  })

  if (problem.traceId) {
    headers.set("X-Trace-Id", problem.traceId)
  }

  if (typeof problem.retryAfter === "number") {
    headers.set("Retry-After", String(problem.retryAfter))
  }

  return Response.json(problem, {
    status: problem.status,
    headers,
  })
}
