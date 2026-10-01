"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import gsap from "gsap";

export default function PageTransition() {
  const pathname = usePathname();
  const lenis = useLenis();
  const curtainRef = useRef<HTMLDivElement | null>(null);

  // 1. Create the curtain dynamically on mount to isolate it from React's virtual DOM tree
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if it already exists to prevent duplicate mounts in dev mode
    let curtain = document.getElementById("transition-curtain") as HTMLDivElement;
    if (!curtain) {
      console.log("PageTransition: Creating transition curtain DOM element");
      curtain = document.createElement("div");
      curtain.id = "transition-curtain";
      curtain.className = "fixed inset-x-0 bottom-0 h-screen w-screen bg-[#f5f5f5] dark:bg-[#1a1a1a] z-[9999] pointer-events-none";
      document.body.appendChild(curtain);
      gsap.set(curtain, { yPercent: 100, y: 0 });
    } else {
      console.log("PageTransition: Curtain already exists in DOM");
    }

    curtainRef.current = curtain;

    return () => {
      // Clean up curtain on unmount
      if (curtain && curtain.parentNode) {
        console.log("PageTransition: Cleaning up transition curtain");
        curtain.parentNode.removeChild(curtain);
      }
    };
  }, []);

  // 2. Entry transition (Curtain opening) triggered on route/pathname updates
  useEffect(() => {
    console.log("PageTransition: Pathname updated to", pathname);
    const curtain = curtainRef.current || document.getElementById("transition-curtain");
    console.log("PageTransition: Curtain found for entry animation:", curtain);
    if (!curtain) return;

    // Reset scroll offset immediately while page is fully covered
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });

    // Wait a frame and add a micro-delay to let Next.js fully mount and paint the new page tree
    console.log("PageTransition: Triggering curtain open entry animation");
    requestAnimationFrame(() => {
      gsap.killTweensOf(curtain);
      gsap.fromTo(
        curtain,
        { yPercent: 0, y: 0 },
        {
          yPercent: -100,
          y: 0,
          duration: 0.6,
          delay: 0.1, // Gives Next.js sufficient time to complete mounting the new page
          ease: "power3.inOut",
          onComplete: () => {
            console.log("PageTransition: Entry animation complete, resetting curtain to yPercent 100");
            // Reset curtain back below the viewport off-screen for the next transition
            gsap.set(curtain, { yPercent: 100, y: 0 });
            curtain.style.backgroundColor = "";
            // Resume scrolling momentum
            lenis?.start();
          },
        }
      );
    });
  }, [pathname, lenis]);

  return null; // Keep React tree completely empty of this element
}
