type WriteEvent = (event: string, data: unknown) => Promise<void>;
type Detach = () => void;

export type StreamSource = (write: WriteEvent) => Detach;
