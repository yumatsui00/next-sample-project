import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class AuthorizationError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.FORBIDDEN,
    code = "FORBIDDEN",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 403,
      details,
      type: ERROR_TYPES.FORBIDDEN,
      title: ERROR_DEFAULT_TITLE.FORBIDDEN,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
