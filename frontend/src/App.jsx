/**
 * SL-LMS — Root Application Component
 *
 * Wraps the entire app with:
 *  1. BrowserRouter (react-router-dom — context-compatible)
 *  2. ThemeProvider (dark/light mode)
 *  3. AuthProvider (authentication state)
 *  4. ErrorBoundary (graceful error handling)
 *  5. ScrollToTop (reset scroll on navigation)
 *  6. AppRoutes (centralised route tree)
 */

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, AuthProvider } from "./context";
import { ErrorBoundary, ScrollToTop } from "./components/common";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <AppRoutes />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
