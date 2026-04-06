import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class ValidationError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.VALIDATION,
    code = "VALIDATION_ERROR",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 422,
      details,
      type: ERROR_TYPES.VALIDATION,
      title: ERROR_DEFAULT_TITLE.VALIDATION,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
