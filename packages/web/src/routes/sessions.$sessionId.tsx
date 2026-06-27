import { createFileRoute } from "@tanstack/react-router";
import { SessionView } from "../components/SessionView";

export const Route = createFileRoute("/sessions/$sessionId")({
  component: () => {
    const { sessionId } = Route.useParams();
    return <SessionView sessionId={sessionId} />;
  },
});
