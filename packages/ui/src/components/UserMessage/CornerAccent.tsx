import { cva, type VariantProps } from "class-variance-authority";
import type { FC } from "react";
import { cn } from "../../utils";

const cornerAccentVariants = cva("absolute w-2.5 h-2.5 border-ink", {
  variants: {
    position: {
      "top-left": "-top-px -left-px border-t-2 border-l-2",
      "top-right": "-top-px -right-px border-t-2 border-r-2",
      "bottom-left": "-bottom-px -left-px border-b-2 border-l-2",
      "bottom-right": "-bottom-px -right-px border-b-2 border-r-2",
    },
  },
});

type CornerAccentProps = {
  position: NonNullable<VariantProps<typeof cornerAccentVariants>["position"]>;
  className?: string;
};

export const CornerAccent: FC<CornerAccentProps> = ({
  position,
  className,
}) => <span className={cn(cornerAccentVariants({ position }), className)} />;
