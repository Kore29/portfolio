"use client";

import { useState, useEffect } from "react";
import TransitionLink from "./TransitionLink";
import ThemeSwitch from "./ThemeSwitch";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function Navbar() {
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  // Auto-close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Auto-close menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-close menu on window scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      setIsOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const handleContactClick = () => {
    closeMenu();
    // Wait a brief moment for the drawer to close before scrolling
    setTimeout(() => {
      lenis?.scrollTo("#contact");
    }, 300);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference pointer-events-none">
        <nav className="mx-auto w-full max-w-480 flex items-center justify-between py-4 px-4 md:px-8 lg:px-12 text-size-small text-white pointer-events-auto">
          {/* Logo */}
          <TransitionLink
            href="/"
            onClick={closeMenu}
            className="hover:text-zinc-400 transition-colors z-50 pointer-events-auto"
          >
            martí castaño
          </TransitionLink>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <ThemeSwitch />
            <TransitionLink href="/work" className="hover:text-zinc-400 transition-colors">
              {t("work")}
            </TransitionLink>
            <TransitionLink href="/about" className="hover:text-zinc-400 transition-colors">
              {t("about")}
            </TransitionLink>
            <button
              onClick={() => lenis?.scrollTo("#contact")}
              className="hover:text-zinc-400 transition-colors cursor-pointer"
            >
              {t("startProject")}
            </button>

          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center gap-4 z-50 pointer-events-auto">
            <ThemeSwitch />
            <button
              onClick={toggleMenu}
              className="text-white hover:text-zinc-400 transition-colors cursor-pointer focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Partial Dropdown Mobile Menu (Top Slide Down) */}
      <div
        className={`fixed top-0 left-0 right-0 bg-[#f5f5f5]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-900/80 shadow-2xl z-40 md:hidden flex flex-col pt-20 pb-8 px-6 transition-all duration-500 ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 font-sans text-xl tracking-wide text-zinc-700 dark:text-zinc-300">
          <TransitionLink
            href="/work"
            onClick={closeMenu}
            className="hover:text-black dark:hover:text-white transition-colors border-b border-zinc-200/80 dark:border-zinc-800/30 pb-2"
          >
            {t("work")}
          </TransitionLink>
          <TransitionLink
            href="/about"
            onClick={closeMenu}
            className="hover:text-black dark:hover:text-white transition-colors border-b border-zinc-200/80 dark:border-zinc-800/30 pb-2"
          >
            {t("about")}
          </TransitionLink>
          <button
            onClick={handleContactClick}
            className="text-left hover:text-black dark:hover:text-white transition-colors border-b border-zinc-200/80 dark:border-zinc-800/30 pb-2 cursor-pointer"
          >
            {t("startProject")}
          </button>

        </div>
      </div>
    </>
  );
}
