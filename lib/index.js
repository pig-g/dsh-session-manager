/**
 * dsh-session-manager — host half.
 *
 * A self-contained in-Settings session manager exposing a fenced JSON API
 * under /archived/api that the client calls:
 *   details { sessionId }     → per-session detail snapshot
 *   delete  { sessionId }     → permanently delete one cold session
 *   delete-file { path, sessionId } → delete one produced workspace file
 *   open-folder { sessionId } → open a session's record folder
 *   archive / unarchive       → archive-set membership (unarchive 501s on stock)
 *
 * Deletion is non-cascading (subagents, forks, and produced files survive) and
 * refuses running or still-attached sessions. Archive/unarchive use only public
 * registry primitives — no TypeScript-private `requireState`/`setState` reach.
 */
import { ARCHIVED_API_METHODS, errorStatus, isTrustedApiRequest, readJsonBody, writeFail, writeJson, writeOk } from './fence.js';
import { deleteSession } from './delete.js';
import { archiveSession, unarchiveSession } from './registry.js';
import { buildDetails } from './details.js';
import { deleteFile, openSessionFolder } from './handlers.js';
export const name = 'dsh-session-manager';
// agentLoop is an optional capability (missing it degrades, rather than blocks
// startup), so it stays out of `inject` and is read via ctx.get where needed.
export const inject = ['webServer', 'sessions', 'sessionPersistence', 'workspaceRegistry', 'agents'];
/** Register the /archived/api route and wire each method to its handler. */
export function apply(ctx) {
    ctx.effect(() => {
        const server = ctx.get('webServer');
        if (server === undefined)
            return;
        return server.register({
            kind: 'prefix',
            path: '/archived/api',
            handler: async (req, res) => {
                if (!isTrustedApiRequest(req)) {
                    writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } });
                    return;
                }
                if (req.method !== 'POST') {
                    writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } });
                    return;
                }
                const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname;
                const method = pathname.startsWith('/archived/api/') ? pathname.slice('/archived/api/'.length) : undefined;
                if (method === undefined || method.includes('/') || method === '') {
                    writeJson(res, 404, { ok: false, error: { code: 'not-found', message: 'unknown archived API method' } });
                    return;
                }
                if (!ARCHIVED_API_METHODS.has(method)) {
                    writeJson(res, 404, { ok: false, error: { code: 'not-found', message: `unknown archived API method "${method}"` } });
                    return;
                }
                try {
                    const payload = await readJsonBody(req);
                    if (method === 'delete-file') {
                        const path = typeof payload.path === 'string' ? payload.path : '';
                        if (path === '') {
                            writeJson(res, 400, { ok: false, error: { code: 'bad-request', message: 'path is required' } });
                            return;
                        }
                        const ownerSessionId = typeof payload.sessionId === 'string' ? payload.sessionId : '';
                        writeOk(res, await deleteFile(ctx, path, ownerSessionId));
                        return;
                    }
                    const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : '';
                    if (sessionId === '' || sessionId.length > 200) {
                        writeJson(res, 400, {
                            ok: false,
                            error: { code: 'bad-request', message: sessionId === '' ? 'sessionId is required' : 'sessionId is too long' },
                        });
                        return;
                    }
                    if (method === 'details')
                        writeOk(res, await buildDetails(ctx, sessionId));
                    else if (method === 'delete')
                        writeOk(res, await deleteSession(ctx, sessionId));
                    else if (method === 'open-folder')
                        writeOk(res, await openSessionFolder(ctx, sessionId));
                    else if (method === 'archive')
                        writeOk(res, await archiveSession(ctx, sessionId));
                    else if (method === 'unarchive')
                        writeOk(res, await unarchiveSession(ctx, sessionId));
                    else
                        writeJson(res, 404, { ok: false, error: { code: 'not-found', message: `unknown archived API method "${method}"` } });
                }
                catch (error) {
                    const { status, code } = errorStatus(error);
                    writeFail(res, error instanceof Error ? error.message : String(error), status, code);
                }
            },
        });
    }, 'dsh-session-manager: /archived/api routes');
}
