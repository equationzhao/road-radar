import { Badge } from "./ui/Badge";

interface TagListProps {
  tags: string[];
  onRemove?: (tag: string) => void;
  onAdd?: () => void;
  color?: string;
}

const tagColors: Record<string, string> = {
  好路: "#10b981",
  烂路: "#ef4444",
  gravel: "#f97316",
  风景好: "#06b6d4",
  适合新手: "#22c55e",
  挑战: "#ef4444",
  山路: "#a855f7",
  环湖: "#0ea5e9",
  绿道: "#10b981",
  休闲: "#14b8a6",
  短途: "#84cc16",
  爬坡: "#f43f5e",
  无车: "#22c55e",
  湿地: "#14b8a6",
  经典路线: "#f59e0b",
  夜骑: "#6366f1",
  市区: "#78716c",
};

export function TagList({ tags, onRemove, onAdd }: TagListProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((tag) => (
        <Badge
          key={tag}
          color={tagColors[tag] || "#f59e0b"}
          onRemove={onRemove ? () => onRemove(tag) : undefined}
        >
          {tag}
        </Badge>
      ))}
      {onAdd && (
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-stone-700 px-2 py-0.5 text-xs text-stone-500 transition-colors hover:border-stone-500 hover:text-stone-300"
        >
          + 标签
        </button>
      )}
    </div>
  );
}
