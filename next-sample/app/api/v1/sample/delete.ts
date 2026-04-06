import type { ApiHandler } from "@/lib/api/types"
import { logger } from "@/lib/logger/logger"

export const handleDelete: ApiHandler = async (ctx) => {
  logger.info({
    message: "Sample DELETE endpoint was called.",
    context: {
      traceId: ctx.traceId,
      path: "/api/v1/sample",
      method: "DELETE",
    },
  })

  return {
    body: {
      ok: true,
      method: "DELETE",
      traceId: ctx.traceId,
    },
  }
}
