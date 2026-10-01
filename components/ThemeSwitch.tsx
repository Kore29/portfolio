"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import gsap from "gsap";

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isTransitioning = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (isTransitioning.current) return;

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const curtain = document.getElementById("transition-curtain");

    if (!curtain) {
      setTheme(nextTheme);
      return;
    }

    isTransitioning.current = true;

    // The new theme color
    const nextColor = nextTheme === "dark" ? "#1a1a1a" : "#f5f5f5";
    curtain.style.backgroundColor = nextColor;

    gsap.killTweensOf(curtain);

    // Slide the curtain up from bottom to cover the screen
    gsap.fromTo(
      curtain,
      { yPercent: 100, y: 0 },
      {
        yPercent: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          // Switch theme while the screen is covered with the new color
          setTheme(nextTheme);

          // Reveal new theme by sliding curtain up to top
          gsap.fromTo(
            curtain,
            { yPercent: 0, y: 0 },
            {
              yPercent: -100,
              y: 0,
              duration: 0.5,
              delay: 0.05,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(curtain, { yPercent: 100, y: 0 });
                curtain.style.backgroundColor = "";
                isTransitioning.current = false;
              },
            }
          );
        },
      }
    );
  };

  if (!mounted) {
    return (
      <button
        className="hover:text-zinc-400 transition-colors p-1 flex items-center justify-center opacity-0 pointer-events-none"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="hover:text-zinc-400 transition-colors cursor-pointer p-1 flex items-center justify-center focus:outline-none"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
