import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";

const buttonVariants = cva(
  "cursor-pointer border px-3 py-1 font-nav text-xs uppercase tracking-widest transition-colors",
  {
    variants: {
      variant: {
        default: "border-steel/30 text-steel hover:border-ink hover:text-ink",
        confirm:
          "border-steel/30 text-steel hover:border-orange hover:bg-orange/5 hover:text-orange",
        danger:
          "border-steel/30 text-steel hover:border-red hover:bg-red/5 hover:text-red",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  onClick: () => void;
  children: ReactNode;
};

export const Button: FC<ButtonProps> = ({ variant, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={buttonVariants({ variant })}
  >
    {children}
  </button>
);
