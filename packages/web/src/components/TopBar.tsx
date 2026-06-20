import { ConnectionIndicator } from "@motherbase/ui";
import { useGlobalSSE } from "../hooks/useGlobalSSE";

export const TopBar = () => {
  const { status } = useGlobalSSE();

  return (
    <div className="flex items-center gap-2">
      <ConnectionIndicator status={status} />
      <span className="font-bold tracking-wide text-ink/80">MOTHERBASE</span>
    </div>
  );
};
