import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { StarRating } from "./ui/StarRating";
import type { Route, RideType } from "../data/mock-routes";
import { rideTypeLabels, rideTypeColors } from "../data/mock-routes";

interface RouteCardProps {
  route: Route;
  viewMode: "grid" | "list";
}

export function RouteCard({ route, viewMode }: RouteCardProps) {
  const navigate = useNavigate();

  if (viewMode === "list") {
    return (
      <div
        onClick={() => navigate(`/route/${route.id}`)}
        className="group flex items-center gap-4 rounded-xl border border-stone-800/60 bg-stone-900/40 px-4 py-3 transition-all duration-200 hover:border-stone-700 hover:bg-stone-900/80 cursor-pointer"
      >
        {/* Color stripe */}
        <div
          className="h-10 w-1 rounded-full shrink-0"
          style={{ backgroundColor: route.coverColor }}
        />

        {/* Name & location */}
        <div className="min-w-0 flex-1">
          <div className="font-display font-semibold text-stone-100 truncate group-hover:text-amber-400 transition-colors">
            {route.name}
          </div>
          <div className="text-xs text-stone-500">{route.location}</div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 text-xs font-mono text-stone-400 shrink-0">
          <span>{route.distance} km</span>
          <span className="text-emerald-500">+{route.elevationGain}m</span>
          <Badge color={rideTypeColors[route.rideType as RideType]}>
            {rideTypeLabels[route.rideType as RideType]}
          </Badge>
          <StarRating value={route.difficulty} size="sm" />
        </div>

        {/* Ride count */}
        <div className="text-xs text-stone-600 shrink-0 w-16 text-right">
          {route.rideCount > 0 ? `${route.rideCount} 次` : "未骑"}
        </div>
      </div>
    );
  }

  return (
    <Card
      hover
      onClick={() => navigate(`/route/${route.id}`)}
      className="group overflow-hidden"
    >
      {/* Cover with gradient */}
      <div
        className="relative h-36 w-full"
        style={{
          background: `linear-gradient(135deg, ${route.coverColor}22, ${route.coverColor}08)`,
        }}
      >
        {/* Decorative route line */}
        <svg
          viewBox="0 0 300 120"
          className="absolute inset-0 h-full w-full opacity-30"
          preserveAspectRatio="none"
        >
          <path
            d={`M 0 ${80 + Math.random() * 20} Q 50 ${40 + Math.random() * 30}, 100 ${60 + Math.random() * 20} Q 150 ${80 + Math.random() * 20}, 200 ${50 + Math.random() * 20} Q 250 ${30 + Math.random() * 30}, 300 ${60 + Math.random() * 20}`}
            fill="none"
            stroke={route.coverColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Ride type badge */}
        <div className="absolute right-3 top-3">
          <Badge color={rideTypeColors[route.rideType as RideType]}>
            {rideTypeLabels[route.rideType as RideType]}
          </Badge>
        </div>

        {/* Difficulty */}
        <div className="absolute bottom-3 left-3">
          <StarRating value={route.difficulty} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-base text-stone-100 group-hover:text-amber-400 transition-colors truncate">
          {route.name}
        </h3>
        <p className="mt-0.5 text-xs text-stone-500">{route.location}</p>

        {/* Metrics row */}
        <div className="mt-3 flex items-center gap-4 text-xs font-mono">
          <span className="text-stone-300">{route.distance} km</span>
          <span className="text-emerald-500">+{route.elevationGain}m</span>
          {route.maxGradient > 0 && (
            <span className="text-red-400">{route.maxGradient}%</span>
          )}
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {route.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-stone-800 px-1.5 py-0.5 text-[10px] text-stone-500"
            >
              {tag}
            </span>
          ))}
          {route.tags.length > 3 && (
            <span className="text-[10px] text-stone-600">
              +{route.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-stone-800/60 pt-3 text-xs text-stone-600">
          <span>
            {route.rideCount > 0 ? `骑过 ${route.rideCount} 次` : "未骑过"}
          </span>
          {route.lastRidden && (
            <span className="font-mono text-[10px]">{route.lastRidden}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
