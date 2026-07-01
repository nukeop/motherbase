import type { HistoryEntry, MessagePart } from "@motherbase/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BASE_URL, client } from "../api/client";

import { sessionKey } from "./query-keys";

// The session payload is typed by hand instead of inferred from the Hono
// client: `HistoryEntry` is recursive (tool-call input is arbitrary JSON), and
// pushing a recursive type through Hono's RPC response transform makes
// TypeScript give up with TS2589 (excessively deep instantiation).
type SessionResponse = {
  providerId: string;
  modelId: string;
  messages: HistoryEntry[];
};

export const useSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const [streamingParts, setStreamingParts] = useState<MessagePart[] | null>(
    null,
  );

  const { data, isLoading } = useQuery({
    queryKey: sessionKey(sessionId),
    queryFn: async () => {
      const response = await client.sessions[":id"].$get({
        param: { id: sessionId },
      });
      return (await response.json()) as SessionResponse;
    },
  });

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (text: string) => {
      const response = await client.sessions[":id"].messages.$post({
        param: { id: sessionId },
        json: { text },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    },
  });

  useEffect(() => {
    const source = new EventSource(`${BASE_URL}/sessions/${sessionId}/events`);

    source.addEventListener("message-in-progress", (event) => {
      const { parts } = JSON.parse(event.data);
      setStreamingParts(parts);
    });

    source.addEventListener("turn-completed", () => {
      setStreamingParts(null);
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    });

    return () => {
      source.close();
    };
  }, [sessionId, queryClient]);

  return {
    isLoading,
    session: data
      ? { providerId: data.providerId, modelId: data.modelId }
      : undefined,
    messages: data?.messages ?? [],
    streamingParts,
    sendMessage,
  };
};
