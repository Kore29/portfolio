import type { Metadata } from "next";
import Contact from "@/sections/Contact";
import WorkContent from "@/components/WorkContent";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("workTitle"),
    description: t("workDesc"),
    alternates: {
      canonical: `https://portfolio.kore29.com/${locale}/work`,
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <WorkContent />
      <Contact />
    </main>
  );
}
