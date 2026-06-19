import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";

type ServerState = {
  provider: string;
  model: string;
};

const STATE_KEY = ["serverState"];

export const useServerState = () =>
  useQuery({
    queryKey: STATE_KEY,
    queryFn: async () => {
      const response = await client.state.$get();
      return response.json() as Promise<ServerState>;
    },
  });

export const useSetProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (provider: string) => {
      const response = await client.state.provider.$post({
        json: { provider },
      });
      return response.json() as Promise<ServerState>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(STATE_KEY, data);
    },
  });
};

export const useSetModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (model: string) => {
      const response = await client.state.model.$post({
        json: { model },
      });
      return response.json() as Promise<ServerState>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(STATE_KEY, data);
    },
  });
};
