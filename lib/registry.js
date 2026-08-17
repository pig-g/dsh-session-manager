/**
 * Archive / unarchive handlers. Both use only public registry primitives:
 * archive calls the public `archiveSession`; unarchive requires a public
 * `unarchiveSession` primitive and returns 501 on a stock Harness that has
 * none. Fix 2: no private `requireState`/`setState` reach — those members are
 * TypeScript-private and only callable by type-erasure, which breaks on a
 * refactor; a clean plugin degrades instead of poking them.
 */
import { findSessionMeta } from './delete.js';
import { httpError } from './fence.js';
/** Archive one session into the registry-global archive set (public API). */
export async function archiveSession(ctx, sessionId) {
    const registry = ctx.get('workspaceRegistry');
    if (registry === undefined || typeof registry.archiveSession !== 'function') {
        throw httpError(501, 'unsupported', 'This Harness version does not support archiving sessions (workspaceRegistry.archiveSession is unavailable)');
    }
    const meta = await findSessionMeta(ctx, sessionId);
    if (meta === undefined) {
        throw httpError(404, 'session-not-found', 'Session not found');
    }
    await registry.archiveSession(sessionId);
    return { sessionId, archived: true };
}
/** Unarchive one session. Requires a public unarchive primitive; 501 without it. */
export async function unarchiveSession(ctx, sessionId) {
    const registry = ctx.get('workspaceRegistry');
    if (registry === undefined || typeof registry.unarchiveSession !== 'function') {
        throw httpError(501, 'unsupported', 'This Harness version does not support unarchiving sessions (workspaceRegistry.unarchiveSession is unavailable)');
    }
    const meta = await findSessionMeta(ctx, sessionId);
    if (meta === undefined) {
        throw httpError(404, 'session-not-found', 'Session not found');
    }
    await registry.unarchiveSession(sessionId);
    return { sessionId, archived: false };
}
