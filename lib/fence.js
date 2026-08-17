/** The exact set of methods this API serves; anything else is a 404. */
export const ARCHIVED_API_METHODS = new Set(['details', 'delete', 'delete-file', 'open-folder', 'archive', 'unarchive']);
/** Upper bound on a request body; larger bodies fail with 413. */
export const MAX_JSON_BODY_BYTES = 1024 * 1024;
/** Read one header value as a string (headers may be string | string[]). */
function header(headers, name) {
    const value = headers[name];
    return typeof value === 'string' ? value : undefined;
}
/** Parse a Host/Origin authority into a URL, or undefined when malformed. */
function parseAuthority(authority) {
    try {
        return new URL(`http://${authority}`);
    }
    catch {
        return undefined;
    }
}
/** Whether a hostname is loopback (localhost, [::1], or any 127.x.y.z). */
export function isLoopbackHostname(hostname) {
    if (hostname === 'localhost' || hostname === '[::1]')
        return true;
    const parts = hostname.split('.');
    return parts.length === 4 && parts[0] === '127'
        && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/**
 * Decide whether a request may reach the destructive API. Trusts only a
 * loopback Host with no cross-site fetch marker and, when an Origin is sent,
 * an Origin host equal to the Host. A missing Origin is accepted (same-origin
 * navigation and non-browser callers send none).
 */
export function isTrustedApiRequest(request) {
    const host = header(request.headers, 'host');
    if (host === undefined)
        return false;
    const hostUrl = parseAuthority(host);
    if (hostUrl === undefined)
        return false;
    if (!isLoopbackHostname(hostUrl.hostname))
        return false;
    if (header(request.headers, 'sec-fetch-site') === 'cross-site')
        return false;
    const origin = header(request.headers, 'origin');
    if (origin === undefined)
        return true;
    try {
        return new URL(origin).host === hostUrl.host;
    }
    catch {
        return false;
    }
}
/** Parse a JSON request body with a size cap; empty bodies read as {}. */
export async function readJsonBody(req) {
    const contentType = header(req.headers, 'content-type');
    if (contentType !== undefined && !/^application\/json\b/i.test(contentType.trim())) {
        throw httpError(415, 'unsupported-media-type', 'content-type must be application/json');
    }
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        total += buffer.length;
        if (total > MAX_JSON_BODY_BYTES)
            throw httpError(413, 'body-too-large', 'request body too large');
        chunks.push(buffer);
    }
    const raw = Buffer.concat(chunks).toString('utf8');
    if (raw.trim() === '')
        return {};
    try {
        return JSON.parse(raw);
    }
    catch {
        throw httpError(400, 'bad-json', 'invalid JSON body');
    }
}
/** An error carrying an HTTP status and a stable machine code. */
export class HttpError extends Error {
    status;
    code;
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'HttpError';
    }
}
/** Build an HttpError without a throw site needing to repeat the constructor. */
export function httpError(status, code, message) {
    return new HttpError(status, code, message);
}
/** Write a JSON response body with a status. */
export function writeJson(res, status, body) {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(body));
}
/** Write a success envelope `{ ok: true, value }`. */
export function writeOk(res, value) {
    writeJson(res, 200, { ok: true, value });
}
/** Write a failure envelope `{ ok: false, error: { code, message } }`. */
export function writeFail(res, message, status = 500, code = 'internal') {
    writeJson(res, status, { ok: false, error: { code, message } });
}
/** Normalize a caught error into its HTTP status and code for writeFail. */
export function errorStatus(error) {
    if (error instanceof HttpError)
        return { status: error.status, code: error.code };
    if (error !== null && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
        const status = error.status;
        const code = 'code' in error && typeof error.code === 'string' ? error.code : 'internal';
        return { status, code };
    }
    return { status: 500, code: 'internal' };
}
