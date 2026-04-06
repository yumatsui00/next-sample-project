export type ApiContext = {
  request: Request
  params?: Record<string, string>
  traceId: string
}

export type ApiResponseShape = {
  status?: number
  headers?: HeadersInit
  body?: unknown
}

export type ApiPipelineResult = Response | ApiResponseShape

export type ApiHandlerResult = ApiPipelineResult | void

export type ApiHandler = (ctx: ApiContext) => Promise<ApiHandlerResult>
// API共通処理関数型
export type ApiMiddleware = (
  ctx: ApiContext
) => Promise<ApiHandlerResult> | ApiHandlerResult
// protectedAPI共通処理関数型
export type ApiGuard = (
  ctx: ApiContext
) => Promise<ApiHandlerResult> | ApiHandlerResult
// API共通処理複合型
export type WithApiOptions = {
  middlewares?: ApiMiddleware[]
  guards?: ApiGuard[]
}
