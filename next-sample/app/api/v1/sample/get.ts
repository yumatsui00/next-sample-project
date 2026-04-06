import type { ApiHandler } from "@/lib/api/types"

export const handleGet: ApiHandler = async (ctx) => {
  return {
    body: {
      ok: true,
      traceId: ctx.traceId,
    },
  }
}
