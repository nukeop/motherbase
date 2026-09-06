import { EventBus } from "./event-bus";

export const bus = new EventBus();
export type { EventName, ServerEvent, ServerEvents } from "./server-events";
