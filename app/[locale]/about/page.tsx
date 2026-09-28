import Image from "next/image";
import Contact from "@/sections/Contact";
import PageHeader from "@/components/PageHeader";
import { experiences } from "@/lib/experience";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");
  const tExp = await getTranslations("Experience");

  return (
    <main className="min-h-screen">
      <PageHeader title={t("title")} />

      {/* Profile Bio Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8 mb-24">
        {/* Left: Bio text */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-zinc-300 text-size-small font-sans">
          <p>{t("phrase")}</p>
          <p>{t("approachDesc")}</p>
          <a
            href="/resume.pdf"
            download="Marti_Castano_Resume.pdf"
            className="w-fit px-6 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-size-small font-normal rounded transition-colors font-sans mt-2"
          >
            {t("downloadResume")}
          </a>
        </div>
        {/* Right: Portrait Image */}
        <div className="lg:col-span-5 relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800 shadow-2xl">
          <Image
            src="/me/_DSC0396.jpg"
            alt="Martí Castaño"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 400px"
            className="object-cover object-top transition-all duration-700"
          />
        </div>
      </div>

      {/* Experience Timeline Section */}
      <section className="mb-32">
        <h2 className="font-nohemi text-4xl md:text-5xl lg:text-6xl font-normal leading-[0.8] tracking-tight text-zinc-100 mb-12">
          {tExp("title")}
        </h2>
        <div className="flex flex-col border-t border-zinc-800">
          {experiences.map((exp, index) => {
            const company = tExp(`${exp.id}.company`);
            const role = tExp(`${exp.id}.role`);
            const period = tExp(`${exp.id}.period`);
            const description = tExp(`${exp.id}.description`);

            return (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-b border-zinc-800 font-sans items-start"
              >
                {/* Left Column: Organization & Role */}
                <div className="md:col-span-4 flex flex-col gap-1">
                  <h3 className="text-zinc-100 font-normal text-size-medium">
                    {company.toLowerCase()}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-size-small">
                    <span className="text-zinc-500">{role.toLowerCase()}</span>
                    <span className="text-zinc-700 md:hidden">•</span>
                    <span className="text-zinc-400 md:hidden">{period.toLowerCase()}</span>
                  </div>
                </div>
                {/* Center Column: Description */}
                <div className="md:col-span-5 text-zinc-300 text-size-small">
                  <p>{description}</p>
                  {exp.learnMoreUrl && (
                    <a
                      href={exp.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-zinc-400 hover:text-white transition-colors border-b border-zinc-700 hover:border-white text-size-small"
                    >
                      {tExp("learnMore")}
                    </a>
                  )}
                </div>
                {/* Right Column: Period */}
                <div className="hidden md:block md:col-span-3 md:text-right text-zinc-100 font-normal text-size-small pt-1">
                  {period.toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Contact />
    </main>
  );
}
