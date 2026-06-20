import { useEffect, useState } from "react";
import { BASE_URL } from "../api/client";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function useGlobalSSE() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const source = new EventSource(`${BASE_URL}/events`);

    source.onopen = () => {
      setStatus("connected");
    };

    source.onerror = () => {
      setStatus("disconnected");
    };

    source.addEventListener("connected", () => {
      setStatus("connected");
    });

    return () => {
      source.close();
    };
  }, []);

  return { status };
}
