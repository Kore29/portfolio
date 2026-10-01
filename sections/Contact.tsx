"use client";

import TransitionLink from "../components/TransitionLink";
import { useTranslations } from "next-intl";

interface ContactProps {
  hideCtaBanner?: boolean;
}

export default function Contact({ hideCtaBanner = false }: ContactProps) {
  const t = useTranslations("Contact");
  const tNavbar = useTranslations("Navbar");

  return (
    <section id="contact" className="pt-0 pb-32 w-full relative">
      {/* Clickable Visual CTA Banner */}
      {!hideCtaBanner && (
        <TransitionLink
          href="/contact"
          data-cursor="send message"
          className="block cursor-pointer select-none relative w-full py-8 md:py-16 mb-16 md:cursor-none"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full mx-auto gap-8 lg:gap-12">
            {/* Left Side: GET IN */}
            <div className="leading-none">
              <h2 className="text-[12vw] sm:text-[10vw] lg:text-[7.5vw] xl:text-[8vw] font-nohemi tracking-tighter dark:text-zinc-100 whitespace-nowrap select-none text-center lg:text-left">
                {t("getIn")}
              </h2>
            </div>

            {/* Center: Video Animation */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] overflow-hidden flex-shrink-0 relative">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/contact-animation.webm" type="video/webm" />
                <source src="/contact-animation.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Right Side: TOUCH */}
            <div className="leading-none">
              <h2 className="text-[12vw] sm:text-[10vw] lg:text-[7.5vw] xl:text-[8vw] font-nohemi tracking-tighter dark:text-zinc-100 whitespace-nowrap select-none text-center lg:text-right">
                {t("touch")}
              </h2>
            </div>
          </div>
        </TransitionLink>
      )}

      {/* Footer Info Column */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-16 border-t border-zinc-800 font-sans">
        {/* Info Column */}
        <div className="flex flex-col gap-2 text-size-small max-w-full">
          <span className="text-zinc-500 mb-2 opacity-0 pointer-events-none select-none" aria-hidden="true">
            info
          </span>
          <p className="text-zinc-400 break-all">
            {t("email")}: marticastanorodriguez@gmail.com
          </p>
          <p className="text-zinc-400">{t("basedIn")}</p>
          <p className="text-zinc-400">{t("availableFor")}</p>
        </div>

        {/* Links Group */}
        <div className="flex gap-12 sm:gap-20 md:gap-32 text-size-small">
          {/* Pages Column */}
          <div className="flex flex-col gap-2">
            <span className="text-zinc-500 mb-2">{t("pages")}</span>
            <TransitionLink
              href="/"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              {t("home")}
            </TransitionLink>
            <TransitionLink
              href="/about"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              {tNavbar("about")}
            </TransitionLink>
            <TransitionLink
              href="/work"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              {tNavbar("work")}
            </TransitionLink>
          </div>

          {/* Socials Column */}
          <div className="flex flex-col gap-2">
            <span className="text-zinc-500 mb-2">{t("socials")}</span>
            <a
              href="https://github.com/Kore29"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              github
            </a>
            <a
              href="https://www.coursera.org/user/09b51cfaa8a857c4beb926d027c32d85"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              coursera
            </a>
            <a
              href="https://www.linkedin.com/in/marti-casta%C3%B1o-rodriguez-77a54a341/"
              target="_blank"
              rel="noopener noreferrer"
              className="dark:text-zinc-100 hover:text-zinc-400 transition-colors"
            >
              linkedin
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
