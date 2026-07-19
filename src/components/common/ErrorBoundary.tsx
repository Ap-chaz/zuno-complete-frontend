import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Defaults to a compact inline error card. */
  fallback?: (retry: () => void) => ReactNode;
  /** Label used in error reports to identify which boundary caught the error. */
  boundaryName?: string;
}

interface State {
  error: Error | null;
}

/**
 * Isolates a section of the tree so one broken widget (e.g. a chart, a
 * card fed by unpredictable data) can't take down the whole screen.
 * Use around anything rendering data you don't fully control.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    reportLovableError(error, {
      boundary: this.props.boundaryName ?? "component_error_boundary",
      componentStack: info.componentStack ?? undefined,
    });
  }

  retry = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.retry);
      return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-foreground">Something went wrong here.</p>
          <button
            onClick={this.retry}
            className="mt-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
