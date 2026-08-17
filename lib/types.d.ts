/**
 * Minimal structural types for the public DSH service surfaces this plugin
 * reads. They are deliberately narrower than the real Service Definitions and
 * only name the members this plugin actually calls, so the host half compiles
 * without importing DSH source — the real services satisfy them structurally.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
/** Immutable session metadata as read from live headers or persistence listings. */
export interface SessionHeader {
    readonly id: string;
    readonly version?: number;
    readonly createdAt?: number;
    readonly cwd?: string;
    readonly parentSession?: string;
    readonly origin?: string;
}
/** One decoded session-log record (event type plus its data envelope). */
export interface SessionEvent {
    readonly type: string;
    readonly time?: number;
    readonly data?: unknown;
    readonly [key: string]: unknown;
}
/** A live Session: its immutable header and current event window. */
export interface Session {
    readonly header: SessionHeader;
    readonly events: readonly SessionEvent[];
}
/** Result of a cold persistence inspect: header plus the balanced event log. */
export interface SessionInspection {
    readonly meta?: SessionHeader;
    readonly events: readonly SessionEvent[];
}
/** Result of a raw-artifact read: header plus verbatim artifact text. */
export interface SessionRawArtifact {
    readonly meta?: SessionHeader;
    readonly content: string;
}
/** A backend-resolved per-session artifact location hint. */
export interface SessionLocation {
    readonly kind: string;
    readonly path: string;
}
/** A registered agent handle (status is the lifecycle discriminant). */
export interface Agent {
    readonly status: string;
}
/** A workspace registration entity exposing its accounted sessions. */
export interface WorkspaceEntity {
    readonly path: string;
    readonly sessionIds: readonly string[];
    detachSession(sessionId: string): Promise<void>;
}
/** The sessionPersistence service slice this plugin uses. */
export interface SessionPersistence {
    list(signal?: AbortSignal): Promise<SessionHeader[]>;
    inspect(id: string, signal?: AbortSignal): Promise<SessionInspection>;
    readRaw?(id: string, signal?: AbortSignal): Promise<SessionRawArtifact | undefined>;
    locate(meta: SessionHeader): SessionLocation | undefined;
    remove?(id: string): Promise<void>;
}
/** The live SessionStore slice (get/list/flush, plus an optional future remove). */
export interface SessionStore {
    get(id: string): Session | undefined;
    list(): Session[];
    flush(session: Session): Promise<unknown>;
    remove?(id: string): Promise<void>;
}
/** The agent registry slice (status lookups only). */
export interface AgentRegistry {
    get(id: string): Agent | undefined;
}
/** The agent loop slice; disposeAgent is optional and often not resolvable. */
export interface AgentLoop {
    disposeAgent?(id: string): Promise<void>;
}
/** The workspace registry slice. deleteSession/unarchiveSession are optional
 * public primitives that a future Harness may add; their absence degrades
 * cleanly instead of reaching into private state. */
export interface WorkspaceRegistry {
    list(): WorkspaceEntity[];
    archiveSession(id: string): Promise<void>;
    deleteSession?(id: string): Promise<void>;
    unarchiveSession?(id: string): Promise<void>;
}
/** The webServer service slice (route registration). */
export interface WebServer {
    register(route: {
        kind: 'prefix' | 'exact';
        path: string;
        handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
    }): () => void;
}
/** The subset of the Cordis context this plugin's host half uses. */
export interface PluginContext {
    get<T = unknown>(name: string): T;
    effect(callback: () => void | (() => void), label?: string): void;
}
