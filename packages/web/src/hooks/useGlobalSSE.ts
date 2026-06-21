import { BASE_URL } from "../api/client";
import { useConnectionStatus } from "./useConnectionStatus";

export const useGlobalSSE = () => {
  const status = useConnectionStatus(`${BASE_URL}/events`, 15_000);

  return { status };
};
