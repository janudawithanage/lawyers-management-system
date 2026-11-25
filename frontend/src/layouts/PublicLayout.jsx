/**
 * PublicLayout — Wrapper for unauthenticated pages.
 *
 * Renders a skip link + Navbar + content + Footer.
 * Used for Landing, Login, Register, and public pages.
 */

import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "@components/layout";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 overflow-x-hidden">
      {/*
        Skip link. The landing page puts a logo, five nav links, a language
        menu and two buttons ahead of the content; without this a keyboard or
        switch user tabs through all of them on every single page load. Hidden
        until focused, then pinned over the navbar.
      */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[110] focus:px-5 focus:py-3 focus:rounded-xl focus:gradient-gold-btn focus:text-dark-950 focus:font-semibold focus:text-sm focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold-200"
      >
        Skip to main content
      </a>

      <Navbar />
      {/* tabIndex -1 so the skip link can move focus here, not just scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
