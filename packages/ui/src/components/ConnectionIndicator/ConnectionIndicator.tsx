import { cn } from "../../utils";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export const ConnectionIndicator = ({
  status,
}: { status: ConnectionStatus }) => (
  <div
    className={cn("size-2 rounded-full", {
      "bg-green shadow-[0_0_6px_var(--color-green)]":
        status === "connected",
      "bg-orange animate-pulse": status === "connecting",
      "bg-red": status === "disconnected",
    })}
  />
);
