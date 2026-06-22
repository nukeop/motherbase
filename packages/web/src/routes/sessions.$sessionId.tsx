import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$sessionId")({
  component: SessionView,
});

function SessionView() {
  const { sessionId } = Route.useParams();
  return <div className="p-4 font-nav text-xs uppercase tracking-widest text-cream/40">{sessionId}</div>;
}
