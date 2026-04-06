export const ERROR_TYPES = {
  VALIDATION: "/problems/validation-error",
  UNAUTHORIZED: "/problems/authentication-error",
  FORBIDDEN: "/problems/authorization-error",
  NOT_FOUND: "/problems/not-found",
  CONFLICT: "/problems/conflict",
  RATE_LIMIT: "/problems/rate-limit",
  EXTERNAL_SERVICE: "/problems/external-service-error",
  TIMEOUT: "/problems/timeout",
  INTERNAL: "/problems/internal-error",
} as const

export const ERROR_DEFAULT_TITLE = {
  VALIDATION: "Validation Error",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  RATE_LIMIT: "Too Many Requests",
  EXTERNAL_SERVICE: "External Service Unavailable",
  TIMEOUT: "Gateway Timeout",
  INTERNAL: "Internal Server Error",
} as const
