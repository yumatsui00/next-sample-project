import { ERROR_DEFAULT_TITLE, ERROR_TYPES } from "./error-type";
import { AppError, AppErrorDetails } from "./app-error";

export class ExternalServiceError extends AppError {
  constructor(
    message = ERROR_DEFAULT_TITLE.EXTERNAL_SERVICE,
    code = "EXTERNAL_SERVICE_ERROR",
    details?: AppErrorDetails,
    instance?: string,
    traceId?: string,
    cause?: unknown
  ) {
    super({
      message,
      code,
      statusCode: 503,
      details,
      type: ERROR_TYPES.EXTERNAL_SERVICE,
      title: ERROR_DEFAULT_TITLE.EXTERNAL_SERVICE,
      retryable: true,
      instance,
      traceId,
      cause,
    })
  }
}
