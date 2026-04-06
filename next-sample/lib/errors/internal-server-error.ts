import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class InternalServerError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.INTERNAL,
    code = "INTERNAL_SERVER_ERROR",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 500,
      details,
      type: ERROR_TYPES.INTERNAL,
      title: ERROR_DEFAULT_TITLE.INTERNAL,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
