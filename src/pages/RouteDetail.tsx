import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockRoutes, rideTypeLabels, rideTypeColors } from "../data/mock-routes";
import { ElevationChart } from "../components/ElevationChart";
import { GradientBar } from "../components/GradientBar";
import { MapPlaceholder } from "../components/MapPlaceholder";
import { TagList } from "../components/TagList";
import { StarRating } from "../components/ui/StarRating";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { AddRecordDialog } from "../components/AddRecordDialog";
import { TagManagerDialog } from "../components/TagManagerDialog";
import type { RideType } from "../data/mock-routes";

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-stone-800/60 bg-stone-900/40 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-stone-600 font-display">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold" style={{ color: color || "#e7e5e4" }}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-stone-600 font-mono">{sub}</div>}
    </div>
  );
}

export function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const route = mockRoutes.find((r) => r.id === id);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);
  const [tags, setTags] = useState(route?.tags ?? []);

  if (!route) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-stone-500">路书未找到</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
    <div className="p-8 max-w-5xl mx-auto animate-page-in">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-sm text-stone-500 hover:text-stone-300 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" />
        </svg>
        返回路书库
      </button>

      {/* Hero */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-stone-100">{route.name}</h1>
            <Badge color={rideTypeColors[route.rideType as RideType]}>
              {rideTypeLabels[route.rideType as RideType]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-stone-500">{route.location}</p>
        </div>
        <StarRating value={route.difficulty} size="lg" />
      </div>

      {/* Metric cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="距离" value={`${route.distance} km`} />
        <MetricCard label="爬升" value={`+${route.elevationGain}m`} color="#10b981" />
        <MetricCard label="下降" value={`-${route.elevationLoss}m`} color="#0ea5e9" />
        <MetricCard label="平均坡度" value={`${route.avgGradient}%`} color="#f59e0b" />
        <MetricCard label="海拔范围" value={`${route.minElevation}-${route.maxElevation}m`} sub="最低-最高" />
        <MetricCard label="骑行次数" value={`${route.rideCount}`} sub={route.lastRidden || "未骑过"} />
      </div>

      {/* Map */}
      <div className="mt-6">
        <MapPlaceholder
          className="h-64 w-full"
          routeColor={route.coverColor}
        />
      </div>

      {/* Elevation profile */}
      <Card className="mt-6 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-stone-200">海拔剖面</h3>
          <div className="flex items-center gap-4 text-[10px] font-mono text-stone-500">
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />0-3%</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />3-6%</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-orange-500" />6-9%</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-500" />9-12%</span>
            <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-red-800" />{">"}12%</span>
          </div>
        </div>
        <ElevationChart data={route.elevationProfile} color={route.coverColor} />
        <div className="mt-3">
          <GradientBar data={route.elevationProfile} />
        </div>
      </Card>

      {/* Climb segments */}
      {route.climbs.length > 0 && (
        <Card className="mt-4 p-5">
          <h3 className="font-display font-semibold text-stone-200 mb-3">爬坡区段</h3>
          <div className="space-y-3">
            {route.climbs.map((climb) => (
              <div
                key={climb.name}
                className="flex items-center gap-4 rounded-lg border border-stone-800/50 bg-stone-800/20 px-4 py-3"
              >
                <Badge color={climb.category === "HC" ? "#ef4444" : "#f97316"}>
                  {climb.category}
                </Badge>
                <span className="font-display font-medium text-stone-200 flex-1">{climb.name}</span>
                <span className="font-mono text-xs text-stone-400">{climb.distance}km</span>
                <span className="font-mono text-xs text-emerald-500">+{climb.elevationGain}m</span>
                <span className="font-mono text-xs text-stone-400">avg {climb.avgGradient}%</span>
                <span className="font-mono text-xs text-red-400">max {climb.maxGradient}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tags */}
      <Card className="mt-4 p-5">
        <h3 className="font-display font-semibold text-stone-200 mb-3">标签</h3>
        <TagList tags={tags} onAdd={() => setTagManagerOpen(true)} onRemove={(tag) => setTags((prev) => prev.filter((t) => t !== tag))} />
      </Card>

      {/* Ride journal */}
      <Card className="mt-4 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-stone-200">骑行记录</h3>
          <Button variant="secondary" size="sm" onClick={() => setAddRecordOpen(true)}>+ 添加记录</Button>
        </div>

        {route.rideEntries.length === 0 ? (
          <p className="text-sm text-stone-600 py-8 text-center">还没有骑行记录</p>
        ) : (
          <div className="space-y-4">
            {route.rideEntries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-stone-800/50 bg-stone-800/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-stone-500">{entry.date}</span>
                    {entry.weather && (
                      <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] text-stone-500">
                        {entry.weather}
                      </span>
                    )}
                    <StarRating value={entry.rating} size="sm" />
                  </div>
                  {entry.stravaUrl && (
                    <a
                      href={entry.stravaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" /></svg>
                      Strava
                    </a>
                  )}
                </div>
                <p className="mt-2 text-sm text-stone-400">{entry.notes}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AddRecordDialog
        open={addRecordOpen}
        onClose={() => setAddRecordOpen(false)}
        routeName={route.name}
      />
      <TagManagerDialog
        open={tagManagerOpen}
        onClose={() => setTagManagerOpen(false)}
        selectedTags={tags}
        onTagsChange={setTags}
      />
    </div>
    </div>
  );
}
