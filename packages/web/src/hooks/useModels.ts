import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";

export const useModels = (providerId: string) =>
  useQuery({
    queryKey: ["models", providerId],
    queryFn: async () => {
      const response = await client.providers[":id"].models.$get({
        param: { id: providerId },
      });
      return response.json();
    },
    enabled: Boolean(providerId),
  });
