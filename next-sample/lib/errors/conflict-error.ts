import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class ConflictError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.CONFLICT,
    code = "CONFLICT",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 409,
      details,
      type: ERROR_TYPES.CONFLICT,
      title: ERROR_DEFAULT_TITLE.CONFLICT,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
