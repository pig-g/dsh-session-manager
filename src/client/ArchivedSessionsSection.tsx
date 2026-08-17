/**
 * The Session manager panel component: two tabs (All / Archived), flat or
 * by-workspace views, batch archive / unarchive / delete with confirmation,
 * expandable per-session details, subagent nesting, and open-record-folder.
 * Pure presentation: all data arrives through the four prop shares.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  IconCheckOutline16,
  IconFolderOpenOutline16,
  IconTriangleRightFill14,
  Modal,
} from '@deepseek-ai/dsh-client-ui-primitives'
import css from './ArchivedSessions.module.css'

type Translate = (key: string) => string

interface SessionSummary {
  readonly id: string
  readonly title?: string
  readonly displayTitle: string
  readonly parentId?: string
  readonly origin?: 'subagent'
  readonly blank: boolean
  readonly updatedAt?: number
  readonly projectionValues?: { readonly title?: string }
}

interface SessionsSnapshot {
  readonly byId: Record<string, SessionSummary>
  readonly current: string | undefined
  readonly phase: string
}

interface WorkspaceView {
  readonly workspaceId: string
  readonly title: string
  readonly sessionIds: readonly string[]
}

interface WorkspacesSnapshot {
  readonly items: readonly WorkspaceView[]
  readonly archivedSessionIds: readonly string[]
  readonly state: string
  readonly baselinesReady: boolean
  readonly error: unknown
}

interface Row {
  id: string
  title: string
  updatedAt?: number
  current: boolean
  subagent: boolean
  parentId?: string
}

interface FileEntry {
  path: string
  tool: string
}

interface SessionDetails {
  sessionId: string
  sizeBytes: number | null
  createdAt: number | null
  updatedAt: number | null
  files: readonly FileEntry[]
  stats: {
    turns: number
    steps: number
    userMessages: number
    assistantMessages: number
    toolCalls: number
    attachments: number
    toolCounts: Record<string, number>
    fetches: readonly { tool: string; query?: string }[]
  }
  lineage: { parentSessionId: string | null; children: readonly string[] }
}

interface Props {
  useSessions: <T>(selector: (snapshot: SessionsSnapshot) => T) => T
  useWorkspaces: <T>(selector: (snapshot: WorkspacesSnapshot) => T) => T
  refresh: () => Promise<void>
  t: Translate
}

/** Default request timeout; a hung fetch otherwise leaves the row "loading" forever. */
const API_TIMEOUT_MS = 15e3
/** Upper bound for the per-session detail cache (LRU eviction). */
const DETAILS_CACHE_LIMIT = 50

async function api(method: string, payload?: Record<string, unknown>, options?: { timeoutMs?: number }): Promise<unknown> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options?.timeoutMs ?? API_TIMEOUT_MS)
  let response: Response
  try {
    response = await fetch(`/archived/api/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload ?? {}),
      signal: controller.signal,
    })
  } catch (error) {
    clearTimeout(timer)
    if (error instanceof Error && error.name === 'AbortError') throw new Error(`archived API ${method} timed out`)
    throw error
  }
  let body: unknown
  try {
    body = await response.json()
  } catch (error) {
    clearTimeout(timer)
    if (error instanceof Error && error.name === 'AbortError') throw new Error(`archived API ${method} timed out`)
    throw new Error(`archived API ${method} returned a non-JSON response (${response.status})`)
  }
  clearTimeout(timer)
  if (body === null || typeof body !== 'object' || (body as { ok?: unknown }).ok !== true) {
    const message = (body as { error?: { message?: string } } | null)?.error?.message
      ?? `archived API ${method} failed (${response.status})`
    throw new Error(message)
  }
  return (body as { value: unknown }).value
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unit = -1
  do {
    value /= 1024
    unit++
  } while (value >= 1024 && unit < units.length - 1)
  return `${value >= 100 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`
}

function shortId(id: string): string {
  return id.length > 20 ? `${id.slice(0, 10)}…${id.slice(-4)}` : id
}

function sessionTitleOf(s: SessionSummary | undefined, fallbackId?: string): string {
  if (s === undefined) return typeof fallbackId === 'string' && fallbackId !== '' ? shortId(fallbackId) : ''
  const projected = s.projectionValues && typeof s.projectionValues === 'object' ? s.projectionValues.title : undefined
  if (typeof projected === 'string' && projected !== '') return projected
  if (typeof s.title === 'string' && s.title !== '') return s.title
  if (typeof s.displayTitle === 'string' && s.displayTitle !== '') return s.displayTitle
  return shortId(s.id)
}

function relativeTime(updatedAt: number, now: number): { unit: string; n: number } {
  const diff = Math.max(0, now - updatedAt)
  const minute = 60 * 1e3
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return { unit: 'now', n: 0 }
  if (diff < hour) return { unit: 'minutes', n: Math.floor(diff / minute) }
  if (diff < day) return { unit: 'hours', n: Math.floor(diff / hour) }
  if (diff < 30 * day) return { unit: 'days', n: Math.floor(diff / day) }
  if (diff < 365 * day) return { unit: 'months', n: Math.floor(diff / (30 * day)) }
  return { unit: 'years', n: Math.floor(diff / (365 * day)) }
}

function timeLabel(updatedAt: number, now: number, t: Translate): string {
  const { unit, n } = relativeTime(updatedAt, now)
  if (unit === 'now') return t('time.now')
  return t(`time.${unit}`).replace('{n}', String(n))
}

export function ArchivedSessionsSection({ useSessions, useWorkspaces, refresh, t }: Props) {
  const sessions = useSessions((s) => s)
  const workspaceState = useWorkspaces((s) => s)
  const archivedIds = workspaceState?.archivedSessionIds ?? []
  const workspaceItems = workspaceState?.items ?? []
  const byId = sessions?.byId ?? {}
  const current = sessions?.current

  const listPhase = sessions?.phase
  const workspacesState = workspaceState?.state
  const baselinesReady = workspaceState?.baselinesReady
  const workspaceError = workspaceState?.error

  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 60e3)
    return () => clearInterval(timer)
  }, [])
  const now = Date.now()

  const [tab, setTab] = useState<'all' | 'archived'>('all')
  const [viewMode, setViewMode] = useState<'flat' | 'workspace'>('flat')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedParents, setExpandedParents] = useState<Set<string>>(() => new Set())
  const toggleSubagents = useCallback((id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const archivedSet = useMemo(() => new Set(archivedIds), [archivedIds])

  const allRows = useMemo(() => {
    const sortRows = (rows: Row[]) => rows.sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    })
    if (tab === 'archived') {
      return sortRows([...archivedIds].map((id) => ({
        id,
        title: sessionTitleOf(byId[id], id),
        updatedAt: byId[id]?.updatedAt,
        current: id === current,
        subagent: byId[id]?.origin === 'subagent',
        parentId: byId[id]?.parentId,
      })))
    }
    const all: Row[] = []
    for (const [id, s] of Object.entries(byId)) {
      if (archivedSet.has(id)) continue
      if (s.blank) continue
      all.push({
        id,
        title: sessionTitleOf(s),
        updatedAt: s.updatedAt,
        current: id === current,
        subagent: s.origin === 'subagent',
        parentId: s.parentId,
      })
    }
    return sortRows(all)
  }, [tab, archivedIds, archivedSet, byId, current])

  const rowIndex = useMemo(() => {
    const idSet = new Set<string>()
    const rowById = new Map<string, Row>()
    for (const row of allRows) {
      idSet.add(row.id)
      rowById.set(row.id, row)
    }
    return { idSet, rowById }
  }, [allRows])

  const subagentCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const s of Object.values(byId)) {
      if (s.origin !== 'subagent' || s.parentId === undefined) continue
      counts.set(s.parentId, (counts.get(s.parentId) ?? 0) + 1)
    }
    return counts
  }, [byId])

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (q === '') return allRows
    return allRows.filter((row) => row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q))
  }, [allRows, searchQuery])

  const displayRows = useMemo(() => {
    const childrenOf = new Map<string, Row[]>()
    const tops: Row[] = []
    for (const row of filteredRows) {
      if (!row.subagent || row.parentId === undefined || !rowIndex.idSet.has(row.parentId)) {
        tops.push(row)
      } else {
        const list = childrenOf.get(row.parentId) ?? []
        list.push(row)
        childrenOf.set(row.parentId, list)
      }
    }
    const result: Row[] = []
    for (const top of tops) {
      result.push(top)
      const kids = childrenOf.get(top.id)
      if (kids !== undefined && expandedParents.has(top.id)) {
        for (const kid of kids.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))) result.push(kid)
      }
    }
    return result
  }, [filteredRows, expandedParents, rowIndex])

  const groups = useMemo(() => {
    if (tab !== 'all' || viewMode !== 'workspace') return []
    const childrenOf = new Map<string, Row[]>()
    for (const row of filteredRows) {
      if (!row.subagent || row.parentId === undefined || !rowIndex.idSet.has(row.parentId)) continue
      const list = childrenOf.get(row.parentId) ?? []
      list.push(row)
      childrenOf.set(row.parentId, list)
    }
    const lineageOf = (id: string): string[] => {
      const ids: string[] = []
      const visited = new Set<string>()
      const walk = (nodeId: string): void => {
        if (visited.has(nodeId)) return
        visited.add(nodeId)
        ids.push(nodeId)
        const kids = childrenOf.get(nodeId)
        if (kids !== undefined) for (const kid of kids) walk(kid.id)
      }
      walk(id)
      return ids
    }
    const attachKids = (rows: Row[]): Row[] => {
      const result: Row[] = []
      for (const row of rows) {
        result.push(row)
        const kids = childrenOf.get(row.id)
        if (kids !== undefined && expandedParents.has(row.id)) {
          for (const kid of kids.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))) result.push(kid)
        }
      }
      return result
    }
    const byWorkspace = workspaceItems.map((ws) => {
      const tops = (ws.sessionIds ?? []).map((id) => rowIndex.rowById.get(id)).filter((row): row is Row => row !== undefined)
      tops.sort((a, b) => {
        if (a.current !== b.current) return a.current ? -1 : 1
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
      })
      return {
        key: ws.workspaceId,
        label: ws.title,
        rows: attachKids(tops),
        allIds: tops.flatMap((top) => lineageOf(top.id)),
      }
    }).filter((group) => group.rows.length > 0)
    const accounted = new Set(byWorkspace.flatMap((group) => group.allIds))
    const ungrouped = filteredRows.filter((row) => !accounted.has(row.id) && (!row.subagent || row.parentId === undefined || !rowIndex.idSet.has(row.parentId)))
    ungrouped.sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    })
    const result = [...byWorkspace]
    if (ungrouped.length > 0) result.push({ key: '__ungrouped__', label: t('group.ungrouped'), rows: attachKids(ungrouped), allIds: [] })
    return result
  }, [tab, viewMode, workspaceItems, filteredRows, expandedParents, t, rowIndex])

  const rows = viewMode === 'workspace' && tab === 'all' ? groups.flatMap((group) => group.rows) : displayRows
  const loading = (listPhase === 'pending' || workspacesState === 'loading') && rows.length === 0
  const selectableIds = useMemo(() => rows.filter((row) => !row.current).map((row) => row.id), [rows])

  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const BATCH_SIZE = 20
  const runBatch = async (method: string, targets: string[]): Promise<number> => {
    const results: PromiseSettledResult<unknown>[] = []
    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const chunk = targets.slice(i, i + BATCH_SIZE)
      const settled = await Promise.allSettled(chunk.map((id) => api(method, { sessionId: id })))
      results.push(...settled)
    }
    const okCount = results.filter((r) => r.status === 'fulfilled').length
    const failCount = results.length - okCount
    if (failCount > 0) {
      const firstFail = results.find((r) => r.status === 'rejected')
      const detail = firstFail && firstFail.reason instanceof Error ? firstFail.reason.message : ''
      throw new Error(t('batchResult').replace('{ok}', String(okCount)).replace('{fail}', String(failCount)) + (detail ? `: ${detail}` : ''))
    }
    return okCount
  }

  const [dragMode, setDragMode] = useState<boolean | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailsCache, setDetailsCache] = useState<Map<string, SessionDetails>>(() => new Map())
  const [detailsBusyIds, setDetailsBusyIds] = useState<Set<string>>(() => new Set())
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(() => new Set())
  const [fileDeleting, setFileDeleting] = useState(false)

  const switchTab = useCallback((next: 'all' | 'archived') => {
    setTab(next)
    setSelected(new Set())
    setExpandedId(null)
    setDetailsError(null)
    setSelectedFiles(new Set())
  }, [])

  useEffect(() => {
    if (dragMode === null) return
    const end = () => setDragMode(null)
    const onBlur = () => setDragMode(null)
    const onVisibility = () => { if (document.visibilityState === 'hidden') setDragMode(null) }
    window.addEventListener('mouseup', end)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('mouseup', end)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [dragMode])

  const applyRow = useCallback((id: string, mode: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (mode) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const onRowMouseDown = useCallback((id: string, event: { preventDefault: () => void }) => {
    event.preventDefault()
    const mode = !selected.has(id)
    applyRow(id, mode)
    setDragMode(mode)
  }, [selected, applyRow])

  const onRowMouseEnter = useCallback((id: string) => {
    if (dragMode !== null) applyRow(id, dragMode)
  }, [dragMode, applyRow])

  const onRowKeyDown = useCallback((id: string, event: { target: unknown; key: string; preventDefault: () => void }) => {
    const target = event.target
    if (target !== null && typeof target === 'object' && ((target as { tagName?: string }).tagName === 'BUTTON' || (target as { tagName?: string }).tagName === 'INPUT')) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    const mode = !selected.has(id)
    applyRow(id, mode)
  }, [selected, applyRow])

  const latestDetailsRequest = useRef<string | null>(null)
  const toggleDetails = useCallback((row: Row) => {
    if (expandedId === row.id) {
      setExpandedId(null)
      return
    }
    setExpandedId(row.id)
    setSelectedFiles(new Set())
    setDetailsError(null)
    if (detailsCache.has(row.id)) {
      setDetailsCache((prev) => {
        if (!prev.has(row.id)) return prev
        const next = new Map(prev)
        const value = next.get(row.id)
        next.delete(row.id)
        next.set(row.id, value as SessionDetails)
        return next
      })
      return
    }
    const targetId = row.id
    latestDetailsRequest.current = targetId
    setDetailsBusyIds((prev) => new Set(prev).add(targetId))
    api('details', { sessionId: targetId }).then((value) => {
      if (latestDetailsRequest.current !== targetId) return
      setDetailsCache((prev) => {
        const next = new Map(prev)
        next.delete(targetId)
        next.set(targetId, value as SessionDetails)
        while (next.size > DETAILS_CACHE_LIMIT) {
          const oldest = next.keys().next().value as string | undefined
          if (oldest === undefined || oldest === targetId) break
          next.delete(oldest)
        }
        return next
      })
    }).catch((reason: unknown) => {
      if (latestDetailsRequest.current !== targetId) return
      setDetailsError(reason instanceof Error ? reason.message : String(reason))
    }).finally(() => {
      setDetailsBusyIds((prev) => {
        const next = new Set(prev)
        next.delete(targetId)
        return next
      })
    })
  }, [expandedId, detailsCache])

  const selectedCount = selectableIds.filter((id) => selected.has(id)).length
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id))
  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(selectableIds))
  }

  const confirmDelete = async () => {
    if (deleting || selectedCount === 0) return
    const targets = selectableIds.filter((id) => selected.has(id))
    setConfirmOpen(false)
    setDeleting(true)
    setError(null)
    setSuccess(null)
    try {
      await runBatch('delete', targets)
      setSelected(new Set())
      setSuccess(t('deleteDone').replace('{n}', String(targets.length)))
      setDetailsCache((prev) => {
        const next = new Map(prev)
        for (const id of targets) next.delete(id)
        return next
      })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setDeleting(false)
    }
  }

  const openSelectedFolder = async () => {
    setError(null)
    const targets = selectableIds.filter((id) => selected.has(id))
    const sessionId = targets.length > 0 ? targets[0] : (current !== undefined && byId[current] !== undefined ? current : undefined)
    if (sessionId === undefined) return
    try {
      await api('open-folder', { sessionId })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    }
  }

  const [archiving, setArchiving] = useState(false)
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false)
  const archiveSelected = async () => {
    if (archiving || selectedCount === 0) return
    const targets = selectableIds.filter((id) => selected.has(id))
    setArchiveConfirmOpen(false)
    setArchiving(true)
    setError(null)
    setSuccess(null)
    try {
      await runBatch('archive', targets)
      setSelected(new Set())
      setSuccess(t('archiveDone').replace('{n}', String(targets.length)))
      setDetailsCache((prev) => {
        const next = new Map(prev)
        for (const id of targets) next.delete(id)
        return next
      })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setArchiving(false)
    }
  }

  const unarchiveSelected = async () => {
    if (archiving || selectedCount === 0) return
    const targets = selectableIds.filter((id) => selected.has(id))
    setArchiving(true)
    setError(null)
    setSuccess(null)
    try {
      await runBatch('unarchive', targets)
      setSelected(new Set())
      setSuccess(t('unarchiveDone').replace('{n}', String(targets.length)))
      setDetailsCache((prev) => {
        const next = new Map(prev)
        for (const id of targets) next.delete(id)
        return next
      })
      await refresh()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setArchiving(false)
    }
  }

  const switchViewMode = useCallback((mode: 'flat' | 'workspace') => {
    setViewMode(mode)
    setSelected(new Set())
    setExpandedId(null)
    setDetailsError(null)
    setSelectedFiles(new Set())
  }, [])

  const toggleFile = (path: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const [fileConfirmOpen, setFileConfirmOpen] = useState(false)
  const [pendingFileDeleteRow, setPendingFileDeleteRow] = useState<Row | null>(null)
  const requestFileDelete = (row: Row) => {
    setPendingFileDeleteRow(row)
    setFileConfirmOpen(true)
  }

  const doDeleteSelectedFiles = async () => {
    const row = pendingFileDeleteRow
    setFileConfirmOpen(false)
    setPendingFileDeleteRow(null)
    if (row === null || row === undefined) return
    const currentDetails = detailsCache.get(row.id)
    const known = new Set((currentDetails?.files ?? []).map((file) => file.path))
    const targets = [...selectedFiles].filter((path) => known.has(path))
    if (targets.length === 0 || fileDeleting) return
    setFileDeleting(true)
    setError(null)
    try {
      const results = await Promise.allSettled(targets.map((path) => api('delete-file', { path, sessionId: row.id })))
      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length > 0) {
        const detail = failed[0].reason instanceof Error ? failed[0].reason.message : ''
        throw new Error(t('batchResult').replace('{ok}', String(targets.length - failed.length)).replace('{fail}', String(failed.length)) + (detail ? `: ${detail}` : ''))
      }
      setSelectedFiles(new Set())
      const value = await api('details', { sessionId: row.id })
      setDetailsCache((prev) => {
        const next = new Map(prev)
        next.set(row.id, value as SessionDetails)
        return next
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    } finally {
      setFileDeleting(false)
    }
  }

  const renderDetails = (row: Row, data: SessionDetails | undefined) => {
    const loadingDetails = data === undefined && detailsBusyIds.has(row.id)
    const failed = data === undefined && detailsError !== null
    const parent = data?.lineage?.parentSessionId ?? null
    const children = data?.lineage?.children ?? []
    const files = (data?.files ?? []).slice(0, 200)
    const stats = data?.stats
    const toolNames = stats && typeof stats.toolCounts === 'object' && stats.toolCounts !== null ? Object.keys(stats.toolCounts) : []
    const fetchList = stats?.fetches ?? []
    const childTitles = children.map((id) => byId[id]?.title ?? shortId(id))
    const fileSelectedCount = files.filter((file) => selectedFiles.has(file.path)).length
    const statRows: [string, number][] = stats === undefined ? [] : [
      [t('turns'), stats.turns],
      [t('steps'), stats.steps],
      [t('userMessages'), stats.userMessages],
      [t('assistantMessages'), stats.assistantMessages],
      [t('toolCalls'), stats.toolCalls],
      [t('attachments'), stats.attachments],
    ]
    return (
      <div className={css.details}>
        {loadingDetails && <div className={css.hint}>{t('detailsLoading')}</div>}
        {failed && <div className={css.error} role="alert">{detailsError}</div>}
        {data !== undefined && (
          <div className={css.detailBody}>
            <div className={css.detailGrid}>
              <div className={css.detailItem}>
                <span className={css.detailLabel}>{t('size')}</span>
                <span>{data.sizeBytes === null ? t('na') : formatBytes(data.sizeBytes)}</span>
              </div>
              <div className={css.detailItem}>
                <span className={css.detailLabel}>{t('updated')}</span>
                <span>{data.updatedAt ? timeLabel(data.updatedAt, now, t) : t('na')}</span>
              </div>
            </div>
            {statRows.length > 0 && <div className={css.detailSection}>{t('activity')}</div>}
            {statRows.length > 0 && (
              <div className={css.detailGrid}>
                {statRows.map(([label, value]) => (
                  <div className={css.detailItem} key={label}>
                    <span className={css.detailLabel}>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
            {toolNames.length > 0 && <div className={css.detailSection}>{t('tools')}</div>}
            {toolNames.length > 0 && (
              <div className={css.chips}>
                {toolNames.slice(0, 12).map((name) => (
                  <span className={css.chip} key={name}>{`${name} ×${stats?.toolCounts[name] ?? 0}`}</span>
                ))}
              </div>
            )}
            <div className={css.detailSection}>{t('fetches')}</div>
            {fetchList.length === 0 ? (
              <div className={css.hint}>{t('noFetches')}</div>
            ) : (
              <div className={css.fetchList}>
                {fetchList.map((fetch) => (
                  <div className={css.fetchRow} key={`${fetch.tool}:${fetch.query ?? ''}`}>
                    <span className={css.fetchTool}>{fetch.tool}</span>
                    {fetch.query !== undefined && <span className={css.fetchQuery} title={fetch.query}>{fetch.query}</span>}
                  </div>
                ))}
              </div>
            )}
            <div className={css.detailSection}>{t('files')}</div>
            {files.length === 0 ? (
              <div className={css.hint}>{t('noFiles')}</div>
            ) : (
              <div className={css.fetchList}>
                {files.map((file) => (
                  <label className={css.selectAll} key={file.path}>
                    <input type="checkbox" checked={selectedFiles.has(file.path)} onChange={() => toggleFile(file.path)} />
                    <span className={css.title} title={file.path}>{file.path}</span>
                  </label>
                ))}
                <div className={css.fileFooter}>
                  <Button variant="outline" disabled={fileSelectedCount === 0 || fileDeleting} onClick={() => requestFileDelete(row)}>
                    {fileDeleting ? t('fileDeleting') : `${t('fileDelete')}（${fileSelectedCount}）`}
                  </Button>
                </div>
              </div>
            )}
            <div className={css.detailSection}>{t('lineage')}</div>
            <div className={css.lineageRow}>
              <span className={css.detailLabel}>{t('parent')}</span>
              <span>{parent === null ? t('none') : byId[parent]?.title ?? shortId(parent)}</span>
            </div>
            <div className={css.lineageRow}>
              <span className={css.detailLabel}>{t('children')}</span>
              <span>{children.length === 0 ? t('none') : childTitles.join('、')}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const rowElement = (row: Row) => {
    const isSelected = selected.has(row.id)
    const isExpanded = expandedId === row.id
    const data = isExpanded ? detailsCache.get(row.id) : undefined
    return (
      <div key={row.id}>
        <div
          className={`${css.row}${isSelected ? ` ${css.rowSelected}` : ''}${row.current ? ` ${css.current}` : ''}${row.subagent ? ` ${css.subagentRow}` : ''}`}
          aria-selected={isSelected}
          title={row.current ? t('currentHint') : undefined}
          tabIndex={row.current ? -1 : 0}
          onKeyDown={row.current ? undefined : (event) => onRowKeyDown(row.id, event)}
          onMouseDown={row.current ? undefined : (event) => onRowMouseDown(row.id, event)}
          onMouseEnter={row.current ? undefined : () => onRowMouseEnter(row.id)}
        >
          {(subagentCounts.get(row.id) ?? 0) > 0 && (
            <button
              type="button"
              className={`${css.subagentToggle}${expandedParents.has(row.id) ? ` ${css.subagentToggleOpen}` : ''}`}
              aria-label={expandedParents.has(row.id) ? t('subagentCollapse') : t('subagentExpand')}
              aria-expanded={expandedParents.has(row.id)}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); toggleSubagents(row.id) }}
            >
              <IconTriangleRightFill14 />
            </button>
          )}
          <span className={row.current ? `${css.check} ${css.checkCurrent}` : css.check}>
            {row.current ? (
              <span className={css.currentBadge}>{t('current')}</span>
            ) : (
              <span className={`${css.checkbox}${isSelected ? ` ${css.checkboxChecked}` : ''}`}>
                {isSelected && <IconCheckOutline16 size={12} />}
              </span>
            )}
          </span>
          <span className={css.title} title={row.title}>{row.title}</span>
          {row.updatedAt !== undefined && Number.isFinite(row.updatedAt) && (
            <span className={css.time} title={new Date(row.updatedAt).toLocaleString()}>{timeLabel(row.updatedAt, now, t)}</span>
          )}
          {row.subagent && <span className={css.subagentBadge}>{t('subagent')}</span>}
          <button
            type="button"
            className={`${css.chevron}${isExpanded ? ` ${css.chevronOpen}` : ''}`}
            aria-label={t('details')}
            aria-expanded={isExpanded}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); toggleDetails(row) }}
          >
            <IconTriangleRightFill14 />
          </button>
        </div>
        {isExpanded && renderDetails(row, data)}
      </div>
    )
  }

  return (
    <div className={css.root}>
      <div className={css.heading}>{t('title')}</div>
      <div className={css.tabs} role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'all'} className={`${css.tab}${tab === 'all' ? ` ${css.tabActive}` : ''}`} onClick={() => switchTab('all')}>
          {t('tab.all')}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'archived'} className={`${css.tab}${tab === 'archived' ? ` ${css.tabActive}` : ''}`} onClick={() => switchTab('archived')}>
          {t('tab.archived')}
        </button>
      </div>
      {tab === 'all' && (
        <div className={css.viewBar}>
          <input type="search" className={css.search} value={searchQuery} placeholder={t('searchPlaceholder')} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className={css.viewSwitch} role="group">
            <button type="button" className={`${css.viewSwitchItem}${viewMode === 'flat' ? ` ${css.viewSwitchItemActive}` : ''}`} aria-pressed={viewMode === 'flat'} onClick={() => switchViewMode('flat')}>
              {t('view.flat')}
            </button>
            <button type="button" className={`${css.viewSwitchItem}${viewMode === 'workspace' ? ` ${css.viewSwitchItemActive}` : ''}`} aria-pressed={viewMode === 'workspace'} onClick={() => switchViewMode('workspace')}>
              {t('view.workspace')}
            </button>
          </div>
        </div>
      )}
      <div className={css.toolbar}>
        <label className={css.selectAll}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={selectableIds.length === 0} />
          <span>{t('selectAll')}</span>
        </label>
        <span className={css.count}>{t('selected').replace('{n}', String(selectedCount))}</span>
        {tab === 'all' && (
          <Button variant="outline" disabled={selectedCount === 0 || archiving} onClick={() => setArchiveConfirmOpen(true)}>
            {archiving ? t('archiving') : t('archive')}
          </Button>
        )}
        {tab === 'archived' && (
          <Button variant="outline" disabled={selectedCount === 0 || archiving} onClick={() => void unarchiveSelected()}>
            {archiving ? t('unarchiving') : t('unarchive')}
          </Button>
        )}
        <Button variant="outline" disabled={selectedCount === 0 || deleting} onClick={() => setConfirmOpen(true)}>
          {deleting ? t('deleting') : t('delete')}
        </Button>
        <Button variant="outline" disabled={rows.length === 0} title={t('openFolderHint')} onClick={() => void openSelectedFolder()}>
          <IconFolderOpenOutline16 size={14} /> {t('openFolder')}
        </Button>
      </div>
      {success !== null && <div className={css.success} role="status">{success}</div>}
      {error !== null && <div className={css.error} role="alert">{error}</div>}
      {workspaceError !== null && workspaceError !== undefined && (
        <div className={css.error} role="alert">
          {String((workspaceError as { message?: string } | undefined)?.message ?? workspaceError)}{' '}
          <button key="retry" type="button" onClick={() => void refresh()}>{t('retry')}</button>
        </div>
      )}
      {rows.length === 0 ? (
        <div className={css.empty}>{loading ? t('loading') : t(tab === 'all' ? 'emptyAll' : 'emptyArchived')}</div>
      ) : viewMode === 'workspace' && tab === 'all' ? (
        <div className={css.list}>
          {groups.map((group) => (
            <div key={group.key}>
              <div className={css.groupHeader}>
                <span className={css.groupTitle}>{group.label}</span>
                <span className={css.groupCount}>{t('group.sessions').replace('{n}', String(group.rows.length))}</span>
              </div>
              {group.rows.map((row) => rowElement(row))}
            </div>
          ))}
        </div>
      ) : (
        <div className={css.list}>
          {rows.map((row) => rowElement(row))}
        </div>
      )}
      <Modal
        open={confirmOpen}
        onClose={() => { if (!deleting) setConfirmOpen(false) }}
        closeLabel={t('close')}
        title={t('delete')}
        description={t('confirm').replace('{n}', String(selectedCount))}
        footer={(
          <>
            <Button variant="outline" disabled={deleting} onClick={() => setConfirmOpen(false)}>{t('cancel')}</Button>
            <Button variant="outline" disabled={deleting} onClick={confirmDelete}>{deleting ? t('deleting') : t('delete')}</Button>
          </>
        )}
      />
      <Modal
        open={archiveConfirmOpen}
        onClose={() => { if (!archiving) setArchiveConfirmOpen(false) }}
        closeLabel={t('close')}
        title={t('archive')}
        description={t('archiveConfirm').replace('{n}', String(selectedCount))}
        footer={(
          <>
            <Button variant="outline" disabled={archiving} onClick={() => setArchiveConfirmOpen(false)}>{t('cancel')}</Button>
            <Button variant="outline" disabled={archiving} onClick={archiveSelected}>{archiving ? t('archiving') : t('archive')}</Button>
          </>
        )}
      />
      <Modal
        open={fileConfirmOpen}
        onClose={() => { if (!fileDeleting) setFileConfirmOpen(false) }}
        closeLabel={t('close')}
        title={t('fileDelete')}
        description={t('fileDeleteConfirm').replace('{n}', String(pendingFileDeleteRow !== null && pendingFileDeleteRow !== undefined ? [...selectedFiles].filter((path) => (detailsCache.get(pendingFileDeleteRow.id)?.files ?? []).some((file) => file.path === path)).length : 0))}
        footer={(
          <>
            <Button variant="outline" disabled={fileDeleting} onClick={() => setFileConfirmOpen(false)}>{t('cancel')}</Button>
            <Button variant="outline" disabled={fileDeleting} onClick={() => void doDeleteSelectedFiles()}>{fileDeleting ? t('fileDeleting') : t('fileDelete')}</Button>
          </>
        )}
      />
    </div>
  )
}
