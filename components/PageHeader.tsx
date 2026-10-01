"use client";

import { useEffect, useRef, useState } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  marquee?: boolean;
}

export default function PageHeader({ title, subtitle, marquee }: PageHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const initialFontSize = `calc(100vw / ${title.length} * 1.35)`;
  const [titleStyle, setTitleStyle] = useState<{ fontSize: string; whiteSpace: "nowrap" | "normal" }>({
    fontSize: initialFontSize,
    whiteSpace: "nowrap",
  });

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const fitText = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth === 0) return;

      // Temporarily force nowrap to measure the full single-line width
      text.style.whiteSpace = "nowrap";
      const textWidth = text.scrollWidth;
      const currentFontSize = parseFloat(
        window.getComputedStyle(text).fontSize,
      );

      if (textWidth > 0 && currentFontSize > 0) {
        const targetWidth = containerWidth * 0.96;
        let newFontSize = (targetWidth / textWidth) * currentFontSize;
        let newWhiteSpace: "nowrap" | "normal" = "nowrap";

        // Enforce a professional minimum size for readability (32px = 2rem)
        const minSize = 32;
        if (!marquee && newFontSize < minSize) {
          newFontSize = minSize;
          newWhiteSpace = "normal";
        }

        setTitleStyle({
          fontSize: `${newFontSize}px`,
          whiteSpace: newWhiteSpace,
        });
      }
    };

    fitText();

    const resizeObserver = new ResizeObserver(() => {
      fitText();
    });
    resizeObserver.observe(container);

    if (document.fonts) {
      document.fonts.ready.then(fitText);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [title, marquee]);

  return (
    <div
      ref={containerRef}
      className="pt-28 pb-12 w-full overflow-hidden select-none text-center"
    >
      <h1
        ref={textRef}
        style={titleStyle}
        className={`font-nohemi font-normal leading-[0.8] tracking-tighter text-[#222222] dark:text-zinc-100 inline-block ${
          marquee ? "animate-marquee-single-l2r" : ""
        }`}
      >
        {title}
      </h1>

      {subtitle && (
        <p className="mt-6 text-size-medium text-zinc-600 dark:text-zinc-400 font-sans tracking-wide text-left md:text-right max-w-full md:max-w-[50%] ml-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
