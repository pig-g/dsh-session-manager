/**
 * Per-session detail snapshot: size, activity stats, a bounded read-only
 * message transcript, produced files, and lineage. Reading is lenient — strict
 * `inspect` first, then a raw-artifact fallback that skips unknown records so a
 * log written by a newer Harness still renders counts instead of failing.
 * Response fields are bounded (messages ≤ 50, fetches ≤ 50, files ≤ 200) so
 * huge sessions stay cheap to serialize.
 */
import { stat } from 'node:fs/promises';
import { decodeStorageRecord } from '@deepseek-ai/dsh-session';
import { httpError } from './fence.js';
/** Tool names counted as "web fetch / download" in the activity panel. */
const FETCH_TOOL_RE = /search|fetch|download|browse/i;
/** Response bounds: only the first N fetches/files are returned. */
const MAX_FETCHES = 50;
const MAX_FILES = 200;
const MAX_MESSAGES = 50;
/** Inspect leniently: strict read first, raw-artifact fallback that skips unknown records. */
async function lenientInspect(persistence, sessionId, signal) {
    try {
        return await persistence.inspect(sessionId, signal);
    }
    catch (error) {
        if (typeof persistence.readRaw !== 'function')
            throw error;
        const raw = await persistence.readRaw(sessionId, signal);
        if (raw === undefined) {
            throw httpError(404, 'session-not-found', 'Session not found');
        }
        const events = [];
        for (const line of raw.content.split('\n')) {
            if (line.trim() === '')
                continue;
            try {
                const decoded = decodeStorageRecord(JSON.parse(line));
                if (Array.isArray(decoded))
                    events.push(...decoded);
                else
                    events.push(decoded);
            }
            catch {
                // torn tail or an unreadable record — skip it rather than failing the panel
            }
        }
        return { meta: raw.meta, events };
    }
}
/** Extract a fetch query/url from a tool call's arguments (best effort). */
function fetchQuery(data) {
    if (data === null || typeof data !== 'object')
        return undefined;
    const args = typeof data.arguments === 'string'
        ? (() => { try {
            return JSON.parse(data.arguments);
        }
        catch {
            return undefined;
        } })()
        : data.arguments;
    if (args === null || typeof args !== 'object')
        return undefined;
    for (const key of ['query', 'url', 'q']) {
        const value = args[key];
        if (typeof value === 'string' && value !== '')
            return value;
    }
    return undefined;
}
/** Join the text blocks of a message's content into one trimmed string. */
function messageText(content) {
    if (!Array.isArray(content))
        return '';
    const parts = [];
    for (const block of content) {
        if (block !== null && typeof block === 'object' && block.type === 'text') {
            const text = block.text;
            if (typeof text === 'string' && text !== '')
                parts.push(text);
        }
    }
    return parts.join('\n').trim();
}
/** Build the detail snapshot for one session. */
export async function buildDetails(ctx, sessionId) {
    const sessions = ctx.get('sessions');
    const persistence = ctx.get('sessionPersistence');
    const live = sessions?.get(sessionId);
    let meta;
    let events;
    if (live !== undefined) {
        meta = live.header;
        events = live.events;
    }
    else {
        if (persistence === undefined)
            throw new Error('session persistence is not available');
        const inspected = await lenientInspect(persistence, sessionId);
        if (inspected.meta === undefined) {
            throw httpError(404, 'session-not-found', 'Session not found');
        }
        meta = inspected.meta;
        events = inspected.events;
    }
    let sizeBytes = null;
    const location = persistence?.locate(meta);
    if (location !== undefined && location.path !== '') {
        try {
            sizeBytes = (await stat(location.path)).size;
        }
        catch {
            sizeBytes = null;
        }
    }
    let lastTime = typeof meta?.createdAt === 'number' ? meta.createdAt : 0;
    const fileSet = new Map();
    const stats = {
        turns: 0,
        steps: 0,
        userMessages: 0,
        assistantMessages: 0,
        toolCalls: 0,
        attachments: 0,
        toolCounts: {},
        fetches: [],
    };
    const turnSeen = new Set();
    const stepSeen = new Set();
    const messages = [];
    for (const event of events) {
        if (typeof event.time === 'number' && event.time > lastTime)
            lastTime = event.time;
        const data = event.data;
        switch (event.type) {
            case 'turn/start':
                if (typeof data?.turn === 'number')
                    turnSeen.add(data.turn);
                break;
            case 'step/start':
                if (typeof data?.step === 'number')
                    stepSeen.add(data.step);
                break;
            case 'user/message': {
                stats.userMessages++;
                const text = messageText(data?.content);
                if (text !== '')
                    messages.push({ role: 'user', text });
                if (Array.isArray(data?.content)) {
                    for (const block of data.content)
                        if (block?.type === 'image')
                            stats.attachments++;
                }
                break;
            }
            case 'assistant/message': {
                stats.assistantMessages++;
                const text = messageText(data?.message?.content);
                if (text !== '')
                    messages.push({ role: 'assistant', text });
                break;
            }
            case 'tool/call': {
                stats.toolCalls++;
                const name = typeof data?.name === 'string' ? data.name : 'tool';
                stats.toolCounts[name] = (stats.toolCounts[name] ?? 0) + 1;
                if (FETCH_TOOL_RE.test(name)) {
                    const query = fetchQuery(data);
                    stats.fetches.push({ tool: name, ...(query === undefined || query === '' ? {} : { query }) });
                }
                if (name === 'write' || name === 'edit') {
                    const filePath = typeof data?.file_path === 'string' ? data.file_path : undefined;
                    if (filePath !== undefined && filePath !== '')
                        fileSet.set(filePath, name);
                }
                break;
            }
            default:
                break;
        }
    }
    stats.turns = turnSeen.size;
    stats.steps = stepSeen.size;
    if (stats.fetches.length > MAX_FETCHES)
        stats.fetches = stats.fetches.slice(0, MAX_FETCHES);
    const files = [...fileSet.entries()].map(([path, tool]) => ({ path, tool })).slice(0, MAX_FILES);
    const transcript = messages.slice(-MAX_MESSAGES);
    const lineage = {
        parentSessionId: typeof meta?.parentSession === 'string' ? meta.parentSession : null,
        children: [],
    };
    const childrenSet = new Set();
    if (persistence !== undefined && typeof persistence.list === 'function') {
        for (const header of await persistence.list()) {
            if (header.parentSession !== sessionId)
                continue;
            if (header.origin === 'subagent')
                continue;
            childrenSet.add(header.id);
        }
    }
    for (const session of sessions?.list() ?? []) {
        if (session.header.parentSession === sessionId && session.header.origin !== 'subagent') {
            childrenSet.add(session.header.id);
        }
    }
    lineage.children = [...childrenSet];
    return {
        sessionId,
        sizeBytes,
        createdAt: typeof meta?.createdAt === 'number' ? meta.createdAt : null,
        updatedAt: lastTime || null,
        messages: transcript,
        files,
        stats,
        lineage,
    };
}
