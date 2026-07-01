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
      className="flex-1 overflow-y-auto bg-cream"
    >
      <div
        ref={contentRef}
        className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8"
      >
        {children}
      </div>
    </div>
  );
};
