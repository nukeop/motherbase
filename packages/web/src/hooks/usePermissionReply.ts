import type { PermissionReplied } from "@motherbase/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client, unwrap } from "../api/client";
import { sessionKey } from "./query-keys";

export const usePermissionReply = (sessionId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: replyToPermission } = useMutation({
    mutationFn: async ({ requestId, reply }: PermissionReplied) => {
      const response = await client.sessions[":id"].permissions[
        ":requestId"
      ].$post({
        param: { id: sessionId, requestId },
        json: reply,
      });
      await unwrap(response);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionKey(sessionId) });
    },
  });

  return replyToPermission;
};
