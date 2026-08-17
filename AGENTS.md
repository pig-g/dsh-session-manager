# AGENTS.md — dsh-session-manager

Guidance for agents working in this repository. It is a **standalone DeepSeek Harness web
plugin** (not part of the harness monorepo): a host half that serves `/archived/api`, plus a
browser half that renders the Settings "Session manager" panel. It is a maintained fork of
`dsh-archived-sessions`.

## Hard rules (do not violate)

1. **Public APIs only.** The host half may call only public service methods —
   `sessionPersistence.{list,inspect,readRaw,locate,remove?}`, `workspaceRegistry.{list,archiveSession,deleteSession?,unarchiveSession?}`,
   entity `detachSession`, `sessions.{get,list,flush,remove?}`, `agents.get`, `webServer.register`.
   **Never** call TypeScript-`private` members (e.g. `requireState`/`setState`); "it works by
   type erasure" is not a contract and breaks on the next harness refactor.
2. **Never delete a still-attached session.** Permanent deletion must refuse (`409 session-attached`)
   any session still present in the live `SessionStore`. Filesystem removal under a live session lets
   the persistence coordinator re-flush and resurrect the log. Only cold (disposed) sessions are
   removable. A future public `sessions.remove()` / `workspaceRegistry.deleteSession()` may upgrade
   this path; detect it with a `typeof` capability check, never assume it.
3. **Non-cascading delete.** Deleting a session removes exactly that session. Subagent children,
   forks, and produced files survive unless the user explicitly selects them.
4. **Capability-gated degradation.** Features that need a core primitive that upstream does not yet
   expose (`unarchiveSession`, `deleteSession`, `sessions.remove`) must degrade to a clear `501
   unsupported` / documented no-op, not reach for private state.
5. **Keep the `/archived/api` wire contract stable.** The prebuilt `lib/client.js` depends on the
   route (`/archived/api/<method>`), the POST+JSON request shape, and the `{ ok, value | error }`
   response envelope. Changing any of these requires a matching client change in the same commit.
6. **The client half is a prebuilt bundle.** `lib/client.js` is carried from the original and is the
   source of truth until it is reconstructed to `src/client/` `.tsx`. Do not hand-edit it casually;
   if you must, rebuild/verify the full bundle and bump a note in `README.md`.

## Layout

```
src/            host half (TypeScript, the reviewed source)
  index.ts      apply() + route dispatch + name/inject
  fence.ts      loopback/origin trust fence, body limits, JSON envelopes
  delete.ts     findSessionMeta + deleteSession(Single)
  registry.ts   archive / unarchive
  details.ts    lenient inspect + detail snapshot
  handlers.ts   deleteFile + openSessionFolder
  types.ts      minimal structural service types (types only)
lib/            committed build output (client.js is hand-carried; *.js/*.d.ts from tsc)
tests/          vitest specs (node env, import built lib/*.js)
```

## Commands

```sh
pnpm run typecheck   # tsc --noEmit — strict, noImplicitAny
pnpm run build       # tsc → lib/index.js + lib/*.d.ts
pnpm test            # tsc && vitest run
```

The repo's `node_modules` is symlinked into the harness monorepo for local tooling; it is
gitignored. Run `pnpm run build` before `vitest` so tests resolve `../lib/*.js`.

## Conventions

- **ESM everywhere** (`"type": "module"`). Local relative imports use **`.js`** extensions
  (NodeNext emit keeps them); use `import type` for type-only imports.
- **Strict TypeScript**: every module/export has a concise JSDoc; no implicit `any`. Keep the
  `src/types.ts` structural types narrow — only members this plugin actually calls.
- **User-facing copy is Chinese** in host error messages (the client shows `error.message` raw);
  code comments are English.
- **Tests describe behavior, not correctness.** Prefer a spec for every behavior change to the
  destructive path (delete/delete-file/fence), and run `pnpm test` before finishing.
- **Single serialization concern**: prefer any future public registry mutation primitive (which
  runs inside the registry's own queue) over adding a second queue in this plugin. The original's
  private `mutationTail` queue is intentionally removed.
