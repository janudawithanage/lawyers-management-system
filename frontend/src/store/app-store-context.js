/**
 * SL-LMS Global Store — context object and hook
 *
 * Kept apart from `globalStore.jsx` so that file exports nothing but the
 * provider component. Vite's fast refresh can only hot-update a module whose
 * exports are all components, and the store file is edited often.
 */

import { createContext, useContext } from "react";

export const AppStoreContext = createContext(undefined);
AppStoreContext.displayName = "AppStoreContext";

/** Hook: access global store */
export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore() must be used within <AppStoreProvider>.");
  }
  return context;
}

export default AppStoreContext;
