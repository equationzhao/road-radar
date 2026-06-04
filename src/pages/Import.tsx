import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StarRating } from "../components/ui/StarRating";
import { MapPlaceholder } from "../components/MapPlaceholder";
import { ElevationChart } from "../components/ElevationChart";
import { GradientBar } from "../components/GradientBar";
import { Badge } from "../components/ui/Badge";
import { allTags } from "../data/mock-routes";

export function Import() {
  const [step, setStep] = useState<"drop" | "parsed" | "form">("drop");

  // Mock parsed data
  const mockParsed = {
    name: "苏州西山环线",
    distance: 65.2,
    elevationGain: 180,
    maxGradient: 6.5,
    rideType: "rolling" as const,
    elevationProfile: Array.from({ length: 80 }, (_, i) => ({
      distance: i * 0.815,
      elevation: 5 + Math.sin(i * 0.1) * 20 + Math.random() * 10,
    })),
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="font-display text-2xl font-bold text-stone-100">导入路书</h2>
      <p className="mt-1 text-sm text-stone-500">支持 GPX 格式文件</p>

      {step === "drop" && (
        <div className="mt-8">
          <div
            onClick={() => setStep("parsed")}
            className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-700 bg-stone-900/30 py-20 transition-all duration-300 hover:border-amber-500/50 hover:bg-amber-500/5 cursor-pointer"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800/80 text-stone-500 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="mt-4 font-display font-semibold text-stone-300 group-hover:text-amber-400 transition-colors">
              拖放 GPX 文件到此处
            </p>
            <p className="mt-2 text-xs text-stone-600">或点击选择文件</p>
            <p className="mt-4 text-[10px] text-stone-700">
              支持 .gpx 格式 · GPX 1.0 / 1.1
            </p>
          </div>
        </div>
      )}

      {step === "parsed" && (
        <div className="mt-8 space-y-6">
          {/* Parse result */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-display text-sm font-semibold text-emerald-400">
                解析完成
              </span>
            </div>

            <h3 className="font-display text-xl font-bold text-stone-100">
              {mockParsed.name}
            </h3>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                <div className="text-[10px] text-stone-600 font-display">距离</div>
                <div className="font-mono text-lg text-stone-200">{mockParsed.distance} km</div>
              </div>
              <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                <div className="text-[10px] text-stone-600 font-display">爬升</div>
                <div className="font-mono text-lg text-emerald-400">+{mockParsed.elevationGain}m</div>
              </div>
              <div className="rounded-lg bg-stone-800/40 px-3 py-2">
                <div className="text-[10px] text-stone-600 font-display">最大坡度</div>
                <div className="font-mono text-lg text-red-400">{mockParsed.maxGradient}%</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Badge color="#f97316">起伏</Badge>
              <span className="text-xs text-stone-600">系统自动分类</span>
            </div>
          </Card>

          {/* Map preview */}
          <MapPlaceholder className="h-48 w-full" routeColor="#f97316" />

          {/* Elevation preview */}
          <Card className="p-5">
            <h4 className="font-display font-semibold text-stone-200 mb-3">海拔剖面预览</h4>
            <ElevationChart data={mockParsed.elevationProfile} height={160} color="#f97316" />
            <div className="mt-2">
              <GradientBar data={mockParsed.elevationProfile} />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep("drop")}>
              取消
            </Button>
            <Button onClick={() => setStep("form")}>继续编辑</Button>
          </div>
        </div>
      )}

      {step === "form" && (
        <div className="mt-8 space-y-6">
          <Card className="p-5 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-display text-stone-400 mb-1.5">路书名称</label>
              <input
                type="text"
                defaultValue={mockParsed.name}
                className="w-full rounded-lg border border-stone-800 bg-stone-900/60 px-3 py-2.5 text-sm text-stone-200 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-display text-stone-400 mb-1.5">难度评级</label>
              <StarRating value={2} size="lg" interactive onChange={() => {}} />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-display text-stone-400 mb-1.5">标签</label>
              <div className="flex flex-wrap gap-1.5">
                {allTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    className="rounded-md border border-stone-700 px-2 py-1 text-xs text-stone-500 transition-colors hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
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
            <Button variant="secondary" onClick={() => setStep("parsed")}>
              返回
            </Button>
            <Button onClick={() => setStep("drop")}>确认导入</Button>
          </div>
        </div>
      )}
    </div>
  );
}
