window.__ModuleLoader__.load({
	id: "dsh-session-manager",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/Users/heavens3/deepseek/dsh-session-manager/src/client/ArchivedSessions.module.css.mjs
		const css = ".SZWjAa_root{flex-direction:column;gap:12px;display:flex}.SZWjAa_heading{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500;line-height:20px}.SZWjAa_toolbar{box-sizing:border-box;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:32px;display:flex}.SZWjAa_selectAll{color:var(--dsw-alias-label-secondary);cursor:pointer;align-items:center;gap:6px;font-size:13px;line-height:18px;display:inline-flex}.SZWjAa_selectAll input{cursor:pointer;accent-color:var(--dsw-accent-strong);width:14px;height:14px}.SZWjAa_count{color:var(--dsw-alias-label-tertiary);flex:1;min-width:max-content;font-size:12px;line-height:18px}.SZWjAa_list{flex-direction:column;gap:2px;max-height:min(480px,60vh);display:flex;overflow:auto}.SZWjAa_row{box-sizing:border-box;cursor:pointer;height:34px;color:var(--dsw-alias-label-primary);user-select:none;border-radius:8px;align-items:center;gap:8px;padding:0 8px;display:flex}.SZWjAa_row:hover{background:var(--dsw-alias-interactive-bg-hover)}.SZWjAa_rowSelected{background:var(--dsw-alias-interactive-bg-hover);box-shadow:inset 3px 0 0 var(--dsw-accent-strong);outline:1px solid var(--dsw-alias-border-l2);outline-offset:-1px}.SZWjAa_subagentRow{border-left:2px solid var(--dsw-alias-border-l2);border-radius:0 8px 8px 0;margin-left:9px;padding-left:26px}.SZWjAa_check{width:16px;height:20px;color:var(--dsw-alias-label-tertiary);flex:none;justify-content:center;align-items:center;display:inline-flex}.SZWjAa_checkCurrent{flex:none;justify-content:flex-start;align-items:center;width:auto;height:auto;display:inline-flex}.SZWjAa_checkbox{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:4px;justify-content:center;align-items:center;width:14px;height:14px;display:inline-flex}.SZWjAa_checkboxChecked{background:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-primary);color:var(--dsw-alias-label-primary-inverted)}.SZWjAa_title{text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:13px;line-height:18px;overflow:hidden}.SZWjAa_time{color:var(--dsw-alias-label-tertiary);flex:none;font-size:12px;line-height:17px}.SZWjAa_current{color:var(--dsw-alias-label-tertiary);cursor:not-allowed}.SZWjAa_currentBadge{color:var(--dsw-alias-label-tertiary);border:1px solid var(--dsw-alias-border-l2);white-space:nowrap;border-radius:6px;padding:1px 6px;font-size:11px;line-height:16px}.SZWjAa_subagentBadge{color:var(--dsw-accent-strong);border:1px solid var(--dsw-accent-strong);white-space:nowrap;border-radius:6px;flex:none;padding:1px 6px;font-size:11px;line-height:16px}.SZWjAa_subagentToggle{cursor:pointer;color:var(--dsw-alias-label-tertiary);width:20px;height:20px;transition:transform .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.SZWjAa_subagentToggle:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.SZWjAa_subagentToggleOpen{transform:rotate(90deg)}.SZWjAa_empty{color:var(--dsw-alias-label-tertiary);padding:18px 8px;font-size:13px;line-height:18px}.SZWjAa_error{color:var(--dsw-alias-state-error-primary);margin-top:4px;font-size:12px;line-height:18px}.SZWjAa_success{color:var(--dsw-alias-state-success-primary,var(--dsw-alias-label-primary));margin-top:4px;font-size:12px;line-height:18px}.SZWjAa_hint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.SZWjAa_chevron{cursor:pointer;color:var(--dsw-alias-label-tertiary);width:20px;height:20px;transition:transform .15s var(--ds-ease-in-out);background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.SZWjAa_chevron:hover{background:var(--dsw-alias-interactive-bg-hover)}.SZWjAa_chevronOpen{transform:rotate(90deg)}.SZWjAa_details{border-left:2px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:0 8px 8px 0;margin:2px 0 6px 7px;padding:8px 10px 10px 12px}.SZWjAa_detailBody{flex-direction:column;gap:8px;display:flex}.SZWjAa_detailGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px;display:grid}.SZWjAa_detailItem{justify-content:space-between;align-items:center;gap:12px;font-size:12px;line-height:18px;display:flex}.SZWjAa_detailLabel{color:var(--dsw-alias-label-tertiary);flex:none;font-size:12px;line-height:18px}.SZWjAa_detailSection{color:var(--dsw-alias-label-secondary);margin-top:4px;font-size:12px;font-weight:500;line-height:18px}.SZWjAa_chips{flex-wrap:wrap;gap:4px;display:flex}.SZWjAa_chip{color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);border-radius:6px;padding:2px 8px;font-size:11px;line-height:16px}.SZWjAa_fetchList{flex-direction:column;gap:2px;display:flex}.SZWjAa_fetchRow{color:var(--dsw-alias-label-secondary);align-items:baseline;gap:8px;font-size:12px;line-height:18px;display:flex}.SZWjAa_fetchTool{color:var(--dsw-alias-label-primary);flex:none;font-size:11px;line-height:16px}.SZWjAa_fetchQuery{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.SZWjAa_lineageRow{color:var(--dsw-alias-label-secondary);justify-content:space-between;align-items:center;gap:12px;font-size:12px;line-height:18px;display:flex}.SZWjAa_fileFooter{box-sizing:border-box;align-items:center;gap:10px;min-height:28px;display:flex}.SZWjAa_tabs{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l2);gap:2px;display:flex}.SZWjAa_tab{cursor:pointer;color:var(--dsw-alias-label-secondary);transition:color .15s var(--ds-ease-in-out),border-color .15s var(--ds-ease-in-out);background:0 0;border:none;border-bottom:2px solid #0000;border-radius:8px 8px 0 0;padding:6px 12px;font-size:13px;line-height:18px}.SZWjAa_tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.SZWjAa_tabActive{color:var(--dsw-accent-strong);border-bottom-color:var(--dsw-accent-strong)}.SZWjAa_tabActive:hover{color:var(--dsw-accent-strong);background:0 0}.SZWjAa_viewBar{box-sizing:border-box;align-items:center;gap:12px;min-height:28px;display:flex}.SZWjAa_viewSwitch{box-sizing:border-box;background:var(--dsw-alias-interactive-bg-hover);border-radius:8px;gap:2px;padding:2px;display:inline-flex}.SZWjAa_viewSwitchItem{cursor:pointer;color:var(--dsw-alias-label-secondary);background:0 0;border:none;border-radius:6px;padding:3px 10px;font-size:12px;line-height:18px}.SZWjAa_viewSwitchItem:hover{color:var(--dsw-alias-label-primary)}.SZWjAa_viewSwitchItemActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);box-shadow:0 1px 2px #0000001f}.SZWjAa_groupHeader{box-sizing:border-box;align-items:center;gap:8px;min-height:28px;margin-top:6px;padding:0 8px;display:flex}.SZWjAa_groupHeader:first-child{margin-top:0}.SZWjAa_groupTitle{color:var(--dsw-alias-label-secondary);flex:1;font-size:12px;font-weight:500;line-height:18px}.SZWjAa_groupCount{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px;line-height:16px}.SZWjAa_search{box-sizing:border-box;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;flex:1;min-width:120px;padding:4px 10px;font-size:13px;line-height:18px}.SZWjAa_search:focus{border-color:var(--dsw-accent-strong)}.SZWjAa_search::placeholder{color:var(--dsw-alias-label-tertiary)}";
		const tagId = "dsh-session-manager/ArchivedSessions.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-session-manager";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var ArchivedSessions_module_css_default = {
			"root": "SZWjAa_root",
			"chevronOpen": "SZWjAa_chevronOpen",
			"detailSection": "SZWjAa_detailSection",
			"fetchTool": "SZWjAa_fetchTool",
			"fileFooter": "SZWjAa_fileFooter",
			"tab": "SZWjAa_tab",
			"subagentToggle": "SZWjAa_subagentToggle",
			"rowSelected": "SZWjAa_rowSelected",
			"chip": "SZWjAa_chip",
			"tabActive": "SZWjAa_tabActive",
			"viewSwitch": "SZWjAa_viewSwitch",
			"subagentToggleOpen": "SZWjAa_subagentToggleOpen",
			"detailGrid": "SZWjAa_detailGrid",
			"fetchRow": "SZWjAa_fetchRow",
			"search": "SZWjAa_search",
			"subagentBadge": "SZWjAa_subagentBadge",
			"groupTitle": "SZWjAa_groupTitle",
			"time": "SZWjAa_time",
			"viewSwitchItemActive": "SZWjAa_viewSwitchItemActive",
			"groupHeader": "SZWjAa_groupHeader",
			"fetchList": "SZWjAa_fetchList",
			"empty": "SZWjAa_empty",
			"checkboxChecked": "SZWjAa_checkboxChecked",
			"tabs": "SZWjAa_tabs",
			"viewBar": "SZWjAa_viewBar",
			"count": "SZWjAa_count",
			"current": "SZWjAa_current",
			"currentBadge": "SZWjAa_currentBadge",
			"detailItem": "SZWjAa_detailItem",
			"checkbox": "SZWjAa_checkbox",
			"selectAll": "SZWjAa_selectAll",
			"row": "SZWjAa_row",
			"success": "SZWjAa_success",
			"hint": "SZWjAa_hint",
			"detailLabel": "SZWjAa_detailLabel",
			"fetchQuery": "SZWjAa_fetchQuery",
			"subagentRow": "SZWjAa_subagentRow",
			"error": "SZWjAa_error",
			"lineageRow": "SZWjAa_lineageRow",
			"viewSwitchItem": "SZWjAa_viewSwitchItem",
			"groupCount": "SZWjAa_groupCount",
			"toolbar": "SZWjAa_toolbar",
			"check": "SZWjAa_check",
			"details": "SZWjAa_details",
			"chips": "SZWjAa_chips",
			"detailBody": "SZWjAa_detailBody",
			"title": "SZWjAa_title",
			"checkCurrent": "SZWjAa_checkCurrent",
			"list": "SZWjAa_list",
			"chevron": "SZWjAa_chevron",
			"heading": "SZWjAa_heading"
		};
		//#endregion
		//#region src/client/ArchivedSessionsSection.tsx
		/**
		* The Session manager panel component: two tabs (All / Archived), flat or
		* by-workspace views, batch archive / unarchive / delete with confirmation,
		* expandable per-session details, subagent nesting, and open-record-folder.
		* Pure presentation: all data arrives through the four prop shares.
		*/
		/** Default request timeout; a hung fetch otherwise leaves the row "loading" forever. */
		const API_TIMEOUT_MS = 15e3;
		/** Upper bound for the per-session detail cache (LRU eviction). */
		const DETAILS_CACHE_LIMIT = 50;
		async function api(method, payload, options) {
			const controller = new AbortController();
			const timer = setTimeout(() => controller.abort(), options?.timeoutMs ?? API_TIMEOUT_MS);
			let response;
			try {
				response = await fetch(`/archived/api/${method}`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(payload ?? {}),
					signal: controller.signal
				});
			} catch (error) {
				clearTimeout(timer);
				if (error instanceof Error && error.name === "AbortError") throw new Error(`archived API ${method} timed out`);
				throw error;
			}
			let body;
			try {
				body = await response.json();
			} catch (error) {
				clearTimeout(timer);
				if (error instanceof Error && error.name === "AbortError") throw new Error(`archived API ${method} timed out`);
				throw new Error(`archived API ${method} returned a non-JSON response (${response.status})`);
			}
			clearTimeout(timer);
			if (body === null || typeof body !== "object" || body.ok !== true) {
				const message = body?.error?.message ?? `archived API ${method} failed (${response.status})`;
				throw new Error(message);
			}
			return body.value;
		}
		function formatBytes(bytes) {
			if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
			if (bytes < 1024) return `${bytes} B`;
			const units = [
				"KB",
				"MB",
				"GB",
				"TB"
			];
			let value = bytes;
			let unit = -1;
			do {
				value /= 1024;
				unit++;
			} while (value >= 1024 && unit < units.length - 1);
			return `${value >= 100 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
		}
		function shortId(id) {
			return id.length > 20 ? `${id.slice(0, 10)}…${id.slice(-4)}` : id;
		}
		function sessionTitleOf(s, fallbackId) {
			if (s === void 0) return typeof fallbackId === "string" && fallbackId !== "" ? shortId(fallbackId) : "";
			const projected = s.projectionValues && typeof s.projectionValues === "object" ? s.projectionValues.title : void 0;
			if (typeof projected === "string" && projected !== "") return projected;
			if (typeof s.title === "string" && s.title !== "") return s.title;
			if (typeof s.displayTitle === "string" && s.displayTitle !== "") return s.displayTitle;
			return shortId(s.id);
		}
		function relativeTime(updatedAt, now) {
			const diff = Math.max(0, now - updatedAt);
			const minute = 60 * 1e3;
			const hour = 60 * minute;
			const day = 24 * hour;
			if (diff < minute) return {
				unit: "now",
				n: 0
			};
			if (diff < hour) return {
				unit: "minutes",
				n: Math.floor(diff / minute)
			};
			if (diff < day) return {
				unit: "hours",
				n: Math.floor(diff / hour)
			};
			if (diff < 30 * day) return {
				unit: "days",
				n: Math.floor(diff / day)
			};
			if (diff < 365 * day) return {
				unit: "months",
				n: Math.floor(diff / (30 * day))
			};
			return {
				unit: "years",
				n: Math.floor(diff / (365 * day))
			};
		}
		function timeLabel(updatedAt, now, t) {
			const { unit, n } = relativeTime(updatedAt, now);
			if (unit === "now") return t("time.now");
			return t(`time.${unit}`).replace("{n}", String(n));
		}
		function ArchivedSessionsSection({ useSessions, useWorkspaces, refresh, t }) {
			const sessions = useSessions((s) => s);
			const workspaceState = useWorkspaces((s) => s);
			const archivedIds = workspaceState?.archivedSessionIds ?? [];
			const workspaceItems = workspaceState?.items ?? [];
			const byId = sessions?.byId ?? {};
			const current = sessions?.current;
			const listPhase = sessions?.phase;
			const workspacesState = workspaceState?.state;
			workspaceState?.baselinesReady;
			const workspaceError = workspaceState?.error;
			const [, setTick] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const timer = setInterval(() => setTick((v) => v + 1), 6e4);
				return () => clearInterval(timer);
			}, []);
			const now = Date.now();
			const [tab, setTab] = (0, react.useState)("all");
			const [viewMode, setViewMode] = (0, react.useState)("flat");
			const [searchQuery, setSearchQuery] = (0, react.useState)("");
			const [expandedParents, setExpandedParents] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const toggleSubagents = (0, react.useCallback)((id) => {
				setExpandedParents((prev) => {
					const next = new Set(prev);
					if (next.has(id)) next.delete(id);
					else next.add(id);
					return next;
				});
			}, []);
			const archivedSet = (0, react.useMemo)(() => new Set(archivedIds), [archivedIds]);
			const allRows = (0, react.useMemo)(() => {
				const sortRows = (rows) => rows.sort((a, b) => {
					if (a.current !== b.current) return a.current ? -1 : 1;
					return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
				});
				if (tab === "archived") return sortRows([...archivedIds].map((id) => ({
					id,
					title: sessionTitleOf(byId[id], id),
					updatedAt: byId[id]?.updatedAt,
					current: id === current,
					subagent: byId[id]?.origin === "subagent",
					parentId: byId[id]?.parentId
				})));
				const all = [];
				for (const [id, s] of Object.entries(byId)) {
					if (archivedSet.has(id)) continue;
					if (s.blank) continue;
					all.push({
						id,
						title: sessionTitleOf(s),
						updatedAt: s.updatedAt,
						current: id === current,
						subagent: s.origin === "subagent",
						parentId: s.parentId
					});
				}
				return sortRows(all);
			}, [
				tab,
				archivedIds,
				archivedSet,
				byId,
				current
			]);
			const rowIndex = (0, react.useMemo)(() => {
				const idSet = /* @__PURE__ */ new Set();
				const rowById = /* @__PURE__ */ new Map();
				for (const row of allRows) {
					idSet.add(row.id);
					rowById.set(row.id, row);
				}
				return {
					idSet,
					rowById
				};
			}, [allRows]);
			const subagentCounts = (0, react.useMemo)(() => {
				const counts = /* @__PURE__ */ new Map();
				for (const s of Object.values(byId)) {
					if (s.origin !== "subagent" || s.parentId === void 0) continue;
					counts.set(s.parentId, (counts.get(s.parentId) ?? 0) + 1);
				}
				return counts;
			}, [byId]);
			const filteredRows = (0, react.useMemo)(() => {
				const q = searchQuery.trim().toLowerCase();
				if (q === "") return allRows;
				return allRows.filter((row) => row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q));
			}, [allRows, searchQuery]);
			const displayRows = (0, react.useMemo)(() => {
				const childrenOf = /* @__PURE__ */ new Map();
				const tops = [];
				for (const row of filteredRows) if (!row.subagent || row.parentId === void 0 || !rowIndex.idSet.has(row.parentId)) tops.push(row);
				else {
					const list = childrenOf.get(row.parentId) ?? [];
					list.push(row);
					childrenOf.set(row.parentId, list);
				}
				const result = [];
				for (const top of tops) {
					result.push(top);
					const kids = childrenOf.get(top.id);
					if (kids !== void 0 && expandedParents.has(top.id)) for (const kid of kids.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))) result.push(kid);
				}
				return result;
			}, [
				filteredRows,
				expandedParents,
				rowIndex
			]);
			const groups = (0, react.useMemo)(() => {
				if (tab !== "all" || viewMode !== "workspace") return [];
				const childrenOf = /* @__PURE__ */ new Map();
				for (const row of filteredRows) {
					if (!row.subagent || row.parentId === void 0 || !rowIndex.idSet.has(row.parentId)) continue;
					const list = childrenOf.get(row.parentId) ?? [];
					list.push(row);
					childrenOf.set(row.parentId, list);
				}
				const lineageOf = (id) => {
					const ids = [];
					const visited = /* @__PURE__ */ new Set();
					const walk = (nodeId) => {
						if (visited.has(nodeId)) return;
						visited.add(nodeId);
						ids.push(nodeId);
						const kids = childrenOf.get(nodeId);
						if (kids !== void 0) for (const kid of kids) walk(kid.id);
					};
					walk(id);
					return ids;
				};
				const attachKids = (rows) => {
					const result = [];
					for (const row of rows) {
						result.push(row);
						const kids = childrenOf.get(row.id);
						if (kids !== void 0 && expandedParents.has(row.id)) for (const kid of kids.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))) result.push(kid);
					}
					return result;
				};
				const byWorkspace = workspaceItems.map((ws) => {
					const tops = (ws.sessionIds ?? []).map((id) => rowIndex.rowById.get(id)).filter((row) => row !== void 0);
					tops.sort((a, b) => {
						if (a.current !== b.current) return a.current ? -1 : 1;
						return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
					});
					return {
						key: ws.workspaceId,
						label: ws.title,
						rows: attachKids(tops),
						allIds: tops.flatMap((top) => lineageOf(top.id))
					};
				}).filter((group) => group.rows.length > 0);
				const accounted = new Set(byWorkspace.flatMap((group) => group.allIds));
				const ungrouped = filteredRows.filter((row) => !accounted.has(row.id) && (!row.subagent || row.parentId === void 0 || !rowIndex.idSet.has(row.parentId)));
				ungrouped.sort((a, b) => {
					if (a.current !== b.current) return a.current ? -1 : 1;
					return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
				});
				const result = [...byWorkspace];
				if (ungrouped.length > 0) result.push({
					key: "__ungrouped__",
					label: t("group.ungrouped"),
					rows: attachKids(ungrouped),
					allIds: []
				});
				return result;
			}, [
				tab,
				viewMode,
				workspaceItems,
				filteredRows,
				expandedParents,
				t,
				rowIndex
			]);
			const rows = viewMode === "workspace" && tab === "all" ? groups.flatMap((group) => group.rows) : displayRows;
			const loading = (listPhase === "pending" || workspacesState === "loading") && rows.length === 0;
			const selectableIds = (0, react.useMemo)(() => rows.filter((row) => !row.current).map((row) => row.id), [rows]);
			const [selected, setSelected] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const BATCH_SIZE = 20;
			const runBatch = async (method, targets) => {
				const results = [];
				for (let i = 0; i < targets.length; i += BATCH_SIZE) {
					const chunk = targets.slice(i, i + BATCH_SIZE);
					const settled = await Promise.allSettled(chunk.map((id) => api(method, { sessionId: id })));
					results.push(...settled);
				}
				const okCount = results.filter((r) => r.status === "fulfilled").length;
				const failCount = results.length - okCount;
				if (failCount > 0) {
					const firstFail = results.find((r) => r.status === "rejected");
					const detail = firstFail && firstFail.reason instanceof Error ? firstFail.reason.message : "";
					throw new Error(t("batchResult").replace("{ok}", String(okCount)).replace("{fail}", String(failCount)) + (detail ? `：${detail}` : ""));
				}
				return okCount;
			};
			const [dragMode, setDragMode] = (0, react.useState)(null);
			const [deleting, setDeleting] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const [success, setSuccess] = (0, react.useState)(null);
			const [confirmOpen, setConfirmOpen] = (0, react.useState)(false);
			const [expandedId, setExpandedId] = (0, react.useState)(null);
			const [detailsCache, setDetailsCache] = (0, react.useState)(() => /* @__PURE__ */ new Map());
			const [detailsBusyIds, setDetailsBusyIds] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const [detailsError, setDetailsError] = (0, react.useState)(null);
			const [selectedFiles, setSelectedFiles] = (0, react.useState)(() => /* @__PURE__ */ new Set());
			const [fileDeleting, setFileDeleting] = (0, react.useState)(false);
			const switchTab = (0, react.useCallback)((next) => {
				setTab(next);
				setSelected(/* @__PURE__ */ new Set());
				setExpandedId(null);
				setDetailsError(null);
				setSelectedFiles(/* @__PURE__ */ new Set());
			}, []);
			(0, react.useEffect)(() => {
				if (dragMode === null) return;
				const end = () => setDragMode(null);
				const onBlur = () => setDragMode(null);
				const onVisibility = () => {
					if (document.visibilityState === "hidden") setDragMode(null);
				};
				window.addEventListener("mouseup", end);
				window.addEventListener("blur", onBlur);
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					window.removeEventListener("mouseup", end);
					window.removeEventListener("blur", onBlur);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [dragMode]);
			const applyRow = (0, react.useCallback)((id, mode) => {
				setSelected((prev) => {
					const next = new Set(prev);
					if (mode) next.add(id);
					else next.delete(id);
					return next;
				});
			}, []);
			const onRowMouseDown = (0, react.useCallback)((id, event) => {
				event.preventDefault();
				const mode = !selected.has(id);
				applyRow(id, mode);
				setDragMode(mode);
			}, [selected, applyRow]);
			const onRowMouseEnter = (0, react.useCallback)((id) => {
				if (dragMode !== null) applyRow(id, dragMode);
			}, [dragMode, applyRow]);
			const onRowKeyDown = (0, react.useCallback)((id, event) => {
				const target = event.target;
				if (target !== null && typeof target === "object" && (target.tagName === "BUTTON" || target.tagName === "INPUT")) return;
				if (event.key !== "Enter" && event.key !== " ") return;
				event.preventDefault();
				applyRow(id, !selected.has(id));
			}, [selected, applyRow]);
			const latestDetailsRequest = (0, react.useRef)(null);
			const toggleDetails = (0, react.useCallback)((row) => {
				if (expandedId === row.id) {
					setExpandedId(null);
					return;
				}
				setExpandedId(row.id);
				setSelectedFiles(/* @__PURE__ */ new Set());
				setDetailsError(null);
				if (detailsCache.has(row.id)) {
					setDetailsCache((prev) => {
						if (!prev.has(row.id)) return prev;
						const next = new Map(prev);
						const value = next.get(row.id);
						next.delete(row.id);
						next.set(row.id, value);
						return next;
					});
					return;
				}
				const targetId = row.id;
				latestDetailsRequest.current = targetId;
				setDetailsBusyIds((prev) => new Set(prev).add(targetId));
				api("details", { sessionId: targetId }).then((value) => {
					if (latestDetailsRequest.current !== targetId) return;
					setDetailsCache((prev) => {
						const next = new Map(prev);
						next.delete(targetId);
						next.set(targetId, value);
						while (next.size > DETAILS_CACHE_LIMIT) {
							const oldest = next.keys().next().value;
							if (oldest === void 0 || oldest === targetId) break;
							next.delete(oldest);
						}
						return next;
					});
				}).catch((reason) => {
					if (latestDetailsRequest.current !== targetId) return;
					setDetailsError(reason instanceof Error ? reason.message : String(reason));
				}).finally(() => {
					setDetailsBusyIds((prev) => {
						const next = new Set(prev);
						next.delete(targetId);
						return next;
					});
				});
			}, [expandedId, detailsCache]);
			const selectedCount = selectableIds.filter((id) => selected.has(id)).length;
			const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));
			const toggleAll = () => {
				setSelected(allSelected ? /* @__PURE__ */ new Set() : new Set(selectableIds));
			};
			const confirmDelete = async () => {
				if (deleting || selectedCount === 0) return;
				const targets = selectableIds.filter((id) => selected.has(id));
				setConfirmOpen(false);
				setDeleting(true);
				setError(null);
				setSuccess(null);
				try {
					await runBatch("delete", targets);
					setSelected(/* @__PURE__ */ new Set());
					setSuccess(t("deleteDone").replace("{n}", String(targets.length)));
					setDetailsCache((prev) => {
						const next = new Map(prev);
						for (const id of targets) next.delete(id);
						return next;
					});
					await refresh();
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setDeleting(false);
				}
			};
			const openSelectedFolder = async () => {
				setError(null);
				const targets = selectableIds.filter((id) => selected.has(id));
				const sessionId = targets.length > 0 ? targets[0] : current !== void 0 && byId[current] !== void 0 ? current : void 0;
				if (sessionId === void 0) return;
				try {
					await api("open-folder", { sessionId });
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				}
			};
			const [archiving, setArchiving] = (0, react.useState)(false);
			const [archiveConfirmOpen, setArchiveConfirmOpen] = (0, react.useState)(false);
			const archiveSelected = async () => {
				if (archiving || selectedCount === 0) return;
				const targets = selectableIds.filter((id) => selected.has(id));
				setArchiveConfirmOpen(false);
				setArchiving(true);
				setError(null);
				setSuccess(null);
				try {
					await runBatch("archive", targets);
					setSelected(/* @__PURE__ */ new Set());
					setSuccess(t("archiveDone").replace("{n}", String(targets.length)));
					setDetailsCache((prev) => {
						const next = new Map(prev);
						for (const id of targets) next.delete(id);
						return next;
					});
					await refresh();
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setArchiving(false);
				}
			};
			const unarchiveSelected = async () => {
				if (archiving || selectedCount === 0) return;
				const targets = selectableIds.filter((id) => selected.has(id));
				setArchiving(true);
				setError(null);
				setSuccess(null);
				try {
					await runBatch("unarchive", targets);
					setSelected(/* @__PURE__ */ new Set());
					setSuccess(t("unarchiveDone").replace("{n}", String(targets.length)));
					setDetailsCache((prev) => {
						const next = new Map(prev);
						for (const id of targets) next.delete(id);
						return next;
					});
					await refresh();
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setArchiving(false);
				}
			};
			const switchViewMode = (0, react.useCallback)((mode) => {
				setViewMode(mode);
				setSelected(/* @__PURE__ */ new Set());
				setExpandedId(null);
				setDetailsError(null);
				setSelectedFiles(/* @__PURE__ */ new Set());
			}, []);
			const toggleFile = (path) => {
				setSelectedFiles((prev) => {
					const next = new Set(prev);
					if (next.has(path)) next.delete(path);
					else next.add(path);
					return next;
				});
			};
			const [fileConfirmOpen, setFileConfirmOpen] = (0, react.useState)(false);
			const [pendingFileDeleteRow, setPendingFileDeleteRow] = (0, react.useState)(null);
			const requestFileDelete = (row) => {
				setPendingFileDeleteRow(row);
				setFileConfirmOpen(true);
			};
			const doDeleteSelectedFiles = async () => {
				const row = pendingFileDeleteRow;
				setFileConfirmOpen(false);
				setPendingFileDeleteRow(null);
				if (row === null || row === void 0) return;
				const currentDetails = detailsCache.get(row.id);
				const known = new Set((currentDetails?.files ?? []).map((file) => file.path));
				const targets = [...selectedFiles].filter((path) => known.has(path));
				if (targets.length === 0 || fileDeleting) return;
				setFileDeleting(true);
				setError(null);
				try {
					const failed = (await Promise.allSettled(targets.map((path) => api("delete-file", {
						path,
						sessionId: row.id
					})))).filter((r) => r.status === "rejected");
					if (failed.length > 0) {
						const detail = failed[0].reason instanceof Error ? failed[0].reason.message : "";
						throw new Error(t("batchResult").replace("{ok}", String(targets.length - failed.length)).replace("{fail}", String(failed.length)) + (detail ? `：${detail}` : ""));
					}
					setSelectedFiles(/* @__PURE__ */ new Set());
					const value = await api("details", { sessionId: row.id });
					setDetailsCache((prev) => {
						const next = new Map(prev);
						next.set(row.id, value);
						return next;
					});
				} catch (reason) {
					setError(reason instanceof Error ? reason.message : String(reason));
				} finally {
					setFileDeleting(false);
				}
			};
			const renderDetails = (row, data) => {
				const loadingDetails = data === void 0 && detailsBusyIds.has(row.id);
				const failed = data === void 0 && detailsError !== null;
				const parent = data?.lineage?.parentSessionId ?? null;
				const children = data?.lineage?.children ?? [];
				const files = (data?.files ?? []).slice(0, 200);
				const stats = data?.stats;
				const toolNames = stats && typeof stats.toolCounts === "object" && stats.toolCounts !== null ? Object.keys(stats.toolCounts) : [];
				const fetchList = stats?.fetches ?? [];
				const childTitles = children.map((id) => byId[id]?.title ?? shortId(id));
				const fileSelectedCount = files.filter((file) => selectedFiles.has(file.path)).length;
				const statRows = stats === void 0 ? [] : [
					[t("turns"), stats.turns],
					[t("steps"), stats.steps],
					[t("userMessages"), stats.userMessages],
					[t("assistantMessages"), stats.assistantMessages],
					[t("toolCalls"), stats.toolCalls],
					[t("attachments"), stats.attachments]
				];
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ArchivedSessions_module_css_default.details,
					children: [
						loadingDetails && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ArchivedSessions_module_css_default.hint,
							children: t("detailsLoading")
						}),
						failed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ArchivedSessions_module_css_default.error,
							role: "alert",
							children: detailsError
						}),
						data !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ArchivedSessions_module_css_default.detailBody,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: ArchivedSessions_module_css_default.detailGrid,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: ArchivedSessions_module_css_default.detailItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.detailLabel,
											children: t("size")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: data.sizeBytes === null ? t("na") : formatBytes(data.sizeBytes) })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: ArchivedSessions_module_css_default.detailItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.detailLabel,
											children: t("updated")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: data.updatedAt ? timeLabel(data.updatedAt, now, t) : t("na") })]
									})]
								}),
								statRows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailSection,
									children: t("activity")
								}),
								statRows.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailGrid,
									children: statRows.map(([label, value]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: ArchivedSessions_module_css_default.detailItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.detailLabel,
											children: label
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: value })]
									}, label))
								}),
								toolNames.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailSection,
									children: t("tools")
								}),
								toolNames.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.chips,
									children: toolNames.slice(0, 12).map((name) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: ArchivedSessions_module_css_default.chip,
										children: `${name} ×${stats?.toolCounts[name] ?? 0}`
									}, name))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailSection,
									children: t("fetches")
								}),
								fetchList.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.hint,
									children: t("noFetches")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.fetchList,
									children: fetchList.map((fetch) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: ArchivedSessions_module_css_default.fetchRow,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.fetchTool,
											children: fetch.tool
										}), fetch.query !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.fetchQuery,
											title: fetch.query,
											children: fetch.query
										})]
									}, `${fetch.tool}:${fetch.query ?? ""}`))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailSection,
									children: t("files")
								}),
								files.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.hint,
									children: t("noFiles")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: ArchivedSessions_module_css_default.fetchList,
									children: [files.map((file) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: ArchivedSessions_module_css_default.selectAll,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: selectedFiles.has(file.path),
											onChange: () => toggleFile(file.path)
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: ArchivedSessions_module_css_default.title,
											title: file.path,
											children: file.path
										})]
									}, file.path)), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: ArchivedSessions_module_css_default.fileFooter,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											disabled: fileSelectedCount === 0 || fileDeleting,
											onClick: () => requestFileDelete(row),
											children: fileDeleting ? t("fileDeleting") : `${t("fileDelete")}（${fileSelectedCount}）`
										})
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: ArchivedSessions_module_css_default.detailSection,
									children: t("lineage")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: ArchivedSessions_module_css_default.lineageRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: ArchivedSessions_module_css_default.detailLabel,
										children: t("parent")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: parent === null ? t("none") : byId[parent]?.title ?? shortId(parent) })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: ArchivedSessions_module_css_default.lineageRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: ArchivedSessions_module_css_default.detailLabel,
										children: t("children")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: children.length === 0 ? t("none") : childTitles.join("、") })]
								})
							]
						})
					]
				});
			};
			const rowElement = (row) => {
				const isSelected = selected.has(row.id);
				const isExpanded = expandedId === row.id;
				const data = isExpanded ? detailsCache.get(row.id) : void 0;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${ArchivedSessions_module_css_default.row}${isSelected ? ` ${ArchivedSessions_module_css_default.rowSelected}` : ""}${row.current ? ` ${ArchivedSessions_module_css_default.current}` : ""}${row.subagent ? ` ${ArchivedSessions_module_css_default.subagentRow}` : ""}`,
					"aria-selected": isSelected,
					title: row.current ? t("currentHint") : void 0,
					tabIndex: row.current ? -1 : 0,
					onKeyDown: row.current ? void 0 : (event) => onRowKeyDown(row.id, event),
					onMouseDown: row.current ? void 0 : (event) => onRowMouseDown(row.id, event),
					onMouseEnter: row.current ? void 0 : () => onRowMouseEnter(row.id),
					children: [
						(subagentCounts.get(row.id) ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${ArchivedSessions_module_css_default.subagentToggle}${expandedParents.has(row.id) ? ` ${ArchivedSessions_module_css_default.subagentToggleOpen}` : ""}`,
							"aria-label": expandedParents.has(row.id) ? t("subagentCollapse") : t("subagentExpand"),
							"aria-expanded": expandedParents.has(row.id),
							onMouseDown: (e) => e.stopPropagation(),
							onClick: (e) => {
								e.stopPropagation();
								toggleSubagents(row.id);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTriangleRightFill14, {})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: row.current ? `${ArchivedSessions_module_css_default.check} ${ArchivedSessions_module_css_default.checkCurrent}` : ArchivedSessions_module_css_default.check,
							children: row.current ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: ArchivedSessions_module_css_default.currentBadge,
								children: t("current")
							}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${ArchivedSessions_module_css_default.checkbox}${isSelected ? ` ${ArchivedSessions_module_css_default.checkboxChecked}` : ""}`,
								children: isSelected && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { size: 12 })
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ArchivedSessions_module_css_default.title,
							title: row.title,
							children: row.title
						}),
						row.updatedAt !== void 0 && Number.isFinite(row.updatedAt) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ArchivedSessions_module_css_default.time,
							title: new Date(row.updatedAt).toLocaleString(),
							children: timeLabel(row.updatedAt, now, t)
						}),
						row.subagent && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ArchivedSessions_module_css_default.subagentBadge,
							children: t("subagent")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${ArchivedSessions_module_css_default.chevron}${isExpanded ? ` ${ArchivedSessions_module_css_default.chevronOpen}` : ""}`,
							"aria-label": t("details"),
							"aria-expanded": isExpanded,
							onMouseDown: (e) => e.stopPropagation(),
							onClick: (e) => {
								e.stopPropagation();
								toggleDetails(row);
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTriangleRightFill14, {})
						})
					]
				}), isExpanded && renderDetails(row, data)] }, row.id);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ArchivedSessions_module_css_default.root,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.heading,
						children: t("title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ArchivedSessions_module_css_default.tabs,
						role: "tablist",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === "all",
							className: `${ArchivedSessions_module_css_default.tab}${tab === "all" ? ` ${ArchivedSessions_module_css_default.tabActive}` : ""}`,
							onClick: () => switchTab("all"),
							children: t("tab.all")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === "archived",
							className: `${ArchivedSessions_module_css_default.tab}${tab === "archived" ? ` ${ArchivedSessions_module_css_default.tabActive}` : ""}`,
							onClick: () => switchTab("archived"),
							children: t("tab.archived")
						})]
					}),
					tab === "all" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ArchivedSessions_module_css_default.viewBar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "search",
							className: ArchivedSessions_module_css_default.search,
							value: searchQuery,
							placeholder: t("searchPlaceholder"),
							onChange: (e) => setSearchQuery(e.target.value)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ArchivedSessions_module_css_default.viewSwitch,
							role: "group",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${ArchivedSessions_module_css_default.viewSwitchItem}${viewMode === "flat" ? ` ${ArchivedSessions_module_css_default.viewSwitchItemActive}` : ""}`,
								"aria-pressed": viewMode === "flat",
								onClick: () => switchViewMode("flat"),
								children: t("view.flat")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${ArchivedSessions_module_css_default.viewSwitchItem}${viewMode === "workspace" ? ` ${ArchivedSessions_module_css_default.viewSwitchItemActive}` : ""}`,
								"aria-pressed": viewMode === "workspace",
								onClick: () => switchViewMode("workspace"),
								children: t("view.workspace")
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ArchivedSessions_module_css_default.toolbar,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: ArchivedSessions_module_css_default.selectAll,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: allSelected,
									onChange: toggleAll,
									disabled: selectableIds.length === 0
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("selectAll") })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: ArchivedSessions_module_css_default.count,
								children: t("selected").replace("{n}", String(selectedCount))
							}),
							tab === "all" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: selectedCount === 0 || archiving,
								onClick: () => setArchiveConfirmOpen(true),
								children: archiving ? t("archiving") : t("archive")
							}),
							tab === "archived" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: selectedCount === 0 || archiving,
								onClick: () => void unarchiveSelected(),
								children: archiving ? t("unarchiving") : t("unarchive")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: selectedCount === 0 || deleting,
								onClick: () => setConfirmOpen(true),
								children: deleting ? t("deleting") : t("delete")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: rows.length === 0,
								title: t("openFolderHint"),
								onClick: () => void openSelectedFolder(),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconFolderOpenOutline16, { size: 14 }),
									" ",
									t("openFolder")
								]
							})
						]
					}),
					success !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.success,
						role: "status",
						children: success
					}),
					error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.error,
						role: "alert",
						children: error
					}),
					workspaceError !== null && workspaceError !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ArchivedSessions_module_css_default.error,
						role: "alert",
						children: [
							String(workspaceError?.message ?? workspaceError),
							" ",
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void refresh(),
								children: t("retry")
							}, "retry")
						]
					}),
					rows.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.empty,
						children: loading ? t("loading") : t(tab === "all" ? "emptyAll" : "emptyArchived")
					}) : viewMode === "workspace" && tab === "all" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.list,
						children: groups.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ArchivedSessions_module_css_default.groupHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: ArchivedSessions_module_css_default.groupTitle,
								children: group.label
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: ArchivedSessions_module_css_default.groupCount,
								children: t("group.sessions").replace("{n}", String(group.rows.length))
							})]
						}), group.rows.map((row) => rowElement(row))] }, group.key))
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: ArchivedSessions_module_css_default.list,
						children: rows.map((row) => rowElement(row))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: confirmOpen,
						onClose: () => {
							if (!deleting) setConfirmOpen(false);
						},
						closeLabel: t("close"),
						title: t("delete"),
						description: t("confirm").replace("{n}", String(selectedCount)),
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: deleting,
							onClick: () => setConfirmOpen(false),
							children: t("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: deleting,
							onClick: confirmDelete,
							children: deleting ? t("deleting") : t("delete")
						})] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: archiveConfirmOpen,
						onClose: () => {
							if (!archiving) setArchiveConfirmOpen(false);
						},
						closeLabel: t("close"),
						title: t("archive"),
						description: t("archiveConfirm").replace("{n}", String(selectedCount)),
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: archiving,
							onClick: () => setArchiveConfirmOpen(false),
							children: t("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: archiving,
							onClick: archiveSelected,
							children: archiving ? t("archiving") : t("archive")
						})] })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: fileConfirmOpen,
						onClose: () => {
							if (!fileDeleting) setFileConfirmOpen(false);
						},
						closeLabel: t("close"),
						title: t("fileDelete"),
						description: t("fileDeleteConfirm").replace("{n}", String(pendingFileDeleteRow !== null && pendingFileDeleteRow !== void 0 ? [...selectedFiles].filter((path) => (detailsCache.get(pendingFileDeleteRow.id)?.files ?? []).some((file) => file.path === path)).length : 0)),
						footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: fileDeleting,
							onClick: () => setFileConfirmOpen(false),
							children: t("cancel")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: fileDeleting,
							onClick: () => void doDeleteSelectedFiles(),
							children: fileDeleting ? t("fileDeleting") : t("fileDelete")
						})] })
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** Bilingual dictionary for the Session manager namespace. */
		const NS = "archived-sessions";
		const dictionaries = {
			zh: {
				nav: "会话管理",
				title: "会话管理",
				"tab.all": "所有对话",
				"tab.archived": "归档会话",
				empty: "没有可显示的会话",
				emptyAll: "没有未归档的对话",
				emptyArchived: "没有归档的会话",
				selectAll: "全选",
				selected: "已选 {n} 项",
				delete: "删除选中",
				deleting: "正在删除…",
				archive: "移动到归档",
				archiving: "正在归档…",
				unarchive: "移出归档",
				unarchiving: "正在移出…",
				deleteDone: "已删除 {n} 个会话",
				archiveDone: "已归档 {n} 个会话",
				unarchiveDone: "已移出归档 {n} 个会话",
				"view.workspace": "按工作区",
				"view.flat": "单列表",
				searchPlaceholder: "搜索会话…",
				"group.ungrouped": "未分组",
				"group.sessions": "{n} 个会话",
				batchResult: "成功 {ok} 项，失败 {fail} 项",
				archiveConfirm: "确认将 {n} 个会话移动到归档？它们将从所有对话中隐藏，但记录不会删除。",
				openFolder: "打开记录文件夹",
				openFolderHint: "在文件管理器中打开所选会话的记录文件夹",
				confirm: "确认删除 {n} 个会话？会话记录将被永久删除，此操作不可恢复。",
				current: "当前会话",
				currentHint: "当前打开的会话不能删除，请先切换到其他会话",
				subagent: "子代理",
				subagentExpand: "展开子代理",
				subagentCollapse: "收起子代理",
				details: "详情",
				detailsLoading: "正在加载详情…",
				activity: "活动统计",
				loading: "正在加载…",
				retry: "重试",
				size: "占用空间",
				updated: "最后更新",
				turns: "轮次",
				steps: "步骤",
				userMessages: "用户消息",
				assistantMessages: "回复消息",
				toolCalls: "工具调用",
				attachments: "附件",
				tools: "工具使用",
				fetches: "网络获取 / 下载",
				noFetches: "无网络获取记录",
				lineage: "关联对话",
				parent: "父会话",
				children: "子会话（分叉）",
				subagents: "子代理会话",
				recalledBy: "被其他对话查看/召回",
				noRecalls: "暂无其他对话查看过本对话",
				files: "下载 / 产出文件",
				noFiles: "该对话没有产出文件",
				fileDelete: "删除选中文件",
				fileDeleteConfirm: "确认删除选中的 {n} 个文件？文件将被永久删除，此操作不可恢复。",
				fileDeleting: "正在删除文件…",
				count: "{n} 个",
				none: "无",
				na: "—",
				"time.now": "刚刚",
				"time.minutes": "{n}分钟",
				"time.hours": "{n}小时",
				"time.days": "{n}天",
				"time.months": "{n}个月",
				"time.years": "{n}年",
				close: "关闭",
				cancel: "取消"
			},
			en: {
				nav: "Session manager",
				title: "Session manager",
				"tab.all": "All conversations",
				"tab.archived": "Archived",
				empty: "No sessions to show",
				emptyAll: "No active conversations",
				emptyArchived: "No archived sessions",
				selectAll: "Select all",
				selected: "{n} selected",
				delete: "Delete selected",
				deleting: "Deleting…",
				archive: "Archive",
				archiving: "Archiving…",
				unarchive: "Unarchive",
				unarchiving: "Unarchiving…",
				deleteDone: "Deleted {n} session(s)",
				archiveDone: "Archived {n} session(s)",
				unarchiveDone: "Unarchived {n} session(s)",
				"view.workspace": "By workspace",
				"view.flat": "Flat list",
				searchPlaceholder: "Search sessions…",
				"group.ungrouped": "Ungrouped",
				"group.sessions": "{n} sessions",
				batchResult: "{ok} succeeded, {fail} failed",
				archiveConfirm: "Move {n} session(s) to archive? They will be hidden from all conversations, but their records are kept.",
				openFolder: "Open record folder",
				openFolderHint: "Open the selected session's record folder in your file manager",
				confirm: "Delete {n} session(s)? Session logs will be permanently removed. This cannot be undone.",
				current: "Current",
				currentHint: "The current session cannot be deleted. Switch to another session first.",
				subagent: "subagent",
				subagentExpand: "Expand subagents",
				subagentCollapse: "Collapse subagents",
				details: "Details",
				detailsLoading: "Loading details…",
				activity: "Activity",
				loading: "Loading…",
				retry: "Retry",
				size: "Size on disk",
				updated: "Last updated",
				turns: "Turns",
				steps: "Steps",
				userMessages: "User messages",
				assistantMessages: "Replies",
				toolCalls: "Tool calls",
				attachments: "Attachments",
				tools: "Tool usage",
				fetches: "Web fetches / downloads",
				noFetches: "No web fetches",
				lineage: "Related conversations",
				parent: "Parent",
				children: "Children (forks)",
				subagents: "Subagent sessions",
				recalledBy: "Viewed / recalled by",
				noRecalls: "No other conversations recalled this one",
				files: "Downloads / produced files",
				noFiles: "This conversation produced no files",
				fileDelete: "Delete selected files",
				fileDeleteConfirm: "Delete {n} selected file(s)? Files will be permanently removed. This cannot be undone.",
				fileDeleting: "Deleting files…",
				count: "{n}",
				none: "None",
				na: "—",
				"time.now": "now",
				"time.minutes": "{n}min",
				"time.hours": "{n}h",
				"time.days": "{n}d",
				"time.months": "{n}mo",
				"time.years": "{n}y",
				close: "Close",
				cancel: "Cancel"
			}
		};
		//#endregion
		//#region src/client/index.ts
		/**
		* dsh-session-manager — browser half.
		*
		* Registers the "Session manager" section into the Settings shell. All data
		* arrives through the slot system's standard seats (global useSessions /
		* useWorkspaces hooks) plus an inject face that refreshes both baselines; the
		* framework synthesizes the `t` seat from the declared `locale` namespace.
		*/
		/** Cordis service names this plugin's browser half injects. */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"workspaces"
		];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, dictionaries), "dsh-session-manager: dictionaries");
			const t = ctx.locale.bind(NS);
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "archived-sessions",
				order: 200,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({ refresh: async () => {
					await ctx.sessions.refresh();
					await ctx.workspaces.refresh();
				} })
			}, ArchivedSessionsSection));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map