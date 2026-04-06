type CreateRequestOptions = {
  method?: string
  domain?: string
  headers?: HeadersInit
  body?: BodyInit | null
}

const DEFAULT_DOMAIN = "http://localhost:3000"

function resolveBaseDomain(domain?: string): string {
  return domain ?? process.env.DOMAIN ?? DEFAULT_DOMAIN
}

function resolveUrl(pathOrUrl: string, domain?: string): URL {
  const baseDomain = resolveBaseDomain(domain)

  try {
    return new URL(pathOrUrl)
  } catch {
    return new URL(pathOrUrl, baseDomain)
  }
}

export function createRequest(
  pathOrUrl = "/api/test?foo=bar",
  { method = "POST", domain, headers, body }: CreateRequestOptions = {}
): Request {
  const url = resolveUrl(pathOrUrl, domain)

  return new Request(url.toString(), {
    method,
    headers,
    body,
  })
}
