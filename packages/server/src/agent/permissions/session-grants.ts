import type { Claim, Verb } from "@motherbase/core";

export class SessionGrants {
  readonly #prefixes: Record<Verb, Set<string>> = {
    read: new Set(),
    write: new Set(),
  };

  add({ verb, path }: Claim): void {
    this.#prefixes[verb].add(path);
  }

  covers({ verb, path }: Claim): boolean {
    return [...this.#prefixes[verb]].some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`),
    );
  }
}
