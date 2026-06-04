import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: "solid" | "outline";
  className?: string;
  onRemove?: () => void;
}

export function Badge({
  children,
  color = "#f59e0b",
  variant = "solid",
  className,
  onRemove,
}: BadgeProps) {
  const style =
    variant === "solid"
      ? {
          backgroundColor: `${color}18`,
          color: color,
          borderColor: `${color}30`,
        }
      : {
          color: color,
          borderColor: `${color}40`,
        };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium font-display tracking-wide",
        className,
      )}
      style={style}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
        >
          x
        </button>
      )}
    </span>
  );
}
