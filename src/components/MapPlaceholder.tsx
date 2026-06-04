import { clsx } from "clsx";

interface MapPlaceholderProps {
  className?: string;
  routeColor?: string;
  showControls?: boolean;
}

export function MapPlaceholder({
  className,
  routeColor = "#f59e0b",
  showControls = true,
}: MapPlaceholderProps) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-xl border border-stone-800 bg-stone-900",
        className,
      )}
    >
      {/* Simulated topographic pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="topo"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
              <circle
                cx="50"
                cy="50"
                r="10"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      {/* Mock route line */}
      <svg
        viewBox="0 0 400 250"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M 30 200 Q 80 180, 120 150 Q 160 120, 200 130 Q 240 140, 280 100 Q 320 60, 370 80"
          fill="none"
          stroke={routeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        {/* Start marker */}
        <circle cx="30" cy="200" r="6" fill="#10b981" />
        <text
          x="30"
          y="193"
          textAnchor="middle"
          fill="#10b981"
          fontSize="8"
          fontFamily="Plus Jakarta Sans"
        >
          S
        </text>
        {/* End marker */}
        <circle cx="370" cy="80" r="6" fill="#ef4444" />
        <text
          x="370"
          y="73"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="8"
          fontFamily="Plus Jakarta Sans"
        >
          E
        </text>
      </svg>

      {/* MapLibre placeholder text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full bg-stone-800/80 px-3 py-1.5 text-xs text-stone-500 backdrop-blur-sm">
          MapLibre GL 地图
        </span>
      </div>

      {/* Zoom controls */}
      {showControls && (
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-700 bg-stone-800/90 text-stone-400 backdrop-blur-sm hover:bg-stone-700 hover:text-stone-200 transition-colors text-sm font-mono">
            +
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-700 bg-stone-800/90 text-stone-400 backdrop-blur-sm hover:bg-stone-700 hover:text-stone-200 transition-colors text-sm font-mono">
            -
          </button>
        </div>
      )}
    </div>
  );
}
