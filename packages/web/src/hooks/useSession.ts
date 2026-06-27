import type { MessagePart } from "@motherbase/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BASE_URL, client } from "../api/client";

const sessionKey = (sessionId: string) => ["session", sessionId];

const deltaToPartType = {
  "text-delta": "text",
  "reasoning-delta": "reasoning",
} as const;

type DeltaType = keyof typeof deltaToPartType;

const appendDelta = (
  parts: MessagePart[],
  deltaType: DeltaType,
  text: string,
): MessagePart[] => {
  const type = deltaToPartType[deltaType];
  const last = parts.at(-1);

  if (last?.type === type) {
    return [...parts.slice(0, -1), { type, text: last.text + text }];
  }

  return [...parts, { type, text }];
};

export const useSession = (sessionId: string) => {
  const queryClient = useQueryClient();
  const [streamingParts, setStreamingParts] = useState<MessagePart[] | null>(
    null,
  );

  const { data } = useQuery({
    queryKey: sessionKey(sessionId),
    queryFn: async () => {
      const response = await client.sessions[":id"].$get({
        param: { id: sessionId },
      });
      return response.json();
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

    const handleDelta = (deltaType: DeltaType) => (event: MessageEvent) => {
      const { text } = JSON.parse(event.data);
      setStreamingParts((prev) => appendDelta(prev ?? [], deltaType, text));
    };

    source.addEventListener("text-delta", handleDelta("text-delta"));
    source.addEventListener("reasoning-delta", handleDelta("reasoning-delta"));

    source.addEventListener("turn-completed", () => {
      setStreamingParts(null);
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    });

    return () => {
      source.close();
    };
  }, [sessionId, queryClient]);

  return {
    messages: data?.messages ?? [],
    streamingParts,
    sendMessage,
  };
};
