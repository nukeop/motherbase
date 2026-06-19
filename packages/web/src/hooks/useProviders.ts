import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";

export const useProviders = () =>
  useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const response = await client.providers.$get();
      return response.json();
    },
  });
