import type { Metadata } from "next";
import Contact from "@/sections/Contact";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("contactTitle"),
    description: t("contactDesc"),
    alternates: {
      canonical: `https://portfolio.kore29.com/${locale}/contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  return (
    <main className="min-h-screen">
      <PageHeader title={t("sendMessageTitle")} />

      <div className="w-full mt-8 mb-32">
        <ContactForm />
      </div>

      <Contact hideCtaBanner={true} />
    </main>
  );
}
