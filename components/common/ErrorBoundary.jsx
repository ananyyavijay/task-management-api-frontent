"use client";

import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/40 p-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              This section couldn&apos;t be displayed
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {this.props.message ||
                "Something went wrong while rendering this content."}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={this.handleReset}>
            <RotateCcw />
            Retry
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
