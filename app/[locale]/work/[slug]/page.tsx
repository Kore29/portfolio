import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "@/lib/projects";
import Contact from "@/sections/Contact";
import PageHeader from "@/components/PageHeader";
import { ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach((locale) => {
    projects.forEach((project) => {
      params.push({ locale, slug: project.slug });
    });
  });
  return params;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Projects" });
  const title = t(`${project.slug}.title`);
  const category = t(`${project.slug}.category`);
  const description = t(`${project.slug}.description`);
  const baseUrl = "https://portfolio.kore29.com";

  return {
    title: `${title} — ${category}`,
    description,
    keywords: [
      title,
      ...project.tags,
      "Martí Castaño",
      "Fullstack Developer",
      "Portfolio",
    ],
    alternates: {
      canonical: `${baseUrl}/${locale}/work/${slug}`,
    },
    openGraph: {
      title: `${title} | Martí Castaño`,
      description,
      url: `${baseUrl}/${locale}/work/${slug}`,
      images: [
        {
          url: project.image,
          width: 1200,
          height: 675,
          alt: `${title} - ${category}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Martí Castaño`,
      description,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const t = await getTranslations("Projects");
  const title = t(`${project.slug}.title`);
  const category = t(`${project.slug}.category`);
  const description = t(`${project.slug}.description`);
  const baseUrl = "https://portfolio.kore29.com";

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web, iOS, Android",
    "author": {
      "@type": "Person",
      "name": "Martí Castaño",
      "url": baseUrl,
    },
    "image": `${baseUrl}${project.image}`,
    "keywords": project.tags.join(", "),
    ...(project.github && { "codeRepository": project.github }),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <PageHeader title={title.toLowerCase()} marquee={true} />

      <div className="w-full relative aspect-[16/9] overflow-hidden mb-16">
        <Image
          src={project.image}
          alt={`${title} - ${category}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
        {/* Project Info Panel */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div>
            <h2 className="text-zinc-500 text-size-small uppercase tracking-wider mb-2">
              {t("detail.category")}
            </h2>
            <p className="text-zinc-900 dark:text-zinc-100 text-size-small">
              {category}
            </p>
          </div>
          <div>
            <h2 className="text-zinc-500 text-size-small uppercase tracking-wider mb-2">
              {t("detail.technologies")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-size-small rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {project.github && (
            <div>
              <h2 className="text-zinc-500 text-size-small uppercase tracking-wider mb-2">
                {t("detail.repository")}
              </h2>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors border-b border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white pb-1 text-size-small"
              >
                {t("detail.viewGithub")}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Detailed Description */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-zinc-700 dark:text-zinc-300 text-size-small font-sans">
          <h2 className="text-zinc-900 dark:text-zinc-100 font-nohemi text-size-medium tracking-tight mb-2">
            {t("detail.overview")}
          </h2>
          <p>{description}</p>
        </div>
      </div>

      <Contact />
    </main>
  );
}
