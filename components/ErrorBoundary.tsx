"use client";

import React from "react";

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem("wallmydevice:lastState");
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === "development";
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-zinc-400 mb-6 max-w-md text-center">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          {isDev && this.state.error?.stack && (
            <pre className="mb-6 max-w-2xl overflow-auto rounded bg-zinc-900 p-4 text-xs text-red-400">
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Reset editor
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
