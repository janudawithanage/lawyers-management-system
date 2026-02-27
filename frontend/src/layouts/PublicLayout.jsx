/**
 * PublicLayout — Wrapper for unauthenticated pages.
 *
 * Renders Navbar + content + Footer.
 * Used for Landing, Login, Register, and public pages.
 */

import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "@components/layout";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 overflow-x-hidden">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
