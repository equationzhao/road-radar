interface GradientBarProps {
  data: Array<{ distance: number; elevation: number }>;
  height?: number;
}

function getGradientColor(gradient: number): string {
  if (gradient < 3) return "#22c55e";
  if (gradient < 6) return "#eab308";
  if (gradient < 9) return "#f97316";
  if (gradient < 12) return "#ef4444";
  return "#991b1b";
}

export function GradientBar({ data, height = 16 }: GradientBarProps) {
  if (data.length < 2) return null;

  const segments: Array<{ pct: number; color: string }> = [];
  const totalDist = data[data.length - 1].distance;

  for (let i = 1; i < data.length; i++) {
    const dx = data[i].distance - data[i - 1].distance;
    const dy = data[i].elevation - data[i - 1].elevation;
    const gradient = dx > 0 ? Math.abs((dy / (dx * 1000)) * 100) : 0;
    segments.push({
      pct: (dx / totalDist) * 100,
      color: getGradientColor(gradient),
    });
  }

  return (
    <div
      className="w-full overflow-hidden rounded-full flex"
      style={{ height }}
    >
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{
            width: `${seg.pct}%`,
            backgroundColor: seg.color,
            minWidth: seg.pct > 0.5 ? "2px" : "0",
          }}
        />
      ))}
    </div>
  );
}
