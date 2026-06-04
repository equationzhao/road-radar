import { useState } from "react";
import { Button } from "./ui/Button";

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [mapStyle, setMapStyle] = useState("streets");
  const [defaultSort, setDefaultSort] = useState("name");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-80 h-full overflow-y-auto border-l border-stone-800 bg-stone-950 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-stone-100">设置</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preferences */}
        <div className="space-y-5">
          {/* Units */}
          <div>
            <div className="text-xs font-display text-stone-400 mb-2">单位制</div>
            <div className="flex rounded-lg border border-stone-800 bg-stone-900/60 p-0.5">
              {(["metric", "imperial"] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-display transition-colors ${
                    units === u
                      ? "bg-stone-800 text-stone-200"
                      : "text-stone-500 hover:text-stone-300"
                  }`}
                >
                  {u === "metric" ? "公制" : "英制"}
                </button>
              ))}
            </div>
          </div>

          {/* Map style */}
          <div>
            <div className="text-xs font-display text-stone-400 mb-2">地图样式</div>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-xs text-stone-300 outline-none focus:border-amber-500/50"
            >
              <option value="streets">街道</option>
              <option value="satellite">卫星</option>
              <option value="terrain">地形</option>
              <option value="cycling">骑行专用</option>
            </select>
          </div>

          {/* Default sort */}
          <div>
            <div className="text-xs font-display text-stone-400 mb-2">默认排序</div>
            <select
              value={defaultSort}
              onChange={(e) => setDefaultSort(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2 text-xs text-stone-300 outline-none focus:border-amber-500/50"
            >
              <option value="name">名称</option>
              <option value="distance">距离</option>
              <option value="elevation">爬升</option>
              <option value="importDate">导入时间</option>
              <option value="lastRidden">最近骑行</option>
              <option value="difficulty">难度</option>
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-stone-800/60" />

        {/* Data */}
        <div className="space-y-4">
          <div className="text-xs font-display text-stone-400 mb-2">数据管理</div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">导出备份</Button>
            <Button variant="secondary" size="sm" className="flex-1">导入备份</Button>
          </div>
          <div className="rounded-lg bg-stone-900/40 px-3 py-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">存储用量</span>
              <span className="font-mono text-stone-400">24.5 MB</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
              <div className="h-full w-[15%] rounded-full bg-amber-500" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-6 border-t border-stone-800/60 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-semibold text-stone-300">Road Radar</span>
            <span className="font-mono text-[10px] text-stone-600">v0.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
