"use client";

import { useState } from "react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import PageHeader from "@/components/PageHeader";
import { projects } from "@/lib/projects";
import { useTranslations } from "next-intl";

const categories = ["all", "web", "systems", "ai"];

export default function WorkContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const t = useTranslations("Projects");

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(selectedCategory)
        );

  return (
    <>
      <PageHeader title={t("title")} />

      {/* Inline category filters */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 pb-10 text-size-medium font-sans">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`transition-colors font-normal cursor-pointer ${
              selectedCategory === cat
                ? "text-zinc-900 dark:text-zinc-100 font-normal"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-300"
            }`}
          >
            {t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Symmetric 2-Column Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 w-full mb-32">
        {filteredProjects.map((project) => {
          const title = t(`${project.slug}.title`);
          const category = t(`${project.slug}.category`);

          return (
            <TransitionLink
              key={project.slug}
              href={`/work/${project.slug}`}
              data-cursor="project"
              className="group flex flex-col gap-4 w-full md:cursor-none"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${title} - ${category}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-zinc-900 dark:text-zinc-100 font-normal tracking-tight text-size-medium">
                  {title.toLowerCase()}
                </h3>
                <p className="text-zinc-500 text-size-small font-sans">
                  {category.toLowerCase()}
                </p>
              </div>
            </TransitionLink>
          );
        })}
      </div>
    </>
  );
}
