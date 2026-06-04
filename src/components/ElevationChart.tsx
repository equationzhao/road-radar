import { ResponsiveLine } from "@nivo/line";

interface ElevationChartProps {
  data: Array<{ distance: number; elevation: number }>;
  height?: number;
  color?: string;
}

export function ElevationChart({
  data,
  height = 220,
  color = "#f59e0b",
}: ElevationChartProps) {
  const lineData = [
    {
      id: "elevation",
      data: data.map((d) => ({ x: d.distance, y: d.elevation })),
    },
  ];

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveLine
        data={lineData}
        margin={{ top: 10, right: 20, bottom: 30, left: 50 }}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear", min: "auto", stacked: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 8,
          format: (v) => `${v}km`,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 8,
          format: (v) => `${v}m`,
        }}
        enableGridX={false}
        gridYValues={5}
        gridXValues={5}
        colors={[color]}
        lineWidth={2}
        enablePoints={false}
        enableArea
        areaBaselineValue={0}
        areaOpacity={0.15}
        defs={[
          {
            id: "gradient",
            type: "linearGradient",
            colors: [
              { offset: 0, color, opacity: 0.3 },
              { offset: 100, color, opacity: 0.02 },
            ],
          },
        ]}
        fill={[{ match: "*", id: "gradient" }]}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <div className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-xs shadow-xl">
            <div className="font-mono text-amber-400">
              {slice.points[0].data.y.toFixed(0)}m
            </div>
            <div className="text-stone-500">
              {(slice.points[0].data.x as number).toFixed(1)}km
            </div>
          </div>
        )}
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#78716c",
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
              },
            },
          },
          grid: {
            line: { stroke: "#292524", strokeWidth: 1 },
          },
          tooltip: { container: {} },
        }}
      />
    </div>
  );
}
