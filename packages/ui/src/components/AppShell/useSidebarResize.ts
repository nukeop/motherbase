import { useRef, useState } from "react";
import { SIDEBAR } from "./constants";

type Side = "left" | "right";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useSidebarResize = (
  side: Side,
  width: number,
  onWidthChange: (width: number) => void,
) => {
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ x: 0, width: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, width };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) {
      return;
    }

    const delta = side === "left"
      ? e.clientX - startRef.current.x
      : startRef.current.x - e.clientX;

    onWidthChange(clamp(startRef.current.width + delta, SIDEBAR.minWidth, SIDEBAR.maxWidth));
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    handleProps: { onPointerDown, onPointerMove, onPointerUp },
  };
};
