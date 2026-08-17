/**
 * HTTP request fence and response helpers for the /archived/api routes.
 * Loopback + same-origin checks make the destructive methods unreachable from
 * a cross-site page; the route whitelist and body limits bound what the
 * handler will ever parse.
 */
import type { IncomingMessage, ServerResponse } from 'node:http'

/** The exact set of methods this API serves; anything else is a 404. */
export const ARCHIVED_API_METHODS = new Set(['details', 'delete', 'delete-file', 'open-folder', 'archive', 'unarchive'])

/** Upper bound on a request body; larger bodies fail with 413. */
export const MAX_JSON_BODY_BYTES = 1024 * 1024

/** Read one header value as a string (headers may be string | string[]). */
function header(headers: IncomingMessage['headers'], name: string): string | undefined {
  const value = headers[name]
  return typeof value === 'string' ? value : undefined
}

/** Parse a Host/Origin authority into a URL, or undefined when malformed. */
function parseAuthority(authority: string): URL | undefined {
  try {
    return new URL(`http://${authority}`)
  } catch {
    return undefined
  }
}

/** Whether a hostname is loopback (localhost, [::1], or any 127.x.y.z). */
export function isLoopbackHostname(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]') return true
  const parts = hostname.split('.')
  return parts.length === 4 && parts[0] === '127'
    && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

/**
 * Decide whether a request may reach the destructive API. Trusts only a
 * loopback Host with no cross-site fetch marker and, when an Origin is sent,
 * an Origin host equal to the Host. A missing Origin is accepted (same-origin
 * navigation and non-browser callers send none).
 */
export function isTrustedApiRequest(request: IncomingMessage): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}

/** Parse a JSON request body with a size cap; empty bodies read as {}. */
export async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const contentType = header(req.headers, 'content-type')
  if (contentType !== undefined && !/^application\/json\b/i.test(contentType.trim())) {
    throw httpError(415, 'unsupported-media-type', 'content-type must be application/json')
  }
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk))
    total += buffer.length
    if (total > MAX_JSON_BODY_BYTES) throw httpError(413, 'body-too-large', 'request body too large')
    chunks.push(buffer)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (raw.trim() === '') return {}
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    throw httpError(400, 'bad-json', 'invalid JSON body')
  }
}

/** An error carrying an HTTP status and a stable machine code. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

/** Build an HttpError without a throw site needing to repeat the constructor. */
export function httpError(status: number, code: string, message: string): HttpError {
  return new HttpError(status, code, message)
}

/** Write a JSON response body with a status. */
export function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

/** Write a success envelope `{ ok: true, value }`. */
export function writeOk(res: ServerResponse, value: unknown): void {
  writeJson(res, 200, { ok: true, value })
}

/** Write a failure envelope `{ ok: false, error: { code, message } }`. */
export function writeFail(res: ServerResponse, message: string, status = 500, code = 'internal'): void {
  writeJson(res, status, { ok: false, error: { code, message } })
}

/** Normalize a caught error into its HTTP status and code for writeFail. */
export function errorStatus(error: unknown): { status: number; code: string } {
  if (error instanceof HttpError) return { status: error.status, code: error.code }
  if (error !== null && typeof error === 'object' && 'status' in error && typeof (error as { status: unknown }).status === 'number') {
    const status = (error as { status: number }).status
    const code = 'code' in error && typeof (error as { code: unknown }).code === 'string' ? (error as { code: string }).code : 'internal'
    return { status, code }
  }
  return { status: 500, code: 'internal' }
}
