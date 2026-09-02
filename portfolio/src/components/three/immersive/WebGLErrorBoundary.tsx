"use client";

import React, { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGLErrorBoundary caught an error during 3D rendering:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#020203] via-[#08080d] to-[#020203] opacity-80"
            aria-hidden="true"
          />
        )
      );
    }
    return this.props.children;
  }
}
