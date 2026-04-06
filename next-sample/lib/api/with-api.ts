import { createApiContext } from "./context"
import { runGuards, runMiddlewares } from "./pipeline"
import { toResponse } from "./response"
import { handleApiError } from "../errors"
import { ApiHandler, WithApiOptions } from "./types"

function applyTraceIdHeader(response: Response, traceId: string): Response {
  response.headers.set("x-trace-id", traceId)
  return response
}

export function withApi(
  handler: ApiHandler,
  options: WithApiOptions = {}
) {
  return async (
    request: Request,
    routeContext?: { params?: Promise<Record<string, string>> }
  ): Promise<Response> => {
    const ctx = await createApiContext(request, routeContext)
    try {
      const middlewareResult = await runMiddlewares(ctx, options.middlewares ?? [])
      if (typeof middlewareResult !== "undefined") {
        return applyTraceIdHeader(toResponse(middlewareResult), ctx.traceId)
      }

      const guardResult = await runGuards(ctx, options.guards ?? [])
      if (typeof guardResult !== "undefined") {
        return applyTraceIdHeader(toResponse(guardResult), ctx.traceId)
      }

      const result = await handler(ctx)
      return applyTraceIdHeader(toResponse(result), ctx.traceId)
    } catch (error) {
      return handleApiError({ error, request, traceId: ctx.traceId })
    }
  }
}
