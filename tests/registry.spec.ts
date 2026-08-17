import { describe, expect, it, vi } from 'vitest'
import { archiveSession, unarchiveSession } from '../lib/registry.js'
import type { PluginContext } from '../lib/types.js'

function ctx(services: Record<string, unknown>): PluginContext {
  return { get: (name: string) => services[name], effect: () => {} }
}

describe('archiveSession', () => {
  it('returns 501 when the registry has no public archiveSession', async () => {
    const c = ctx({ workspaceRegistry: {} })
    await expect(archiveSession(c, 's1')).rejects.toMatchObject({ status: 501, code: 'unsupported' })
  })

  it('404s for an unknown session before archiving', async () => {
    const archive = vi.fn(async () => {})
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [] },
      workspaceRegistry: { archiveSession: archive },
    })
    await expect(archiveSession(c, 'ghost')).rejects.toMatchObject({ status: 404, code: 'session-not-found' })
    expect(archive).not.toHaveBeenCalled()
  })

  it('calls the public archiveSession for a known session', async () => {
    const archive = vi.fn(async () => {})
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [{ id: 's1' }] },
      workspaceRegistry: { archiveSession: archive },
    })
    await expect(archiveSession(c, 's1')).resolves.toEqual({ sessionId: 's1', archived: true })
    expect(archive).toHaveBeenCalledWith('s1')
  })
})

describe('unarchiveSession', () => {
  it('returns 501 on a stock Harness with no public unarchiveSession (Fix 2)', async () => {
    const c = ctx({ workspaceRegistry: { archiveSession: async () => {} } })
    await expect(unarchiveSession(c, 's1')).rejects.toMatchObject({ status: 501, code: 'unsupported' })
  })

  it('404s for an unknown session when a public unarchive primitive exists', async () => {
    const unarchive = vi.fn(async () => {})
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [] },
      workspaceRegistry: { unarchiveSession: unarchive },
    })
    await expect(unarchiveSession(c, 'ghost')).rejects.toMatchObject({ status: 404, code: 'session-not-found' })
    expect(unarchive).not.toHaveBeenCalled()
  })

  it('calls the public unarchiveSession when present', async () => {
    const unarchive = vi.fn(async () => {})
    const c = ctx({
      sessions: { get: () => undefined },
      sessionPersistence: { list: async () => [{ id: 's1' }] },
      workspaceRegistry: { unarchiveSession: unarchive },
    })
    await expect(unarchiveSession(c, 's1')).resolves.toEqual({ sessionId: 's1', archived: false })
    expect(unarchive).toHaveBeenCalledWith('s1')
  })
})
