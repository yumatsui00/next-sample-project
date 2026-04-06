import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class TimeoutError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.TIMEOUT,
    code = "TIMEOUT",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 504,
      details,
      type: ERROR_TYPES.TIMEOUT,
      title: ERROR_DEFAULT_TITLE.TIMEOUT,
      retryable: true,
      instance,
      traceId,
      cause,
    })
  }
}
