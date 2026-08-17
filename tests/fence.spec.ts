import { describe, expect, it, vi } from 'vitest'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  HttpError,
  errorStatus,
  isLoopbackHostname,
  isTrustedApiRequest,
  readJsonBody,
  writeFail,
  writeJson,
  writeOk,
} from '../lib/fence.js'

function req(headers: Record<string, string>): IncomingMessage {
  return { headers } as IncomingMessage
}

/** An async-iterable request body of JSON text (plus headers). */
function jsonReq(raw: string, headers: Record<string, string> = {}): IncomingMessage {
  const stream = {
    headers,
    [Symbol.asyncIterator]() {
      let done = false
      return {
        next: () => {
          if (done) return Promise.resolve({ done: true, value: undefined })
          done = true
          return Promise.resolve({ done: false, value: Buffer.from(raw) })
        },
      }
    },
  }
  return stream as unknown as IncomingMessage
}

function mockRes(): { res: ServerResponse; status: () => number; body: () => unknown } {
  let status = 0
  let payload = ''
  const res = {
    writeHead(code: number) { status = code },
    end(data: string) { payload = data },
  } as unknown as ServerResponse
  return { res, status: () => status, body: () => JSON.parse(payload) }
}

describe('isLoopbackHostname', () => {
  it('accepts localhost, bracketed IPv6 loopback, and 127.x', () => {
    expect(isLoopbackHostname('localhost')).toBe(true)
    expect(isLoopbackHostname('[::1]')).toBe(true)
    expect(isLoopbackHostname('127.0.0.1')).toBe(true)
    expect(isLoopbackHostname('127.1.2.3')).toBe(true)
  })

  it('rejects non-loopback hosts and malformed 127 segments', () => {
    expect(isLoopbackHostname('192.168.1.1')).toBe(false)
    expect(isLoopbackHostname('example.com')).toBe(false)
    expect(isLoopbackHostname('127.0.0.256')).toBe(false)
  })
})

describe('isTrustedApiRequest', () => {
  it('accepts a loopback host with no origin or a matching origin', () => {
    expect(isTrustedApiRequest(req({ host: '127.0.0.1:3080' }))).toBe(true)
    expect(isTrustedApiRequest(req({ host: 'localhost:3080', origin: 'http://localhost:3080' }))).toBe(true)
  })

  it('rejects a missing host, non-loopback host, cross-site fetch, and mismatched origin', () => {
    expect(isTrustedApiRequest(req({}))).toBe(false)
    expect(isTrustedApiRequest(req({ host: 'evil.example:80' }))).toBe(false)
    expect(isTrustedApiRequest(req({ host: '127.0.0.1:3080', 'sec-fetch-site': 'cross-site' }))).toBe(false)
    expect(isTrustedApiRequest(req({ host: '127.0.0.1:3080', origin: 'http://evil.example' }))).toBe(false)
  })
})

describe('readJsonBody', () => {
  it('parses a valid body and returns {} for empty', async () => {
    await expect(readJsonBody(jsonReq('{"a":1}'))).resolves.toEqual({ a: 1 })
    await expect(readJsonBody(jsonReq('  '))).resolves.toEqual({})
  })

  it('rejects a non-JSON content type with 415', async () => {
    await expect(readJsonBody(jsonReq('x', { 'content-type': 'text/plain' }))).rejects.toMatchObject({ status: 415 })
  })

  it('rejects invalid JSON with 400', async () => {
    await expect(readJsonBody(jsonReq('{nope'))).rejects.toMatchObject({ status: 400, code: 'bad-json' })
  })
})

describe('write helpers', () => {
  it('writeOk and writeFail produce the agreed envelopes', () => {
    const ok = mockRes()
    writeOk(ok.res, { sessionId: 's1' })
    expect(ok.status()).toBe(200)
    expect(ok.body()).toEqual({ ok: true, value: { sessionId: 's1' } })

    const fail = mockRes()
    writeFail(fail.res, 'boom', 404, 'session-not-found')
    expect(fail.status()).toBe(404)
    expect(fail.body()).toEqual({ ok: false, error: { code: 'session-not-found', message: 'boom' } })
  })

  it('errorStatus maps HttpError and plain status-bearing errors', () => {
    expect(errorStatus(new HttpError(409, 'session-busy', 'x'))).toEqual({ status: 409, code: 'session-busy' })
    expect(errorStatus({ status: 403, code: 'forbidden', message: 'x' })).toEqual({ status: 403, code: 'forbidden' })
    expect(errorStatus(new Error('x'))).toEqual({ status: 500, code: 'internal' })
  })
})
