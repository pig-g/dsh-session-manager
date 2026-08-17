/**
 * File deletion (workspace-scoped) and open-record-folder handlers.
 * File deletion only ever removes a plain file strictly inside a registered
 * workspace root, and — when a sessionId is supplied — only a file that the
 * session's detail snapshot lists as produced. Directories are rejected.
 */
import { spawn } from 'node:child_process'
import { stat, realpath, rm } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import { buildDetails } from './details.js'
import { findSessionMeta } from './delete.js'
import { httpError } from './fence.js'
import type { PluginContext, SessionPersistence, WorkspaceRegistry } from './types.js'

/** Simple throttle so mashing "open folder" does not spawn a window per click. */
let lastOpenedDir = ''
let lastOpenedAt = 0

/** Open a directory in the OS file manager (fire-and-forget, cross-platform). */
async function openInFileManager(dir: string): Promise<{ opened: boolean }> {
  const now = Date.now()
  if (dir === lastOpenedDir && now - lastOpenedAt < 500) return { opened: false }
  lastOpenedDir = dir
  lastOpenedAt = now
  const command = process.platform === 'win32' ? 'explorer' : process.platform === 'darwin' ? 'open' : 'xdg-open'
  await new Promise<void>((resolveOpen, rejectOpen) => {
    const child = spawn(command, [dir], { detached: true, stdio: 'ignore' })
    let settled = false
    child.once('error', (error) => { if (!settled) { settled = true; rejectOpen(error) } })
    child.once('spawn', () => { if (!settled) { settled = true; resolveOpen() } })
    child.unref()
  })
  return { opened: true }
}

/** Delete one workspace file, with ownership and containment checks. */
export async function deleteFile(ctx: PluginContext, path: string, sessionId: string): Promise<{ path: string; deleted: true }> {
  const resolved = resolve(path)
  let target = resolved
  try {
    target = await realpath(resolved)
  } catch {
    // Target may already be gone (deleted since last sync): keep the resolve
    // result; the containment fence still applies.
  }

  // Directories are never removable through this API (no recursive rm).
  try {
    const info = await stat(target)
    if (info.isDirectory()) throw httpError(403, 'not-a-file', 'Only files can be deleted, not directories')
  } catch (error) {
    if (error instanceof Error && (error as { code?: string }).code === 'not-a-file') throw error
    // Missing target: continue; rm below is force + idempotent.
  }

  // Ownership: when a sessionId is supplied, the path must be one of that
  // session's produced files.
  if (sessionId !== '') {
    const details = await buildDetails(ctx, sessionId)
    const known = new Set(details.files.map((file) => file.path))
    if (!known.has(path)) throw httpError(403, 'not-produced-file', 'Only files produced by this session can be deleted')
  }

  // Containment: the target must live inside a registered workspace root
  // (realpath'd) and must not BE the root.
  const registry = ctx.get<WorkspaceRegistry>('workspaceRegistry')
  const roots = (registry?.list() ?? []).map((ws) => ws.path)
  let allowed = false
  for (const root of roots) {
    let rootResolved = resolve(root)
    try {
      rootResolved = await realpath(rootResolved)
    } catch {
      // Root moved/deleted: keep the resolved result.
    }
    rootResolved = rootResolved.replace(/[\\/]+$/, '')
    if (rootResolved === '') continue
    if (target.startsWith(rootResolved + sep) && target !== rootResolved) {
      allowed = true
      break
    }
  }
  if (!allowed) throw httpError(403, 'outside-workspace', 'Only files inside a workspace can be deleted')

  await rm(target, { recursive: false, force: true })
  return { path: target, deleted: true }
}

/** Open a session's record folder in the OS file manager. */
export async function openSessionFolder(ctx: PluginContext, sessionId: string): Promise<{ sessionId: string; path: string; opened: boolean }> {
  const meta = await findSessionMeta(ctx, sessionId)
  if (meta === undefined) throw httpError(404, 'session-not-found', 'Session record folder not found (session does not exist)')
  const persistence = ctx.get<SessionPersistence>('sessionPersistence')
  const location = persistence?.locate(meta)
  if (location === undefined || location.path === '') {
    throw httpError(404, 'no-cwd', 'The session has no associated working directory, so its record folder cannot be located')
  }
  const dir = dirname(location.path)
  try {
    await stat(dir)
  } catch {
    throw httpError(404, 'folder-not-found', 'Session record folder does not exist (it may have been deleted)')
  }
  await openInFileManager(dir)
  return { sessionId, path: dir, opened: true }
}
