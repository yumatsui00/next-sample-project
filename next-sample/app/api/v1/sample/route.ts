import {
  rejectLegacyClientMiddleware,
  requireDebugQueryParamMiddleware,
  requireTenantHeaderMiddleware,
} from "@/lib/api/middlewares"
import {
  requireAdminRoleGuard,
  requireAuthenticatedUserGuard,
} from "@/lib/api/guards"
import { withApi } from "@/lib/api/with-api"
import { handleDelete } from "./delete"
import { handleGet } from "./get"
import { handlePost } from "./post"

// Processing order:
// 1. middlewares
// 2. guards
// 3. handler
export const GET = withApi(handleGet, {
  middlewares: [
    rejectLegacyClientMiddleware,
    requireTenantHeaderMiddleware,
    requireDebugQueryParamMiddleware,
  ],
  guards: [requireAuthenticatedUserGuard, requireAdminRoleGuard],
})

export const POST = withApi(handlePost, {
  middlewares: [
    rejectLegacyClientMiddleware,
    requireTenantHeaderMiddleware,
    requireDebugQueryParamMiddleware,
  ],
  guards: [requireAuthenticatedUserGuard, requireAdminRoleGuard],
})

export const DELETE = withApi(handleDelete, {
  middlewares: [
    rejectLegacyClientMiddleware,
    requireTenantHeaderMiddleware,
    requireDebugQueryParamMiddleware,
  ],
  guards: [requireAuthenticatedUserGuard, requireAdminRoleGuard],
})
