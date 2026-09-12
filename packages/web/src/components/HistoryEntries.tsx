import type { HistoryEntry } from "@motherbase/core";
import {
  AssistantMessage,
  ErrorMessage,
  resolveResultWidget,
  ToolResultBlock,
  UserMessage,
  WidgetBoundary,
} from "@motherbase/ui";
import type { FC, ReactNode } from "react";
import { PermissionEntry } from "./PermissionEntry";

type HistoryEntriesProps = {
  sessionId: string;
  entries: HistoryEntry[];
};

export const HistoryEntries: FC<HistoryEntriesProps> = ({
  sessionId,
  entries,
}) => {
  const render = (entry: HistoryEntry, index: number): ReactNode => {
    switch (entry.kind) {
      case "error":
        return <ErrorMessage key={`error-${index}`} message={entry.message} />;
      case "tool-result": {
        const ResultWidget = resolveResultWidget(entry.toolName);
        return (
          <WidgetBoundary
            key={`tool-result-${index}`}
            fallback={
              <ToolResultBlock
                toolName={entry.toolName}
                outcome={entry.outcome}
                output={entry.output}
              />
            }
          >
            <ResultWidget
              toolName={entry.toolName}
              outcome={entry.outcome}
              output={entry.output}
            />
          </WidgetBoundary>
        );
      }
      case "permission-request":
        return (
          <PermissionEntry
            key={entry.request.id}
            sessionId={sessionId}
            request={entry.request}
            entries={entries}
          />
        );
      case "permission-reply":
        return null;
      case "message": {
        const key = `${entry.role}-${index}`;
        if (entry.role === "user") {
          return <UserMessage key={key} parts={entry.parts} />;
        }
        return <AssistantMessage key={key} parts={entry.parts} />;
      }
    }
  };

  return <>{entries.map(render)}</>;
};
