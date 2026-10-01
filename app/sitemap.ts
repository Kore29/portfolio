import { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://portfolio.kore29.com";
  const locales = routing.locales;
  const staticPages = ["", "/about", "/work", "/contact"];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  staticPages.forEach((page) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "monthly" : "monthly",
        priority: page === "" ? 1.0 : page === "/work" ? 0.9 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}${page}`])
          ),
        },
      });
    });
  });

  // Dynamic project pages
  projects.forEach((project) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}/work/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/work/${project.slug}`])
          ),
        },
      });
    });
  });

  return entries;
}
