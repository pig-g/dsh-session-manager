import type { PluginContext } from './types.js';
/** Delete one workspace file, with ownership and containment checks. */
export declare function deleteFile(ctx: PluginContext, path: string, sessionId: string): Promise<{
    path: string;
    deleted: true;
}>;
/** Open a session's record folder in the OS file manager. */
export declare function openSessionFolder(ctx: PluginContext, sessionId: string): Promise<{
    sessionId: string;
    path: string;
    opened: boolean;
}>;
