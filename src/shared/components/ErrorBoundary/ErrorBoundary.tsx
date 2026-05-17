import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorModal } from "../ErrorModal/ErrorModal";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching WebGL and 3D rendering errors.
 * Prevents crashes from propagating to the entire application.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const componentName = this.props.componentName || "Unknown";
    console.error(
      `WebGLErrorBoundary: Error in ${componentName}:`,
      error,
      errorInfo
    );
  }

  private handleDismiss = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const rawMessage = this.state.error
        ? `${this.state.error.message}\n\n${this.state.error.stack ?? ""}`
        : "An unknown error occurred";

      return <ErrorModal message={rawMessage} onClose={this.handleDismiss} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
