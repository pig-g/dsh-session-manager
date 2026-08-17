/**
 * HTTP request fence and response helpers for the /archived/api routes.
 * Loopback + same-origin checks make the destructive methods unreachable from
 * a cross-site page; the route whitelist and body limits bound what the
 * handler will ever parse.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/** The exact set of methods this API serves; anything else is a 404. */
export declare const ARCHIVED_API_METHODS: Set<string>;
/** Upper bound on a request body; larger bodies fail with 413. */
export declare const MAX_JSON_BODY_BYTES: number;
/** Whether a hostname is loopback (localhost, [::1], or any 127.x.y.z). */
export declare function isLoopbackHostname(hostname: string): boolean;
/**
 * Decide whether a request may reach the destructive API. Trusts only a
 * loopback Host with no cross-site fetch marker and, when an Origin is sent,
 * an Origin host equal to the Host. A missing Origin is accepted (same-origin
 * navigation and non-browser callers send none).
 */
export declare function isTrustedApiRequest(request: IncomingMessage): boolean;
/** Parse a JSON request body with a size cap; empty bodies read as {}. */
export declare function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>>;
/** An error carrying an HTTP status and a stable machine code. */
export declare class HttpError extends Error {
    readonly status: number;
    readonly code: string;
    constructor(status: number, code: string, message: string);
}
/** Build an HttpError without a throw site needing to repeat the constructor. */
export declare function httpError(status: number, code: string, message: string): HttpError;
/** Write a JSON response body with a status. */
export declare function writeJson(res: ServerResponse, status: number, body: unknown): void;
/** Write a success envelope `{ ok: true, value }`. */
export declare function writeOk(res: ServerResponse, value: unknown): void;
/** Write a failure envelope `{ ok: false, error: { code, message } }`. */
export declare function writeFail(res: ServerResponse, message: string, status?: number, code?: string): void;
/** Normalize a caught error into its HTTP status and code for writeFail. */
export declare function errorStatus(error: unknown): {
    status: number;
    code: string;
};
