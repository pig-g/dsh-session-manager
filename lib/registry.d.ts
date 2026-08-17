import type { PluginContext } from './types.js';
/** Archive one session into the registry-global archive set (public API). */
export declare function archiveSession(ctx: PluginContext, sessionId: string): Promise<{
    sessionId: string;
    archived: true;
}>;
/** Unarchive one session. Requires a public unarchive primitive; 501 without it. */
export declare function unarchiveSession(ctx: PluginContext, sessionId: string): Promise<{
    sessionId: string;
    archived: false;
}>;
