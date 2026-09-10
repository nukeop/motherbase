import type { Claim, Verb } from "@motherbase/core";

export const sessionDirectoryGrants = (directory: string | null): Claim[] => {
  if (directory === null) {
    return [];
  }
  return [
    { verb: "read", path: directory },
    { verb: "write", path: directory },
  ];
};

export class SessionGrants {
  readonly #prefixes: Record<Verb, Set<string>> = {
    read: new Set(),
    write: new Set(),
  };

  constructor(initial: readonly Claim[]) {
    initial.forEach((claim) => {
      this.add(claim);
    });
  }

  add({ verb, path }: Claim): void {
    this.#prefixes[verb].add(path);
  }

  covers({ verb, path }: Claim): boolean {
    return [...this.#prefixes[verb]].some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }
}
