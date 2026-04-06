import type { ApiHandler } from "@/lib/api/types"
import { logger } from "@/lib/logger/logger"

export const handlePost: ApiHandler = async (ctx) => {
  logger.info({
    message: "Sample POST endpoint was called.",
    context: {
      traceId: ctx.traceId,
      path: "/api/v1/sample",
      method: "POST",
    },
  })

  return {
    body: {
      ok: true,
      method: "POST",
      traceId: ctx.traceId,
    },
  }
}
