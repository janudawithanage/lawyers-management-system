import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { NAV_LINKS, LANGUAGES } from "../../constants";
import { Button, Container } from "../ui";
import { useScrolled, useScrollLock, useActiveSection } from "../../hooks";
import Logo from "../common/Logo";

export default function Navbar() {
  const isScrolled = useScrolled(20);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef(null);
  const hamburgerRef = useRef(null);

  useScrollLock(isMobileOpen);

  // Highlight the nav link for the section being read. On a page this long,
  // every link looking equally inactive leaves people with no sense of
  // position. Only in-page anchors participate.
  const sectionIds = useMemo(
    () =>
      NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1)),
    []
  );
  const activeSection = useActiveSection(sectionIds, 120);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Escape closes whichever overlay is open, and focus returns to the control
  // that opened it — otherwise closing the mobile panel drops the keyboard
  // user back at the top of the document.
  useEffect(() => {
    if (!showLangMenu && !isMobileOpen) return;
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (showLangMenu) setShowLangMenu(false);
      if (isMobileOpen) {
        setIsMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showLangMenu, isMobileOpen]);

  // Dismiss the language menu on an outside press. This replaces an onBlur +
  // setTimeout(150ms) race, which either closed the menu before the click
  // landed or left it open when focus moved by other means.
  useEffect(() => {
    if (!showLangMenu) return;
    const onPointerDown = (e) => {
      if (!langRef.current?.contains(e.target)) setShowLangMenu(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showLangMenu]);

  const currentLang = LANGUAGES.find((l) => l.code === activeLang);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-dark-950/85 backdrop-blur-2xl border-b border-white/5 py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
      role="banner"
    >
      <Container>
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Logo />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href.startsWith("#") && link.href.slice(1) === activeSection;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 ${
                    isActive
                      ? "text-gold-300"
                      : "text-neutral-300 hover:text-gold-300 hover:bg-white/6"
                  }`}
                >
                  {link.label}
                  {/* Underline rather than colour alone — colour on its own is
                      not a sufficient state indicator (WCAG 1.4.1). */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-4 right-4 -bottom-0.5 h-px rounded-full bg-gold-400 transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Right side — desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setShowLangMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-neutral-100 hover:bg-white/6 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                aria-label={`Language: ${currentLang?.label}. Change language`}
                aria-expanded={showLangMenu}
                aria-haspopup="menu"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span>{currentLang?.label}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showLangMenu ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    aria-label="Select language"
                    className="absolute right-0 mt-2 w-36 bg-dark-700 backdrop-blur-xl rounded-xl shadow-xl shadow-black/40 border border-white/10 overflow-hidden"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={activeLang === lang.code}
                        onClick={() => {
                          setActiveLang(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer outline-none focus-visible:bg-white/10 ${
                          activeLang === lang.code
                            ? "bg-gold-500/10 text-gold-300 font-medium"
                            : "text-neutral-300 hover:bg-white/6 hover:text-neutral-100"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="ghost" size="sm" href="/login">
              Login
            </Button>
            <Button variant="primary" size="sm" href="/register">
              Register
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            type="button"
            /* 44×44 minimum touch target (WCAG 2.5.5); p-2 on a 24px icon
               gave 40px. */
            className="lg:hidden p-2.5 -mr-1 rounded-lg text-neutral-200 hover:text-neutral-50 hover:bg-white/6 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-panel"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile panel */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-dark-900 border-l border-white/8 shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-end mb-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    hamburgerRef.current?.focus();
                  }}
                  className="p-2.5 rounded-lg text-neutral-300 hover:text-neutral-100 hover:bg-white/6 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70"
                  aria-label="Close menu"
                  autoFocus
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1 mb-8" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    link.href.startsWith("#") && link.href.slice(1) === activeSection;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      aria-current={isActive ? "true" : undefined}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`block px-4 py-3 rounded-xl font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 ${
                        isActive
                          ? "bg-gold-500/12 text-gold-300 border-l-2 border-gold-400"
                          : "text-neutral-200 hover:bg-gold-500/10 hover:text-gold-300"
                      }`}
                    >
                      {link.label}
                    </motion.a>
                  );
                })}
              </nav>

              <div className="mb-8">
                <p className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Language
                </p>
                <div className="flex gap-2 px-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang.code)}
                      type="button"
                      aria-pressed={activeLang === lang.code}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 ${
                        activeLang === lang.code
                          ? "gradient-gold-btn text-dark-950"
                          : "bg-white/6 text-neutral-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 px-4">
                <Button variant="secondary" size="md" className="w-full" href="/login" onClick={() => setIsMobileOpen(false)}>
                  Login
                </Button>
                <Button variant="primary" size="md" className="w-full" href="/register" onClick={() => setIsMobileOpen(false)}>
                  Register
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
