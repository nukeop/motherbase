import type { Transition } from "motion/react";

export const transitions = {
  snappy: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  instant: {
    duration: 0,
  },
} as const satisfies Record<string, Transition>;
