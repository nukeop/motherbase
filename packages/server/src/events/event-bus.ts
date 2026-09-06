import type { EventName, ServerEvent, ServerEvents } from "./server-events";

type Handler<Name extends EventName> = (payload: ServerEvents[Name]) => void;
type WildcardHandler = (event: ServerEvent) => void;

type Listeners = {
  named: Map<EventName, Set<Handler<EventName>>>;
  wildcard: Set<WildcardHandler>;
};

export class EventBus {
  readonly #sessions = new Map<string, Listeners>();

  emit<Name extends EventName>(
    sessionId: string,
    name: Name,
    payload: ServerEvents[Name],
  ): void {
    const listeners = this.#sessions.get(sessionId);
    if (!listeners) {
      return;
    }
    for (const handler of listeners.named.get(name) ?? []) {
      handler(payload);
    }
    for (const handler of listeners.wildcard) {
      handler({ name, payload } as ServerEvent);
    }
  }

  on(sessionId: string, name: "*", handler: WildcardHandler): () => void;
  on<Name extends EventName>(
    sessionId: string,
    name: Name,
    handler: Handler<Name>,
  ): () => void;
  on(
    sessionId: string,
    name: EventName | "*",
    handler: Handler<EventName> | WildcardHandler,
  ): () => void {
    const listeners = this.listenersFor(sessionId);
    if (name === "*") {
      const wildcard = handler as WildcardHandler;
      listeners.wildcard.add(wildcard);
      return () => {
        listeners.wildcard.delete(wildcard);
      };
    }
    const named = handler as Handler<EventName>;
    const handlers = listeners.named.get(name) ?? new Set<Handler<EventName>>();
    handlers.add(named);
    listeners.named.set(name, handlers);
    return () => {
      handlers.delete(named);
    };
  }

  private listenersFor(sessionId: string): Listeners {
    const existing = this.#sessions.get(sessionId);
    if (existing) {
      return existing;
    }
    const created: Listeners = { named: new Map(), wildcard: new Set() };
    this.#sessions.set(sessionId, created);
    return created;
  }
}
