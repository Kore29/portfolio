"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useTransition, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const locales = [
  { code: "en", label: "EN", name: "English" },
  { code: "es", label: "ES", name: "Español" },
  { code: "ca", label: "CA", name: "Català" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (locale: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  const current = locales.find((l) => l.code === currentLocale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        className={`flex items-center gap-1 hover:text-zinc-400 transition-colors uppercase font-sans text-size-small tracking-wider cursor-pointer focus:outline-none ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
        aria-label="Select language"
      >
        {current?.label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xl overflow-hidden z-50 min-w-[110px]">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => switchLocale(locale.code)}
              className={`w-full text-left px-3 py-2 text-size-small font-sans tracking-wider flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                locale.code === currentLocale
                  ? "text-zinc-900 bg-zinc-100 dark:text-white dark:bg-zinc-800/60"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/40"
              }`}
            >
              <span className="uppercase">{locale.label}</span>
              <span className="normal-case text-zinc-400 dark:text-zinc-500 text-xs">{locale.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
