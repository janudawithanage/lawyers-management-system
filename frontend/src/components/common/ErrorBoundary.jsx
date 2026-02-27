/**
 * ErrorBoundary — Catches React rendering errors gracefully.
 *
 * Prevents full-page crashes and shows a dignified fallback
 * that matches the BASL dark theme aesthetic.
 */

import { Component } from "react";
import { Scale } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Future: Send to error tracking service (Sentry, LogRocket, etc.)
    console.error("[SL-LMS Error Boundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-6">
              <Scale className="w-8 h-8 text-gold-400" />
            </div>
            <h2 className="text-xl font-serif font-bold text-neutral-100 mb-3">
              Something went wrong
            </h2>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
              We apologize for the inconvenience. Please try refreshing the page
              or contact our support team if the issue persists.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold-btn text-dark-950 font-semibold text-sm shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 hover:brightness-110 transition-all duration-300 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
