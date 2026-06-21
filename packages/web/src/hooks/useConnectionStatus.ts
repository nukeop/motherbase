import type { ConnectionStatus } from "@motherbase/ui";
import { useEffect, useRef, useState } from "react";

export const useConnectionStatus = (
  url: string,
  heartbeatTimeoutMs: number,
) => {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const source = new EventSource(url);

    const resetTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setStatus("disconnected");
      }, heartbeatTimeoutMs);
    };

    const onConnected = () => {
      setStatus("connected");
      resetTimeout();
    };

    const onHeartbeat = () => {
      setStatus("connected");
      resetTimeout();
    };

    const onError = () => {
      setStatus("disconnected");
      clearTimeout(timeoutRef.current);
    };

    source.addEventListener("connected", onConnected);
    source.addEventListener("heartbeat", onHeartbeat);
    source.addEventListener("error", onError);

    return () => {
      clearTimeout(timeoutRef.current);
      source.close();
    };
  }, [url, heartbeatTimeoutMs]);

  return status;
};
