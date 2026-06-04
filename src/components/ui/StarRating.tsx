import { clsx } from "clsx";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={clsx(
            sizes[size],
            "transition-colors duration-150",
            interactive && "cursor-pointer hover:scale-110",
            i < value ? "text-amber-400" : "text-stone-700",
          )}
        >
          {i < value ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
