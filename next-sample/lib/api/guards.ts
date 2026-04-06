import type { ApiContext, ApiGuard, ApiResponseShape } from "./types"

// Factory functions in this file are intended to be reused across projects.
// Concrete guard exports at the bottom are template examples and should be
// replaced with project-specific authentication and authorization logic.

export type AuthUser = {
  id: string
  roles?: string[]
}

type GuardFailureOptions = {
  status?: number
  code: string
  message: string
}

type ResolveUser<TUser> = (ctx: ApiContext) => Promise<TUser | null> | TUser | null

type RequireAuthenticatedGuardOptions<TUser> = GuardFailureOptions & {
  resolveUser: ResolveUser<TUser>
}

type RequireRoleGuardOptions<TUser> = GuardFailureOptions & {
  requiredRole: string
  resolveUser: ResolveUser<TUser>
  hasRole?: (user: TUser, requiredRole: string) => boolean
}

function buildFailureResponse({
  status = 403,
  code,
  message,
}: GuardFailureOptions): ApiResponseShape {
  return {
    status,
    body: {
      code,
      message,
    },
  }
}

export function createRequireAuthenticatedGuard<TUser>({
  resolveUser,
  status = 401,
  code,
  message,
}: RequireAuthenticatedGuardOptions<TUser>): ApiGuard {
  return async (ctx: ApiContext) => {
    const user = await resolveUser(ctx)
    if (user) {
      return
    }

    return buildFailureResponse({
      status,
      code,
      message,
    })
  }
}

export function createRequireRoleGuard<TUser extends AuthUser>({
  requiredRole,
  resolveUser,
  hasRole = (user, role) => user.roles?.includes(role) ?? false,
  status = 403,
  code,
  message,
}: RequireRoleGuardOptions<TUser>): ApiGuard {
  return async (ctx: ApiContext) => {
    const user = await resolveUser(ctx)
    if (user && hasRole(user, requiredRole)) {
      return
    }

    return buildFailureResponse({
      status,
      code,
      message,
    })
  }
}

// Template example user resolver and guards for sample routes.
// Replace these with project-specific auth/session integration after reuse.
export function resolveUserFromHeaders({ request }: ApiContext): AuthUser | null {
  const userId = request.headers.get("x-user-id")
  if (!userId) {
    return null
  }

  const rolesHeader = request.headers.get("x-user-roles")

  return {
    id: userId,
    roles: rolesHeader?.split(",").map((role) => role.trim()).filter(Boolean) ?? [],
  }
}

export const requireAuthenticatedUserGuard = createRequireAuthenticatedGuard({
  resolveUser: resolveUserFromHeaders,
  status: 401,
  code: "AUTHENTICATION_REQUIRED",
  message: "Authenticated user is required for this request.",
})

export const requireAdminRoleGuard = createRequireRoleGuard({
  requiredRole: "admin",
  resolveUser: resolveUserFromHeaders,
  status: 403,
  code: "ADMIN_ROLE_REQUIRED",
  message: "Admin role is required for this request.",
})
