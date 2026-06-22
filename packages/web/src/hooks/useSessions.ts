import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";

const SESSIONS_KEY = ["sessions"];

export const useSessions = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SESSIONS_KEY,
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
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });

  return {
    sessions: query.data ?? [],
    createSession: createSession.mutate,
    isLoading: query.isLoading,
  };
};
