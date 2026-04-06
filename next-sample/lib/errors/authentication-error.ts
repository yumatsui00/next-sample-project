import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class AuthenticationError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.UNAUTHORIZED,
    code = "UNAUTHORIZED",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 401,
      details,
      type: ERROR_TYPES.UNAUTHORIZED,
      title: ERROR_DEFAULT_TITLE.UNAUTHORIZED,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
