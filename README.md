# dsh-session-manager

<div align="center">

**DSH web plugin · in-Settings session manager** — browse, inspect, archive, unarchive, and permanently delete every conversation on this machine.

A maintained fork of [`Zephyr-vibe/dsh-archived-sessions`](https://github.com/Zephyr-vibe/dsh-archived-sessions), rebuilt from TypeScript source with a test suite and safe, public-API-only deletion.

[English](#english) · [中文](#中文)

</div>

---

## English

An installable DeepSeek Harness web plugin that adds a **Session manager** section to Settings. It reads the official `$DSH_HOME/sessions` layout through the public `sessionPersistence` service, so it needs **no core patches**.

### Features

- **Two tabs** — **All conversations** (non-archived) and **Archived**.
- **Two views** — flat list, or grouped by workspace (sessions without a workspace fall into "Ungrouped").
- Title + relative-time browsing, newest first; **title/id search**.
- Checkbox / drag-select / select-all; batch **archive** (records kept), **unarchive**, and **delete** (permanent, with a confirmation dialog).
- **Expandable details** per row (collapsed by default): size on disk, last update, activity stats (turns, steps, messages, tool-call distribution, fetch history), produced files, parent/child lineage.
- **Subagent nesting** (indented, badged) under the parent conversation; orphaned subagents surface as top-level rows.
- **Open record folder** in the OS file manager (cross-platform).
- **Non-cascading delete** — deleting a parent never removes subagents, forks, or produced files unless you explicitly select them.
- The **currently open** session is badged and cannot be deleted.

### What this fork changes

1. **Safe, honest deletion.** A session still loaded in the live `SessionStore` is refused (HTTP `409 session-attached`) instead of having its log removed under a live coordinator — the original could re-flush and resurrect a "deleted" log. Only cold (disposed) sessions are removed.
2. **No private-member reach.** The original called the TypeScript-`private` `workspaceRegistry.requireState`/`setState` (which only "worked" by type erasure). This fork uses public primitives only and degrades cleanly where none exist.
3. **No re-derived storage layout.** Both delete and open-folder resolve the session directory from the backend-authoritative `sessionPersistence.locate()`, so the plugin cannot drift when the Harness changes its on-disk layout.
4. **TypeScript source + tests.** The host half is `src/*.ts` with a `tsc` build and a `vitest` suite.

### Install

Publish this repository and add it to a web profile:

```sh
dsh plugin --profile web add <this-repo>.git
# or a tarball:
dsh plugin --profile web add https://codeload.github.com/<you>/dsh-session-manager/tar.gz/refs/heads/main
```

Restart the web app — **Session manager** appears in Settings. No config keys are required.

### Build & test

```sh
pnpm install            # installs dev toolchain
pnpm run typecheck      # tsc --noEmit
pnpm run build          # tsc → lib/index.js + lib/*.d.ts
pnpm test               # tsc + vitest run
```

`lib/` is committed so tarball installs work without a build step; `pnpm run build` regenerates it from `src/`.

### Layout

```
src/
  index.ts      apply() + /archived/api route dispatch; name/inject exports
  fence.ts      loopback/origin trust fence, body limits, JSON envelopes
  delete.ts     findSessionMeta, deleteSession, deleteSessionSingle
  registry.ts   archive / unarchive (public primitives only)
  details.ts    lenient inspect + per-session detail snapshot
  handlers.ts   deleteFile (workspace-scoped) + openSessionFolder
  types.ts      minimal structural service types
lib/
  client.js     prebuilt browser bundle (presentation half)
tests/          fence / delete / registry specs
```

### Compatibility & security

- Uses official public APIs only: `sessionPersistence` (`list`/`inspect`/`readRaw`/`locate`), `workspaceRegistry` (`list`/`archiveSession`/entity `detachSession`), `sessions`, `agents`, and `webServer.register`.
- The `/archived/api` endpoint is fenced to loopback (`127.0.0.1` / `localhost` / `::1`) plus `Origin`/`sec-fetch-site` checks. There is **no auth token**, so do not expose the host beyond loopback.

### Known limitations

- **Unarchive is `501 unsupported` on a stock Harness** — there is no public unarchive primitive upstream yet. Archive works; unarchive activates automatically once `workspaceRegistry.unarchiveSession` exists.
- **Deleting an archived session may leave an orphan id in the official archive set** (no public remove-from-archive primitive). Cosmetic only; the client tolerates missing ids.
- **Delete refuses still-loaded sessions.** Stop the session fully (or restart the web app) so it becomes cold before deleting.
- **Client half is a prebuilt bundle** (`lib/client.js`), carried over from the original and verified against the current client runtime. Reconstructing it to `src/client/` `.tsx` is a tracked follow-up.

### License

MIT — © 2026 Zephyr-vibe (original); fork changes under the same license.

---

## 中文

一个可安装的 DeepSeek Harness Web 插件：在「设置」中提供**会话管理**，统一浏览、查看、归档、取消归档并永久删除本机上的所有对话。它通过公开的 `sessionPersistence` 服务读取官方 `$DSH_HOME/sessions` 布局，**无需任何核心补丁**。

### 功能

- **双标签页**：所有对话（未归档）与归档会话；**两种视图**：单列表 / 按工作区分组（无工作区归属归入「未分组」）。
- 按标题 + 相对时间浏览，最近的在前；支持**标题 / ID 搜索**。
- 勾选 / 拖动批量勾选 / 全选；批量**归档**（记录保留）、**取消归档**、**删除**（永久删除，带确认弹窗）。
- 每行可**展开详情**（默认收起）：占用空间、最后更新、活动统计（轮次、步骤、消息、工具调用分布、网络获取）、产出文件、父子关联。
- **子代理会话**嵌套在父会话下（缩进 + 徽标）；父会话被删除或缺失时自动浮出为顶层行。
- **打开记录文件夹**（跨平台文件管理器）。
- **删除不级联**：删除父会话不会误删子代理、分叉与产出文件，除非显式勾选。
- 当前打开的会话显示「当前会话」徽标且**不可删除**。

### 本分支的改动

1. **更安全的删除**：仍在内存中加载的会话会被拒绝（HTTP `409 session-attached`），避免在活跃协调器下删除日志后又被回刷「复活」；仅删除已完全停止（冷）的会话。
2. **不再触碰私有成员**：不再调用 TypeScript `private` 的 `workspaceRegistry.requireState`/`setState`（原版靠类型擦除侥幸生效）；仅使用公开原语，缺失时优雅降级。
3. **不再重复实现存储布局**：删除与「打开记录文件夹」都改用后端权威的 `sessionPersistence.locate()`，Harness 变更磁盘布局时不会漂移。
4. **TypeScript 源码 + 测试**：宿主机一半为 `src/*.ts`，`tsc` 构建 + `vitest` 测试。

### 安装

发布本仓库后加入 web profile：

```sh
dsh plugin --profile web add <本仓库地址>.git
```

重启 web 端，「设置」中即出现「会话管理」，无需任何配置。

### 已知限制

- **取消归档在纯净 Harness 上返回 `501 unsupported`**（上游暂无公开的取消归档原语）；归档可用，待 `workspaceRegistry.unarchiveSession` 出现后自动启用。
- **删除已归档会话可能留下孤儿归档条目**（无公开的「移出归档集」原语）；仅外观问题，客户端可容忍缺失 id。
- **删除拒绝仍在加载的会话**：请先完全停止会话或重启应用，使其变为冷会话。
- **客户端一半仍是预编译产物**（`lib/client.js`，沿自原版并已对当前运行时验证）；重建为 `src/client/` `.tsx` 是已记录的后续工作。

### 许可证

MIT — © 2026 Zephyr-vibe（原版）；分支改动沿用同一许可证。
