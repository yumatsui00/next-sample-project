import { ApiHandlerResult } from "./types"

export function toResponse(result: ApiHandlerResult): Response {
  if (result instanceof Response) {
    return result
  }

  if (!result) {
    return Response.json({ data: null })
  }

  const { status = 200, headers, body = { data: null } } = result
  return Response.json(body, {
    status,
    headers,
  })
}
