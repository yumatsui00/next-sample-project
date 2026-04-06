import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class NotFoundError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.NOT_FOUND,
    code = "NOT_FOUND",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 404,
      details,
      type: ERROR_TYPES.NOT_FOUND,
      title: ERROR_DEFAULT_TITLE.NOT_FOUND,
      retryable: false,
      instance,
      traceId,
      cause,
    })
  }
}
