import type { FC } from "react";
import { cn } from "../../utils";
import type { Crumb } from "./crumbs";

type CrumbRunProps = {
  crumbs: Crumb[];
  selected: boolean;
  onSelect: (prefix: string) => void;
};

export const CrumbRun: FC<CrumbRunProps> = ({ crumbs, selected, onSelect }) => (
  <>
    {crumbs.map(({ label, prefix }) => (
      <span key={prefix} className="inline-flex items-baseline">
        <span className="select-none text-steel/40">/</span>
        <button
          type="button"
          data-selected={selected}
          onClick={() => onSelect(prefix)}
          className={cn(
            "cursor-pointer px-0.5 transition-colors hover:text-ink",
            { "text-ink": selected },
            { "text-steel": !selected },
          )}
        >
          {label}
        </button>
      </span>
    ))}
  </>
);
