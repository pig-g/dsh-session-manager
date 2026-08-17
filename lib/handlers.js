/**
 * File deletion (workspace-scoped) and open-record-folder handlers.
 * File deletion only ever removes a plain file strictly inside a registered
 * workspace root, and — when a sessionId is supplied — only a file that the
 * session's detail snapshot lists as produced. Directories are rejected.
 */
import { spawn } from 'node:child_process';
import { stat, realpath, rm } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { buildDetails } from './details.js';
import { findSessionMeta } from './delete.js';
import { httpError } from './fence.js';
/** Simple throttle so mashing "open folder" does not spawn a window per click. */
let lastOpenedDir = '';
let lastOpenedAt = 0;
/** Open a directory in the OS file manager (fire-and-forget, cross-platform). */
async function openInFileManager(dir) {
    const now = Date.now();
    if (dir === lastOpenedDir && now - lastOpenedAt < 500)
        return { opened: false };
    lastOpenedDir = dir;
    lastOpenedAt = now;
    const command = process.platform === 'win32' ? 'explorer' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    await new Promise((resolveOpen, rejectOpen) => {
        const child = spawn(command, [dir], { detached: true, stdio: 'ignore' });
        let settled = false;
        child.once('error', (error) => { if (!settled) {
            settled = true;
            rejectOpen(error);
        } });
        child.once('spawn', () => { if (!settled) {
            settled = true;
            resolveOpen();
        } });
        child.unref();
    });
    return { opened: true };
}
/** Delete one workspace file, with ownership and containment checks. */
export async function deleteFile(ctx, path, sessionId) {
    const resolved = resolve(path);
    let target = resolved;
    try {
        target = await realpath(resolved);
    }
    catch {
        // Target may already be gone (deleted since last sync): keep the resolve
        // result; the containment fence still applies.
    }
    // Directories are never removable through this API (no recursive rm).
    try {
        const info = await stat(target);
        if (info.isDirectory())
            throw httpError(403, 'not-a-file', '只能删除文件，不能删除目录');
    }
    catch (error) {
        if (error instanceof Error && error.code === 'not-a-file')
            throw error;
        // Missing target: continue; rm below is force + idempotent.
    }
    // Ownership: when a sessionId is supplied, the path must be one of that
    // session's produced files.
    if (sessionId !== '') {
        const details = await buildDetails(ctx, sessionId);
        const known = new Set(details.files.map((file) => file.path));
        if (!known.has(path))
            throw httpError(403, 'not-produced-file', '只能删除该会话产出文件列表中的文件');
    }
    // Containment: the target must live inside a registered workspace root
    // (realpath'd) and must not BE the root.
    const registry = ctx.get('workspaceRegistry');
    const roots = (registry?.list() ?? []).map((ws) => ws.path);
    let allowed = false;
    for (const root of roots) {
        let rootResolved = resolve(root);
        try {
            rootResolved = await realpath(rootResolved);
        }
        catch {
            // Root moved/deleted: keep the resolved result.
        }
        rootResolved = rootResolved.replace(/[\\/]+$/, '');
        if (rootResolved === '')
            continue;
        if (target.startsWith(rootResolved + sep) && target !== rootResolved) {
            allowed = true;
            break;
        }
    }
    if (!allowed)
        throw httpError(403, 'outside-workspace', '只能删除工作区内的文件');
    await rm(target, { recursive: false, force: true });
    return { path: target, deleted: true };
}
/** Open a session's record folder in the OS file manager. */
export async function openSessionFolder(ctx, sessionId) {
    const meta = await findSessionMeta(ctx, sessionId);
    if (meta === undefined)
        throw httpError(404, 'session-not-found', '找不到该会话的记录目录（会话不存在）');
    const persistence = ctx.get('sessionPersistence');
    const location = persistence?.locate(meta);
    if (location === undefined || location.path === '') {
        throw httpError(404, 'no-cwd', '该会话没有关联的工作目录，无法定位记录文件夹');
    }
    const dir = dirname(location.path);
    try {
        await stat(dir);
    }
    catch {
        throw httpError(404, 'folder-not-found', '会话记录文件夹不存在（可能已被删除）');
    }
    await openInFileManager(dir);
    return { sessionId, path: dir, opened: true };
}
