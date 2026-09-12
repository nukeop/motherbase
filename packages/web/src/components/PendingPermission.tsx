import type { PermissionReply, PermissionRequest } from "@motherbase/core";
import { ToolApproval } from "@motherbase/ui";
import type { FC } from "react";
import { usePermissionReply } from "../hooks/usePermissionReply";

type PendingPermissionProps = {
  sessionId: string;
  request: PermissionRequest;
};

export const PendingPermission: FC<PendingPermissionProps> = ({
  sessionId,
  request,
}) => {
  const { mutate: reply, isPending, error } = usePermissionReply(sessionId);

  const submit = (decision: PermissionReply) => {
    reply({ requestId: request.id, reply: decision });
  };

  return (
    <>
      <ToolApproval
        toolName={request.toolName}
        path={request.claim.path}
        disabled={isPending}
        onAllowOnce={() => submit({ decision: "once" })}
        onAllowAlways={(prefix) => submit({ decision: "always", prefix })}
        onDeny={() => submit({ decision: "deny" })}
      />
      {error && (
        <p role="alert" className="mt-1 font-mono text-xs text-red">
          {error.message}
        </p>
      )}
    </>
  );
};
