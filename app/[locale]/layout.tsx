import type { Metadata } from "next";
import React from "react";
import "../globals.css";
import { cn } from "@/lib/utils";

import localFont from "next/font/local";
import SmoothScrollProvider from "@/context/SmoothScrollProvider";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import JsonLd from "@/components/JsonLd";

// 1. Configuración de Inter Local
const inter = localFont({
  src: [
    {
      path: "../../fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Inter-Bold.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

// 2. Configuración de Nohemi Local
const nohemi = localFont({
  src: [
    {
      path: "../../fonts/Nohemi-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Nohemi-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = "https://portfolio.kore29.com";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("title"),
      template: "%s | Martí Castaño",
    },
    description: t("description"),
    keywords: [
      "Martí Castaño",
      "Fullstack Developer Barcelona",
      "Desarrollador Full Stack Barcelona",
      "Desarrollador React Native",
      "Next.js Developer",
      "TypeScript",
      "Artificial Intelligence",
      "AI Engineer",
      "Sistemas de automatización",
      "Barcelona",
      "Software Engineer UPC",
    ],
    authors: [{ name: "Martí Castaño", url: baseUrl }],
    creator: "Martí Castaño",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        ca: `${baseUrl}/ca`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : locale === "ca" ? "ca_ES" : "en_US",
      url: `${baseUrl}/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: "Martí Castaño — Fullstack Developer & AI",
      images: [
        {
          url: "/me/_DSC0396.webp",
          width: 800,
          height: 1000,
          alt: "Martí Castaño - Full-Stack Developer & AI Engineer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/me/_DSC0396.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico" },
        { url: "/icon.png", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
    },
  };
}

// Generar rutas estáticas para compilación
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Activa la renderización estática en el servidor para el locale actual
  setRequestLocale(locale);

  // Obtener mensajes de traducción
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "font-sans scroll-smooth overscroll-none bg-[#f5f5f5] text-[#222222] dark:bg-[#1a1a1a] dark:text-white transition-colors duration-300",
        inter.variable,
        nohemi.variable,
      )}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f5f5f5] text-[#222222] dark:bg-[#1a1a1a] dark:text-white transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SmoothScrollProvider>
              <CustomCursor />
              <PageTransition />
              <Navbar />
              <div className="mx-auto w-full max-w-480 px-4 md:px-8 lg:px-12 flex-1">
                {children}
              </div>
            </SmoothScrollProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
