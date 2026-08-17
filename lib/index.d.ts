import type { PluginContext } from './types.js';
export declare const name = "dsh-session-manager";
export declare const inject: string[];
/** Register the /archived/api route and wire each method to its handler. */
export declare function apply(ctx: PluginContext): void;
