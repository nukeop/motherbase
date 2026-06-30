import type { ReactNode } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";

type ConversationProps = {
  children: ReactNode;
};

export const Conversation = ({ children }: ConversationProps) => {
  const { containerRef, contentRef, handleWheel, handleScroll } =
    useAutoScroll();

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onScroll={handleScroll}
      className="flex flex-1 flex-col gap-2 overflow-y-auto bg-cream-dark p-2"
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
};
