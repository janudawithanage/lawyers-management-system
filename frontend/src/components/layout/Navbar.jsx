import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { NAV_LINKS, LANGUAGES } from "../../constants";
import { Button, Container } from "../ui";
import { useScrolled, useScrollLock } from "../../hooks";
import Logo from "../common/Logo";

export default function Navbar() {
  const isScrolled = useScrolled(20);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("en");
  const [showLangMenu, setShowLangMenu] = useState(false);

  useScrollLock(isMobileOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-gold-400 hover:bg-white/4 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side — desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                onBlur={() => setTimeout(() => setShowLangMenu(false), 150)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-white/4 transition-colors cursor-pointer"
                aria-label="Select language"
                aria-expanded={showLangMenu}
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang?.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showLangMenu ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 bg-dark-700 backdrop-blur-xl rounded-xl shadow-xl shadow-black/40 border border-white/8 overflow-hidden"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setActiveLang(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          activeLang === lang.code
                            ? "bg-gold-500/10 text-gold-400 font-medium"
                            : "text-neutral-400 hover:bg-white/4 hover:text-neutral-200"
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
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-neutral-100 hover:bg-white/6 transition-colors cursor-pointer"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
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
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-dark-900 border-l border-white/6 shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-white/6 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-1 mb-8" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="block px-4 py-3 rounded-xl text-neutral-300 font-medium hover:bg-gold-500/10 hover:text-gold-400 transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mb-8">
                <p className="px-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                  Language
                </p>
                <div className="flex gap-2 px-4">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeLang === lang.code
                          ? "gradient-gold-btn text-dark-950"
                          : "bg-white/4 text-neutral-400 border border-white/6 hover:bg-white/8"
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
