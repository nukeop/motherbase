import type { Transition } from "motion/react";

export const transitions = {
  snappy: {
    type: "spring",
    duration: 0.25,
    bounce: 0.3,
  },
  instant: {
    duration: 0,
  },
} as const satisfies Record<string, Transition>;
