import { useCallback, useEffect, useRef } from "react";

const BOTTOM_THRESHOLD = 40;

export const useAutoScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolled = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      userScrolled.current = true;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom < BOTTOM_THRESHOLD) {
      userScrolled.current = false;
    }
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!userScrolled.current) {
        scrollToBottom();
      }
    });

    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  return { containerRef, contentRef, handleWheel, handleScroll };
};
