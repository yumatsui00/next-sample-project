import { ApiContext, ApiGuard, ApiMiddleware, ApiPipelineResult } from "./types"

function hasPipelineResult(
  result: Awaited<ReturnType<ApiMiddleware | ApiGuard>>
): result is ApiPipelineResult {
  return typeof result !== "undefined"
}

//いずれは並行処理にしてもよい
export async function runMiddlewares(
  ctx: ApiContext,
  middlewares: ApiMiddleware[]
): Promise<ApiPipelineResult | undefined> {
  for (const middleware of middlewares) {
    const result = await middleware(ctx)
    if (hasPipelineResult(result)) {
      return result
    }
  }
}

export async function runGuards(
  ctx: ApiContext,
  guards: ApiGuard[]
): Promise<ApiPipelineResult | undefined> {
  for (const guard of guards) {
    const result = await guard(ctx)
    if (hasPipelineResult(result)) {
      return result
    }
  }
}
