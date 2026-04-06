export type Loglevel = "debug" | "info" | "warn" | "error"

export type LogContext = {
  traceId?: string
  userId?: string
  path?: string
  method?: string
  [key: string]: unknown
}

export type LogParam = {
  message: string
  context?: LogContext
  error?: unknown
}
