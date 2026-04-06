import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {

  // requestへtraceIdを付与
  const requestHeaders = new Headers(request.headers)
  const traceId = request.headers.get("x-trace-id") ?? crypto.randomUUID()
  requestHeaders.set("x-trace-id", traceId)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set("x-trace-id", traceId)
  return response
}
