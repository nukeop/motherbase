import type { AgentEvent, PermissionReplied } from "@motherbase/core";

type AgentEvents = {
  [Event in AgentEvent as Event["type"]]: Omit<Event, "type">;
};

export type ServerEvents = AgentEvents & {
  "permission-replied": PermissionReplied;
};

export type EventName = keyof ServerEvents;

export type ServerEvent = {
  [Name in EventName]: { name: Name; payload: ServerEvents[Name] };
}[EventName];
