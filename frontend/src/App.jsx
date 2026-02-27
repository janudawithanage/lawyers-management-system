/**
 * SL-LMS — Root Application Component
 *
 * Wraps the entire app with:
 *  1. ThemeProvider (dark/light mode)
 *  2. AuthProvider (authentication state)
 *  3. ErrorBoundary (graceful error handling)
 *  4. RouterProvider (react-router-dom)
 */

import { ThemeProvider, AuthProvider } from "./context";
import { ErrorBoundary } from "./components/common";
import AppRouter from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
