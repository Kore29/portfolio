"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

// Registramos el plugin para que GSAP pueda leer el scroll del navegador
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef<HTMLElement>(null);
  const t = useTranslations("About");

  const phrase = t("phrase");

  useGSAP(
    () => {
      // 1. Text progressive scroll reveal
      gsap.to(".word", {
        color: "#f4f4f5",
        opacity: 1,
        stagger: 0.05,
        duration: 0.3,
        ease: "power1.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 85%",
          end: "center center",
          scrub: 1,
        },
      });
    },
    { scope: container }
  );

  return (
    <section id="about" className="flex flex-col" ref={container}>
      {/* Main animated heading */}
      <h2
        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-normal leading-tight tracking-tight"
      >
        {phrase.split(" ").map((word, index) => (
          <span key={index} className="word text-zinc-700 opacity-30">
            {word}{" "}
          </span>
        ))}
      </h2>

      {/* 2-Column Bottom Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mt-20 items-start">
        {/* Column 1: Cover Photo */}
        <div className="relative w-full aspect-square max-w-lg overflow-hidden rounded-lg border border-zinc-900 shadow-2xl">
          <Image
            src="/me/_DSC0386.jpg"
            alt="Martí Castaño"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="about-photo object-cover object-top"
          />
        </div>

        {/* Column 2: why work with me / code approach */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <span className="text-zinc-400 font-sans text-size-small">
              {t("approachTitle")}
            </span>
            <p className="text-zinc-200 font-sans mt-3 text-size-small leading-relaxed">
              {t("approachDesc")}
            </p>
          </div>
          <a
            href="/resume.pdf"
            download="Marti_Castano_Resume.pdf"
            className="w-fit px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-size-small rounded transition-colors font-sans text-center"
          >
            {t("downloadResume")}
          </a>
        </div>
      </div>
    </section>
  );
}
