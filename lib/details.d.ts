import type { PluginContext } from './types.js';
/** One user/assistant message in the read-only transcript preview. */
export interface MessagePreview {
    readonly role: 'user' | 'assistant';
    readonly text: string;
}
/** One bounded per-session detail snapshot. */
export interface SessionDetails {
    readonly sessionId: string;
    readonly sizeBytes: number | null;
    readonly createdAt: number | null;
    readonly updatedAt: number | null;
    readonly messages: readonly MessagePreview[];
    readonly files: readonly {
        path: string;
        tool: string;
    }[];
    readonly stats: {
        readonly turns: number;
        readonly steps: number;
        readonly userMessages: number;
        readonly assistantMessages: number;
        readonly toolCalls: number;
        readonly attachments: number;
        readonly toolCounts: Record<string, number>;
        readonly fetches: readonly {
            tool: string;
            query?: string;
        }[];
    };
    readonly lineage: {
        parentSessionId: string | null;
        children: readonly string[];
    };
}
/** Build the detail snapshot for one session. */
export declare function buildDetails(ctx: PluginContext, sessionId: string): Promise<SessionDetails>;
