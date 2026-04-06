import { Loglevel, LogParam } from "./types";
import { AppError } from "../errors/app-error";

const APP_ENV = process.env.APP_ENV ?? "prod" // local | dev | stg | prod

function getAllowedLevels(): Loglevel[] {
    if (APP_ENV == "local" || APP_ENV == "dev") {
        return ["debug", "info", "warn", "error" ]
    }
    return ["info", "warn", "error"]
}

function shouldLog(level: Loglevel): boolean {
    return getAllowedLevels().includes(level)
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, createSafeJsonReplacer())
  } catch {
    return String(value)
  }
}

function createSafeJsonReplacer() {
  const seen = new WeakSet<object>()

  return (_key: string, value: unknown) => {
    if (typeof value === "bigint") {
      return value.toString()
    }

    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack,
        cause: value.cause,
      }
    }

    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]"
      }
      seen.add(value)
    }

    return value
  }
}

function formatError(error: unknown) {
  // ===== AppError（自作エラー） =====
  if (error instanceof AppError) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      code: error.code,
      statusCode: error.statusCode,
      type: error.type,
      title: error.title,
      retryable: error.retryable,
      instance: error.instance,
      traceId: error.traceId,
      details: error.details,
      cause: error.cause,
      stack: error.stack,
    }
  }

  // ===== 標準 Error =====
  if (error instanceof Error) {
    return {
      errorName: error.name,
      errorMessage: error.message,
      cause: error.cause,
      stack: error.stack,
    }
  }

  // ===== その他（string / object / null など） =====
  return {
    error: safeStringify(error),
  }
}

function baseLog(
    level: Loglevel,
    { message, context, error }: LogParam
) {
    if (!shouldLog(level)) return;

    const log = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...(context ?? {}),
        ...(error ? formatError(error) : {})
    }

    const isDev = APP_ENV === "local" || APP_ENV == "dev"
    if (isDev) {
        console[level](`[${level.toUpperCase()}] ${message}`, log)
    } else {
        console.log(safeStringify(log))
    }
}


export const logger = {
  debug: (params: LogParam) => baseLog("debug", params),
  info: (params: LogParam) => baseLog("info", params),
  warn: (params: LogParam) => baseLog("warn", params),
  error: (params: LogParam) => baseLog("error", params),
}

