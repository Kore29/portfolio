export default function JsonLd() {
  const baseUrl = "https://portfolio.kore29.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        "name": "Martí Castaño",
        "jobTitle": "Full-Stack Developer & AI Engineer",
        "description": "Full-stack and mobile app developer based in Barcelona specializing in Next.js, React Native, TypeScript, and AI solutions.",
        "url": baseUrl,
        "image": `${baseUrl}/me/_DSC0396.webp`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Barcelona",
          "addressRegion": "Catalonia",
          "addressCountry": "ES"
        },
        "sameAs": [
          "https://github.com/Kore29",
          "https://www.linkedin.com/in/marti-casta%C3%B1o-rodriguez-77a54a341/",
          "https://www.coursera.org/user/09b51cfaa8a857c4beb926d027c32d85"
        ],
        "knowsAbout": [
          "Full-Stack Web Development",
          "Mobile App Development",
          "React Native",
          "Next.js",
          "React",
          "TypeScript",
          "Artificial Intelligence",
          "LLMs",
          "Automation Systems",
          "PostgreSQL",
          "Docker"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Universitat Politècnica de Catalunya"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Martí Castaño — Fullstack & AI Portfolio",
        "description": "Portfolio of Martí Castaño, full-stack web and mobile developer based in Barcelona.",
        "publisher": {
          "@id": `${baseUrl}/#person`
        },
        "inLanguage": ["es", "en", "ca"]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
