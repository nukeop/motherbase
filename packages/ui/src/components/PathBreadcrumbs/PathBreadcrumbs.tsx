type PathBreadcrumbsProps = {
  path: string;
  selected: string;
  onSelect: (prefix: string) => void;
};

export const PathBreadcrumbs = ({ path }: PathBreadcrumbsProps) => (
  <span className="font-mono text-sm text-ink">{path}</span>
);
