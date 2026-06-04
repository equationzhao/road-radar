import { useState, useRef, useEffect } from "react";
import { RouteCard } from "../components/RouteCard";
import { mockRoutes } from "../data/mock-routes";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StarRating } from "../components/ui/StarRating";
import { MapPlaceholder } from "../components/MapPlaceholder";
import { ElevationChart } from "../components/ElevationChart";
import { GradientBar } from "../components/GradientBar";
import { Badge } from "../components/ui/Badge";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { allTags } from "../data/mock-routes";
import { parseGpx, type ParsedRoute } from "../api/tauri";
import { open } from "@tauri-apps/plugin-dialog";

type View = "list" | "import-drop" | "import-parsed" | "import-form";

export function RouteList() {
  const [view, setView] = useState<View>("list");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [importTags, setImportTags] = useState<string[]>([]);
  const [importRating, setImportRating] = useState(2);
  const [parsedRoute, setParsedRoute] = useState<ParsedRoute | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterTagsAnd, setFilterTagsAnd] = useState(false);
  const [filterDifficulties, setFilterDifficulties] = useState<number[]>([]);
  const [filterMinDist, setFilterMinDist] = useState("");
  const [filterMaxDist, setFilterMaxDist] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);

  const hasActiveFilters = filterTags.length > 0 || filterDifficulties.length > 0 || filterMinDist || filterMaxDist;

  const filtered = mockRoutes.filter((r) => {
    const matchesSearch =
      r.name.includes(search) ||
      r.location.includes(search) ||
      r.tags.some((t) => t.includes(search));
    const matchesTags = filterTags.length === 0 || (filterTagsAnd
      ? filterTags.every((t) => r.tags.includes(t))
      : filterTags.some((t) => r.tags.includes(t)));
    const matchesDiff = filterDifficulties.length === 0 || filterDifficulties.includes(r.difficulty);
    const matchesMinDist = !filterMinDist || r.distance >= Number(filterMinDist);
    const matchesMaxDist = !filterMaxDist || r.distance <= Number(filterMaxDist);
    return matchesSearch && matchesTags && matchesDiff && matchesMinDist && matchesMaxDist;
  });

  const handleFilePick = async () => {
    setImportLoading(true);
    setImportError(null);
    try {
      const file = await open({
        multiple: false,
        filters: [{ name: "GPX", extensions: ["gpx"] }],
      });
      if (typeof file === "string") {
        const parsed = await parseGpx(file);
        setParsedRoute(parsed);
        setView("import-parsed");
      }
    } catch (e) {
      setImportError(e instanceof Error ? e.message : String(e));
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-stone-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="font-display text-lg font-bold tracking-tight text-stone-100">
            Road Radar
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            title="设置"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        {view === "list" && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-100">
                  路书库
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  {mockRoutes.length} 条路书 · {mockRoutes.reduce((s, r) => s + r.distance, 0).toFixed(0)} km 总距离
                </p>
              </div>
              <Button onClick={() => setView("import-drop")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                导入路书
              </Button>
            </div>

            {/* Search & view toggle */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  placeholder="搜索路书名称、位置、标签..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-lg border border-stone-800 bg-stone-900/60 pl-10 pr-4 text-sm text-stone-200 placeholder-stone-600 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
              <div className="flex rounded-lg border border-stone-800 bg-stone-900/60 p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md px-3 py-1.5 text-xs font-display transition-colors ${
                    viewMode === "grid"
                      ? "bg-stone-800 text-stone-200"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  卡片
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md px-3 py-1.5 text-xs font-display transition-colors ${
                    viewMode === "list"
                      ? "bg-stone-800 text-stone-200"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  列表
                </button>
              </div>
              <div className="relative" ref={filterRef}>
                <Button variant="secondary" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  筛选
                  {hasActiveFilters && (
                    <span className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </Button>

                {filterOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-stone-800 bg-stone-950 p-4 shadow-2xl z-10 animate-page-in">
                    {/* Tags */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-display text-stone-500">标签</span>
                        {filterTags.length > 1 && (
                          <button
                            onClick={() => setFilterTagsAnd(!filterTagsAnd)}
                            className="flex items-center gap-1.5 text-[10px] text-stone-500 hover:text-stone-300 transition-colors"
                          >
                            <span className={filterTagsAnd ? "text-amber-400" : "text-stone-600"}>
                              {filterTagsAnd ? "全部匹配" : "任一匹配"}
                            </span>
                            <span
                              className={`relative inline-block h-4 w-7 rounded-full transition-colors ${
                                filterTagsAnd ? "bg-amber-500" : "bg-stone-700"
                              }`}
                            >
                              <span
                                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${
                                  filterTagsAnd ? "translate-x-3.5" : "translate-x-0.5"
                                }`}
                              />
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {allTags.map((tag) => {
                          const active = filterTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              onClick={() =>
                                setFilterTags((prev) =>
                                  active ? prev.filter((t) => t !== tag) : [...prev, tag],
                                )
                              }
                              className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                                active
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : "text-stone-500 border border-stone-800 hover:text-stone-300"
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="mb-3">
                      <div className="text-[10px] font-display text-stone-500 mb-1.5">难度（可多选）</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((d) => {
                          const active = filterDifficulties.includes(d);
                          return (
                            <button
                              key={d}
                              onClick={() =>
                                setFilterDifficulties((prev) =>
                                  active ? prev.filter((x) => x !== d) : [...prev, d],
                                )
                              }
                              className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                                active
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : "text-stone-500 border border-stone-800 hover:text-stone-300"
                              }`}
                            >
                              {d}★
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Distance range */}
                    <div className="mb-3">
                      <div className="text-[10px] font-display text-stone-500 mb-1.5">距离 (km)</div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="最短"
                          value={filterMinDist}
                          onChange={(e) => setFilterMinDist(e.target.value)}
                          className="w-full rounded-md border border-stone-800 bg-stone-900/60 px-2 py-1 text-xs text-stone-200 placeholder-stone-700 outline-none focus:border-amber-500/50"
                        />
                        <span className="text-stone-600 text-xs leading-7">-</span>
                        <input
                          type="number"
                          placeholder="最长"
                          value={filterMaxDist}
                          onChange={(e) => setFilterMaxDist(e.target.value)}
                          className="w-full rounded-md border border-stone-800 bg-stone-900/60 px-2 py-1 text-xs text-stone-200 placeholder-stone-700 outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>

                    {/* Clear */}
                    {hasActiveFilters && (
                      <button
                        onClick={() => {
                          setFilterTags([]);
                          setFilterTagsAnd(false);
                          setFilterDifficulties([]);
                          setFilterMinDist("");
                          setFilterMaxDist("");
                        }}
                        className="w-full rounded-md py-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        清除筛选
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Route grid / list */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                  : "space-y-2"
              }
            >
              {filtered.map((route) => (
                <RouteCard key={route.id} route={route} viewMode={viewMode} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-20 text-center text-stone-600">
                <p className="font-display text-lg">没有找到匹配的路书</p>
                <p className="mt-1 text-sm">试试换个关键词</p>
              </div>
            )}
          </>
        )}

        {/* Import: drop zone */}
        {view === "import-drop" && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setView("list")}
              className="mb-6 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              返回路书库
            </button>

            <div
              onClick={handleFilePick}
              className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-700 bg-stone-900/30 py-20 transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer"
            >
              {importLoading ? (
                <p className="font-display text-sm text-amber-400 animate-pulse">解析中...</p>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800/80 text-stone-500 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-400">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <p className="mt-4 font-display font-semibold text-stone-300 group-hover:text-amber-400 transition-colors">
                    点击选择 GPX 文件
                  </p>
                  <p className="mt-2 text-xs text-stone-600">支持 .gpx 格式 · GPX 1.0 / 1.1</p>
                </>
              )}
              {importError && (
                <p className="mt-3 text-xs text-red-400">{importError}</p>
              )}
            </div>
          </div>
        )}

        {/* Import: parsed preview */}
        {view === "import-parsed" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <button
              onClick={() => setView("import-drop")}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              返回
            </button>

            {parsedRoute && (
              <>
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-display text-sm font-semibold text-emerald-400">解析完成</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-stone-100">{parsedRoute.name}</h3>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                      <div className="text-[10px] text-stone-600 font-display">距离</div>
                      <div className="font-mono text-lg text-stone-200">{parsedRoute.distance_km.toFixed(1)} km</div>
                    </div>
                    <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                      <div className="text-[10px] text-stone-600 font-display">爬升</div>
                      <div className="font-mono text-lg text-emerald-400">+{parsedRoute.elevation_gain.toFixed(0)}m</div>
                    </div>
                    <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                      <div className="text-[10px] text-stone-600 font-display">最大坡度</div>
                      <div className="font-mono text-lg text-red-400">{parsedRoute.max_gradient.toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <Badge color={
                      parsedRoute.ride_type === "flat" ? "#0ea5e9" :
                      parsedRoute.ride_type === "rolling" ? "#f59e0b" :
                      parsedRoute.ride_type === "hilly" ? "#f97316" : "#ef4444"
                    }>
                      {parsedRoute.ride_type === "flat" ? "平路" :
                       parsedRoute.ride_type === "rolling" ? "起伏" :
                       parsedRoute.ride_type === "hilly" ? "丘陵" : "山地"}
                    </Badge>
                    <span className="text-xs text-stone-600">系统自动分类</span>
                  </div>
                </Card>

                <MapPlaceholder className="h-48 w-full" routeColor="#f97316" />

                <Card className="p-5">
                  <h4 className="font-display font-semibold text-stone-200 mb-3">海拔剖面预览</h4>
                  <ElevationChart data={parsedRoute.elevation_profile} height={160} color="#f97316" />
                  <div className="mt-2">
                    <GradientBar data={parsedRoute.elevation_profile} />
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => { setView("import-drop"); setParsedRoute(null); }}>取消</Button>
                  <Button onClick={() => setView("import-form")}>继续编辑</Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Import: edit form */}
        {view === "import-form" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <button
              onClick={() => setView("import-parsed")}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              返回
            </button>

            <Card className="p-5 space-y-5">
              <div>
                <label className="block text-xs font-display text-stone-400 mb-1.5">路书名称</label>
                <input
                  type="text"
                  defaultValue={parsedRoute?.name ?? ""}
                  className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-display text-stone-400 mb-1.5">难度评级</label>
                <StarRating value={importRating} size="lg" interactive onChange={setImportRating} />
              </div>
              <div>
                <label className="block text-xs font-display text-stone-400 mb-1.5">标签</label>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.slice(0, 10).map((tag) => {
                    const isSelected = importTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          setImportTags((prev) =>
                            isSelected ? prev.filter((t) => t !== tag) : [...prev, tag],
                          )
                        }
                        className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                          isSelected
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                            : "border-stone-700 text-stone-500 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-display text-stone-400 mb-1.5">路书简介</label>
                <textarea
                  rows={4}
                  placeholder="写点关于这条路书的信息..."
                  className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-700 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setView("import-parsed")}>返回</Button>
              <Button onClick={() => { setView("list"); setImportTags([]); setImportRating(2); }}>确认导入</Button>
            </div>
          </div>
        )}
      </div>

      {/* Settings drawer */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
