import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class RateLimitError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.RATE_LIMIT,
    code = "RATE_LIMIT",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 429,
      details,
      type: ERROR_TYPES.RATE_LIMIT,
      title: ERROR_DEFAULT_TITLE.RATE_LIMIT,
      retryable: true,
      instance,
      traceId,
      cause,
    })
  }
}
