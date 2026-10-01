"use client";

import React from "react";
import { useRouter } from "@/i18n/routing";
import { useLenis } from "lenis/react";
import gsap from "gsap";

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log("TransitionLink: Click intercepted on", href);
    // Execute custom onClick behavior (e.g. closing the mobile menu) first
    if (onClick) {
      console.log("TransitionLink: Calling onClick prop");
      onClick(e);
    }

    // Check if the click is internal, standard, and not target="_blank" / download
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    const isDownload = e.currentTarget.hasAttribute("download");
    const isHash = href.includes("#");
    const isNewTab = e.currentTarget.getAttribute("target") === "_blank";

    // Preserve native browser special clicks (middle-click, cmd/ctrl-click)
    const isSpecialClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;

    console.log("TransitionLink: Conditions evaluation:", {
      isInternal,
      isDownload,
      isHash,
      isNewTab,
      isSpecialClick,
    });

    if (isInternal && !isDownload && !isHash && !isNewTab && !isSpecialClick) {
      e.preventDefault();

      const curtain = document.getElementById("transition-curtain");
      console.log("TransitionLink: Curtain element found:", curtain);
      
      if (!curtain) {
        console.warn("TransitionLink: Curtain not found, pushing route instantly");
        router.push(href);
        return;
      }

      // Freeze Lenis scroll momentum
      lenis?.stop();

      // Slide the curtain up to cover the viewport
      console.log("TransitionLink: Starting exit animation");
      curtain.style.backgroundColor = "";
      gsap.killTweensOf(curtain);
      gsap.fromTo(
        curtain,
        { yPercent: 100, y: 0 },
        {
          yPercent: 0,
          y: 0,
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            console.log("TransitionLink: Exit animation complete, pushing route:", href);
            // Trigger actual navigation only after curtain covers screen
            router.push(href);
          },
        }
      );
    }
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
