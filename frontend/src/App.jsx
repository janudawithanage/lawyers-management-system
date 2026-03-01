/**
 * SL-LMS — Root Application Component
 *
 * Wraps the entire app with:
 *  1. ThemeProvider (dark/light mode)
 *  2. AuthProvider (authentication state)
 *  3. ErrorBoundary (graceful error handling)
 *  4. RouterProvider (react-router-dom)
 */

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, AuthProvider } from "./context";
import { ErrorBoundary } from "./components/common";
import { AppStoreProvider } from "./store/globalStore";
import AppRouter from "./routes";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppStoreProvider>
            <ErrorBoundary>
              <AppRouter />
            </ErrorBoundary>
          </AppStoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
