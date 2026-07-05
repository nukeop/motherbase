import { Component, type ReactNode } from "react";

type WidgetBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type WidgetBoundaryState = {
  failed: boolean;
};

export class WidgetBoundary extends Component<
  WidgetBoundaryProps,
  WidgetBoundaryState
> {
  override state: WidgetBoundaryState = { failed: false };

  static getDerivedStateFromError(): WidgetBoundaryState {
    return { failed: true };
  }

  override render(): ReactNode {
    if (this.state.failed) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
