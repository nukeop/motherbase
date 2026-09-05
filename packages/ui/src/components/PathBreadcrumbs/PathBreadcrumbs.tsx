import type { FC } from "react";
import { CrumbRun } from "./CrumbRun";
import { isWithinSelection, toCrumbs } from "./crumbs";

type PathBreadcrumbsProps = {
  path: string;
  selected: string;
  onSelect: (prefix: string) => void;
};

export const PathBreadcrumbs: FC<PathBreadcrumbsProps> = ({
  path,
  selected,
  onSelect,
}) => {
  const crumbs = toCrumbs(path);
  const selectedCrumbs = crumbs.filter(({ prefix }) =>
    isWithinSelection(prefix, selected),
  );
  const remainingCrumbs = crumbs.slice(selectedCrumbs.length);

  return (
    <span className="inline-flex items-baseline font-mono text-sm">
      <span className="inline-flex items-baseline border border-steel/30 bg-cream-dark px-1">
        <CrumbRun crumbs={selectedCrumbs} selected onSelect={onSelect} />
      </span>
      <CrumbRun crumbs={remainingCrumbs} selected={false} onSelect={onSelect} />
    </span>
  );
};
