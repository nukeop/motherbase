import { AnimatePresence, motion } from "motion/react";
import { LuChevronDown } from "react-icons/lu";
import { useCollapsible } from "../../hooks/useCollapsible";
import { transitions } from "../../motion";
import { cn } from "../../utils";
import { Markdown } from "../Markdown";
import { CornerAccent } from "../UserMessage/CornerAccent";

type ReasoningPartProps = {
  text: string;
  isLast: boolean;
};

export const ReasoningPart = ({ text, isLast }: ReasoningPartProps) => {
  const { isExpanded, toggle } = useCollapsible(isLast);

  return (
    <div className="relative border border-blue/20 bg-blue/5">
      <CornerAccent position="top-left" className="border-blue" />
      <CornerAccent position="bottom-right" className="border-blue" />
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-widest text-blue",
          { "cursor-pointer": !isLast },
        )}
        onClick={toggle}
      >
        <span className={cn({ "animate-pulse": isLast })}>◆</span>
        <span>Thinking</span>
        <span className="flex-1" />
        {!isLast && (
          <LuChevronDown
            className={cn("transition-transform", {
              "-rotate-90": !isExpanded,
            })}
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transitions.snappy}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1">
              <Markdown className="text-sm [&_p]:text-steel [&_p]:text-sm">
                {text}
              </Markdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
