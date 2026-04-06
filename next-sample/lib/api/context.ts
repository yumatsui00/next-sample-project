import { ApiContext } from "./types";


function resolveTraceId(request: Request): string {
  return request.headers.get("x-trace-id") ?? crypto.randomUUID()
}

export async function createApiContext(
    request: Request,
    routeContext?: { params?: Promise<Record<string, string>> }
): Promise<ApiContext> {
  const traceId = resolveTraceId(request);
  const params = routeContext?.params ? await routeContext.params : undefined;

  return {
    request,
    params,
    traceId,
  };
}
