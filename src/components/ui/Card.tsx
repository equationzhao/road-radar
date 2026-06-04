import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "rounded-xl border border-stone-800/80 bg-stone-900/60 backdrop-blur-sm",
        hover && "cursor-pointer transition-all duration-300 hover:border-stone-700 hover:bg-stone-900 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
