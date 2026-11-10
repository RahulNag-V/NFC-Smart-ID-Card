import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Ananta Sparsha caught render error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      sessionStorage.clear();
    } catch { }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#fbf8f3] text-[#2b241e] font-serif flex items-center justify-center p-4 selection:bg-[#704a29]/20">
          <div className="max-w-md w-full bg-[#fffefb] border border-[#d9cdbd] rounded-2xl p-6 sm:p-8 shadow-md text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#fbf0ef] border border-[#f5c6c2] text-[#bc473b] mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704a29]">
                ANANTA SPARSHA
              </span>
              <h2 className="text-xl font-bold text-[#2b241e]">
                {this.props.fallbackTitle || 'Display Experience Interrupted'}
              </h2>
              <p className="text-xs text-[#73685c] leading-relaxed pt-1">
                A temporary interface issue occurred while loading this view. You can reload the page or return to the main identity card.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-left">
                <span className="block text-[10px] font-mono uppercase text-[#73685c] font-bold mb-1">
                  Diagnostics:
                </span>
                <p className="text-xs font-mono text-[#bc473b] break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs text-[#2b241e] font-semibold flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset &amp; Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

