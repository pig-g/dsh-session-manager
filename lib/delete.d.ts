import type { PluginContext, SessionHeader } from './types.js';
/** Locate a session header by id: live store first, then persisted metadata. */
export declare function findSessionMeta(ctx: PluginContext, sessionId: string): Promise<SessionHeader | undefined>;
/**
 * Delete one stopped, cold session: detach workspace accounting, drop archive
 * membership (public primitive only), and remove the artifact directory via
 * the backend's own `locate` path. Subagent children and produced files are
 * intentionally left alone.
 */
export declare function deleteSessionSingle(ctx: PluginContext, sessionId: string): Promise<void>;
/**
 * Permanently delete one session. Running sessions are refused (409 busy);
 * sessions still loaded in the live store are refused (409 attached) unless a
 * public disposal primitive exists, because filesystem removal under a live
 * session can resurrect the log on the next flush.
 */
export declare function deleteSession(ctx: PluginContext, sessionId: string): Promise<{
    sessionId: string;
}>;
