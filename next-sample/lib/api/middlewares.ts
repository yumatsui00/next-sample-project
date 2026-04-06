import type { ApiContext, ApiMiddleware, ApiResponseShape } from "./types"

// Factory functions in this file are intended to be reused across projects.
// Concrete middleware exports at the bottom are template examples and should be
// replaced with project-specific rules after copying this structure.

type MiddlewareFailureOptions = {
  status?: number
  code: string
  message: string
}

type RequireHeaderMiddlewareOptions = MiddlewareFailureOptions & {
  headerName: string
}

type RequireQueryParamMiddlewareOptions = MiddlewareFailureOptions & {
  paramName: string
}

type RequireRouteParamMiddlewareOptions = MiddlewareFailureOptions & {
  paramName: string
}

type BlockHeaderValueMiddlewareOptions = MiddlewareFailureOptions & {
  headerName: string
  blockedValue: string
}

function buildFailureResponse({
  status = 400,
  code,
  message,
}: MiddlewareFailureOptions): ApiResponseShape {
  return {
    status,
    body: {
      code,
      message,
    },
  }
}

export function createRequireHeaderMiddleware({
  headerName,
  ...failure
}: RequireHeaderMiddlewareOptions): ApiMiddleware {
  return ({ request }: ApiContext) => {
    if (request.headers.get(headerName)) {
      return
    }

    return buildFailureResponse(failure)
  }
}

export function createRequireQueryParamMiddleware({
  paramName,
  ...failure
}: RequireQueryParamMiddlewareOptions): ApiMiddleware {
  return ({ request }: ApiContext) => {
    const { searchParams } = new URL(request.url)
    if (searchParams.get(paramName)) {
      return
    }

    return buildFailureResponse(failure)
  }
}

export function createRequireRouteParamMiddleware({
  paramName,
  ...failure
}: RequireRouteParamMiddlewareOptions): ApiMiddleware {
  return ({ params }: ApiContext) => {
    if (params?.[paramName]) {
      return
    }

    return buildFailureResponse(failure)
  }
}

export function createBlockHeaderValueMiddleware({
  headerName,
  blockedValue,
  ...failure
}: BlockHeaderValueMiddlewareOptions): ApiMiddleware {
  return ({ request }: ApiContext) => {
    if (request.headers.get(headerName) !== blockedValue) {
      return
    }

    return buildFailureResponse(failure)
  }
}

// Template example middleware definitions for sample routes.
// Replace these with project-specific middleware after reuse.
export const rejectLegacyClientMiddleware = createBlockHeaderValueMiddleware({
  headerName: "x-client-version",
  blockedValue: "legacy",
  status: 426,
  code: "LEGACY_CLIENT_NOT_SUPPORTED",
  message: "Legacy clients are no longer supported.",
})

export const requireTenantHeaderMiddleware = createRequireHeaderMiddleware({
  headerName: "x-tenant-id",
  status: 400,
  code: "TENANT_HEADER_REQUIRED",
  message: "x-tenant-id header is required for this request.",
})

export const requireDebugQueryParamMiddleware = createRequireQueryParamMiddleware({
  paramName: "debug",
  status: 400,
  code: "DEBUG_QUERY_REQUIRED",
  message: "debug query parameter is required for this request.",
})
