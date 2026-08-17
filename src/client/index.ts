/**
 * dsh-session-manager — browser half.
 *
 * Registers the "Session manager" section into the Settings shell. All data
 * arrives through the slot system's standard seats (global useSessions /
 * useWorkspaces hooks) plus an inject face that refreshes both baselines; the
 * framework synthesizes the `t` seat from the declared `locale` namespace.
 */
import { ArchivedSessionsSection } from './ArchivedSessionsSection.tsx'
import { NS, dictionaries } from './locales.ts'

/** Cordis service names this plugin's browser half injects. */
export const inject = ['slots', 'locale', 'sessions', 'workspaces']

interface ClientContext {
  effect(callback: () => void | (() => void), label?: string): void
  locale: {
    register(ns: string, dictionaries: Record<string, Record<string, string>>): void
    bind(ns: string): (key: string) => string
  }
  slots: {
    inject(name: string, factory: () => unknown): void
    register(options: unknown, component: unknown): unknown
  }
  sessions: { refresh(): Promise<void> }
  workspaces: { refresh(): Promise<void> }
}

export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, dictionaries), 'dsh-session-manager: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'archived-sessions',
    order: 200,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({
      refresh: async () => {
        await ctx.sessions.refresh()
        await ctx.workspaces.refresh()
      },
    }),
  }, ArchivedSessionsSection))
}
