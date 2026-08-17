import { mkdtemp, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from '../lib/fence.js'
import { deleteSession, deleteSessionSingle, findSessionMeta } from '../lib/delete.js'
import type { PluginContext } from '../lib/types.js'

/** A minimal fake context over an explicit service table. */
function ctx(services: Record<string, unknown>): PluginContext {
  return { get: (name: string) => services[name], effect: () => {} }
}

const session = (id: string) => ({ header: { id }, events: [] })
const meta = (id: string) => ({ id })

let tempDirs: string[] = []
afterEach(async () => {
  const { rm } = await import('node:fs/promises')
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })))
  tempDirs = []
})

describe('findSessionMeta', () => {
  it('prefers a live session header over persisted metadata', async () => {
    const live = ctx({ sessions: { get: () => session('live') } })
    await expect(findSessionMeta(live, 'live')).resolves.toEqual({ id: 'live' })
  })

  it('falls back to the persistence listing when not live', async () => {
    const cold = ctx({ sessions: { get: () => undefined }, sessionPersistence: { list: async () => [meta('cold')] } })
    await expect(findSessionMeta(cold, 'cold')).resolves.toEqual({ id: 'cold' })
  })

  it('returns undefined when the session is neither live nor persisted', async () => {
    const none = ctx({ sessions: { get: () => undefined }, sessionPersistence: { list: async () => [] } })
    await expect(findSessionMeta(none, 'ghost')).resolves.toBeUndefined()
  })
})

describe('deleteSession', () => {
  it('refuses a running session with 409 session-busy', async () => {
    const c = ctx({ agents: { get: () => ({ status: 'running' }) }, sessions: { get: () => session('s1') } })
    await expect(deleteSession(c, 's1')).rejects.toMatchObject({ status: 409, code: 'session-busy' })
  })

  it('refuses a still-attached session with 409 session-attached (Fix 1)', async () => {
    const c = ctx({ agents: { get: () => ({ status: 'stopped' }) }, sessions: { get: () => session('s1') } })
    await expect(deleteSession(c, 's1')).rejects.toMatchObject({ status: 409, code: 'session-attached' })
  })

  it('disposes via a public sessions.remove when present, then deletes', async () => {
    const remove = vi.fn(async () => {})
    const locate = vi.fn(() => undefined)
    const c = ctx({
      agents: { get: () => undefined },
      sessions: { get: () => session('s1'), remove },
      sessionPersistence: { list: async () => [meta('s1')], locate },
      workspaceRegistry: { list: () => [] },
    })
    await deleteSession(c, 's1')
    expect(remove).toHaveBeenCalledWith('s1')
  })

  it('deletes a cold session by removing its backend-authoritative directory', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'dsh-sm-delete-'))
    tempDirs.push(dir)
    const artifact = join(dir, 'log.jsonl.zstd')
    await writeFile(artifact, '{}')
    const c = ctx({
      agents: { get: () => undefined },
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [meta('s1')], locate: () => ({ kind: 'jsonl', path: artifact }) },
      workspaceRegistry: { list: () => [] },
    })
    await deleteSession(c, 's1')
    await expect(stat(dir)).rejects.toMatchObject({ code: 'ENOENT' })
  })
})

describe('deleteSessionSingle', () => {
  it('404s for an unknown session', async () => {
    const c = ctx({ sessions: { get: () => undefined }, sessionPersistence: { list: async () => [] } })
    await expect(deleteSessionSingle(c, 'ghost')).rejects.toMatchObject({ status: 404, code: 'session-not-found' })
  })

  it('detaches workspace accounting before removing the artifact', async () => {
    const detachSession = vi.fn(async () => {})
    const dir = await mkdtemp(join(tmpdir(), 'dsh-sm-single-'))
    tempDirs.push(dir)
    const artifact = join(dir, 'log.jsonl.zstd')
    await writeFile(artifact, '{}')
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [meta('s1')], locate: () => ({ kind: 'jsonl', path: artifact }) },
      workspaceRegistry: { list: () => [{ path: '/w', sessionIds: ['s1'], detachSession }] },
    })
    await deleteSessionSingle(c, 's1')
    expect(detachSession).toHaveBeenCalledWith('s1')
    await expect(stat(dir)).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('prefers a public registry.deleteSession primitive and skips the fallback', async () => {
    const registryDelete = vi.fn(async () => {})
    const locate = vi.fn(() => ({ kind: 'jsonl', path: '/tmp/should-not-exist' }))
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [meta('s1')], locate },
      workspaceRegistry: { list: () => [], deleteSession: registryDelete },
    })
    await deleteSessionSingle(c, 's1')
    expect(registryDelete).toHaveBeenCalledWith('s1')
    expect(locate).not.toHaveBeenCalled()
  })

  it('throws an HttpError, not a bare Error, for unknown sessions', async () => {
    const c = ctx({ sessions: { get: () => undefined }, sessionPersistence: { list: async () => [] } })
    const error = await deleteSessionSingle(c, 'ghost').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(HttpError)
  })
})
