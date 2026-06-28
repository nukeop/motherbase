import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import { sessionsKey } from "./query-keys";

export const useSessions = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: sessionsKey,
    queryFn: async () => {
      const response = await client.sessions.$get();
      return response.json();
    },
  });

  const createSession = useMutation({
    mutationFn: async () => {
      const response = await client.sessions.$post();
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKey });
    },
  });

  return {
    sessions: query.data ?? [],
    createSession: createSession.mutate,
    isLoading: query.isLoading,
  };
};
