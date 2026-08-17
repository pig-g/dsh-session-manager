/**
 * Permanent single-session deletion. Deletes exactly one session (no subagent
 * cascade): detaches workspace accounting, drops archive-set membership when a
 * public primitive exists, and removes the backend-authoritative artifact.
 *
 * Safety rule (Fix 1): a session still loaded in the live SessionStore is
 * REFUSED. Filesystem removal under a live session would let the persistence
 * coordinator re-flush buffered writes and resurrect the log, so only cold
 * (disposed) sessions are deleted. A future public `sessions.remove()` /
 * `workspaceRegistry.deleteSession()` primitive upgrades this path when present.
 */
import { rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { httpError } from './fence.js';
/** Locate a session header by id: live store first, then persisted metadata. */
export async function findSessionMeta(ctx, sessionId) {
    const live = ctx.get('sessions')?.get(sessionId);
    if (live !== undefined)
        return live.header;
    const persistence = ctx.get('sessionPersistence');
    if (persistence !== undefined && typeof persistence.list === 'function') {
        for (const meta of await persistence.list())
            if (meta.id === sessionId)
                return meta;
    }
    return undefined;
}
/**
 * Drop one session id from the registry-global archive set, using only public
 * primitives. On a stock Harness neither primitive exists, so this is a no-op:
 * deleting an archived session can leave an orphan id in the official archive
 * set until a future `deleteSession`/`unarchiveSession` lands. The client's
 * archived view tolerates missing ids, so the orphan is cosmetic, not corrupting.
 */
async function dropFromArchiveSet(ctx, sessionId) {
    const registry = ctx.get('workspaceRegistry');
    if (registry?.deleteSession) {
        await registry.deleteSession(sessionId);
        return;
    }
    if (registry?.unarchiveSession) {
        await registry.unarchiveSession(sessionId);
        return;
    }
}
/**
 * Delete one stopped, cold session: detach workspace accounting, drop archive
 * membership (public primitive only), and remove the artifact directory via
 * the backend's own `locate` path. Subagent children and produced files are
 * intentionally left alone.
 */
export async function deleteSessionSingle(ctx, sessionId) {
    const registry = ctx.get('workspaceRegistry');
    const persistence = ctx.get('sessionPersistence');
    const meta = await findSessionMeta(ctx, sessionId);
    if (meta === undefined) {
        throw httpError(404, 'session-not-found', '找不到该会话的记录（会话不存在）');
    }
    // Preferred: a future public deleteSession handles accounting + archive
    // atomically inside the registry's serialized queue. Prefer it over the
    // best-effort fallback so we never fight the official mutation queue.
    if (registry?.deleteSession) {
        await registry.deleteSession(sessionId);
        return;
    }
    // Best-effort accounting detach: one workspace failing to detach must not
    // block the deletion, but it is logged.
    for (const ws of registry?.list() ?? []) {
        if (!ws.sessionIds.includes(sessionId))
            continue;
        try {
            await ws.detachSession(sessionId);
        }
        catch (error) {
            console.error(`[dsh-session-manager] detachSession failed for workspace "${ws.path}":`, error);
        }
    }
    await dropFromArchiveSet(ctx, sessionId);
    if (persistence !== undefined && typeof persistence.remove === 'function') {
        await persistence.remove(sessionId);
        return;
    }
    const location = persistence?.locate(meta);
    if (location !== undefined && location.path !== '') {
        // The backend authoritatively owns this path; its parent directory is the
        // session's own artifact directory, so a recursive remove is scoped to
        // exactly one session.
        await rm(dirname(location.path), { recursive: true, force: true });
    }
}
/**
 * Permanently delete one session. Running sessions are refused (409 busy);
 * sessions still loaded in the live store are refused (409 attached) unless a
 * public disposal primitive exists, because filesystem removal under a live
 * session can resurrect the log on the next flush.
 */
export async function deleteSession(ctx, sessionId) {
    const agents = ctx.get('agents');
    const sessions = ctx.get('sessions');
    const agent = agents?.get(sessionId);
    if (agent !== undefined && agent.status === 'running') {
        throw httpError(409, 'session-busy', '会话正在运行，无法删除；请先停止该会话');
    }
    const attached = sessions?.get(sessionId);
    if (attached !== undefined) {
        if (typeof sessions?.remove === 'function') {
            await sessions.remove(sessionId);
        }
        else {
            throw httpError(409, 'session-attached', '会话仍在内存中加载，无法安全删除；请完全关闭该会话或重启应用后再试');
        }
    }
    await deleteSessionSingle(ctx, sessionId);
    return { sessionId };
}
