import type {
  HistoryEntry,
  PermissionOutcome,
  PermissionReplyEntry,
  PermissionRequest,
} from "@motherbase/core";
import { ToolDecision } from "@motherbase/ui";
import type { FC } from "react";
import { PendingPermission } from "./PendingPermission";

const findOutcome = (
  entries: HistoryEntry[],
  requestId: string,
): PermissionOutcome | undefined =>
  entries.find(
    (entry): entry is PermissionReplyEntry =>
      entry.kind === "permission-reply" && entry.requestId === requestId,
  )?.outcome;

type PermissionEntryProps = {
  sessionId: string;
  request: PermissionRequest;
  entries: HistoryEntry[];
};

export const PermissionEntry: FC<PermissionEntryProps> = ({
  sessionId,
  request,
  entries,
}) => {
  const outcome = findOutcome(entries, request.id);

  return (
    <div data-testid="permission" data-request-id={request.id}>
      {outcome && (
        <ToolDecision
          toolName={request.toolName}
          path={request.claim.path}
          outcome={outcome}
        />
      )}
      {!outcome && (
        <PendingPermission sessionId={sessionId} request={request} />
      )}
    </div>
  );
};
