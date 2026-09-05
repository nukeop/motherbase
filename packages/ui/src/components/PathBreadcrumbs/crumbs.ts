import { parse } from "pathe";

type DirSegment = {
  type: "dir";
  name: string;
};

type FileSegment = {
  type: "file";
  name: string;
  ext: string;
};

export type PathSegment = DirSegment | FileSegment;

export type Crumb = {
  label: string;
  prefix: string;
};

export const parsePath = (path: string): PathSegment[] => {
  const { dir, name, ext } = parse(path);
  const dirs = dir
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment): PathSegment => ({ type: "dir", name: segment }));
  return [...dirs, { type: "file", name, ext }];
};

const segmentLabel = (segment: PathSegment): string => {
  if (segment.type === "dir") {
    return segment.name;
  }
  return `${segment.name}${segment.ext}`;
};

export const toCrumbs = (path: string): Crumb[] => {
  const labels = parsePath(path).map(segmentLabel);
  return labels.map((label, index) => ({
    label,
    prefix: `/${labels.slice(0, index + 1).join("/")}`,
  }));
};

export const isWithinSelection = (prefix: string, selected: string): boolean =>
  prefix === selected || selected.startsWith(`${prefix}/`);
