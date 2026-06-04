import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium font-display transition-all duration-200 cursor-pointer select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20",
        secondary:
          "bg-stone-800 text-stone-200 hover:bg-stone-700 border border-stone-700",
        ghost:
          "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50",
        danger:
          "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
