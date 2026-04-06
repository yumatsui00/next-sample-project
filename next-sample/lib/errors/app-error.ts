import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type"
import { ProblemErrorItem } from "./problem-detail"

export type AppErrorParam = {
  message: string
  code: string
  statusCode?: number
  details?: AppErrorDetails
  type?: string
  title?: string
  instance?: string
  traceId?: string
  retryable?: boolean
  cause?: unknown
}


export type AppErrorDetails = Record<string, unknown> & {
  errors?: ProblemErrorItem[]
  retryAfter?: number
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly details?: AppErrorDetails
  public readonly type: string
  public readonly title: string
  public readonly retryable: boolean
  public readonly instance?: string
  public readonly traceId?: string

  constructor({
    message,
    code,
    statusCode = 500,
    details,
    type = ERROR_TYPES.INTERNAL,
    title = ERROR_DEFAULT_TITLE.INTERNAL,
    retryable = false,
    instance,
    traceId,
    cause,
  }: AppErrorParam) {
    super(message, { cause })
    this.name = new.target.name
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.type = type
    this.title = title
    this.retryable = retryable
    this.instance = instance
    this.traceId = traceId
  }
}
