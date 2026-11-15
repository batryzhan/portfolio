import type { Plugin } from "vite";

/**
 * Production URL used for the canonical link, Open Graph URLs, the sitemap and structured data.
 * Set SITE_URL at build time (e.g. SITE_URL=https://example.com npm run build). On Vercel the
 * production domain is picked up automatically. Without a URL the absolute-URL tags are skipped
 * rather than pointing search engines at a wrong address.
 */
function resolveSiteUrl(): string | undefined {
  const raw = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return raw ? raw.replace(/\/+$/, "") : undefined;
}

const SAME_AS = [
  "https://github.com/batryzhan",
  "https://www.linkedin.com/in/batryzhan",
  "https://t.me/batryzhan",
  "https://instagram.com/batryzhan",
  "https://ch.tetr.io/u/batryzhan",
];

export function seo(): Plugin {
  const site = resolveSiteUrl();

  return {
    name: "portfolio-seo",

    transformIndexHtml() {
      const person: Record<string, unknown> = {
        "@type": "Person",
        name: "Batyrzhan Amanbek",
        jobTitle: "Hardware Engineer",
        description:
          "Hardware engineer at HubTech KZ and captain of robotics team Pulsar. Works on robotics, embedded systems and language models.",
        worksFor: { "@type": "Organization", name: "HubTech KZ", url: "https://hubtech.kz" },
        knowsAbout: ["Robotics", "Embedded systems", "Multi-robot coordination", "Large language models", "Electronics"],
        award: [
          "1st place, Decentrathon 6.0",
          "1st place, National Hackathon by KazAtomProm 2026",
          "Finalist, World Robot Olympiad 2026 (national stage)",
        ],
        sameAs: SAME_AS,
        ...(site ? { "@id": `${site}/#person`, url: `${site}/`, image: `${site}/og-image.png` } : {}),
      };
      const graph: Record<string, unknown>[] = [person];
      if (site) {
        graph.push({
          "@type": "WebSite",
          "@id": `${site}/#website`,
          url: `${site}/`,
          name: "Batyrzhan Amanbek",
          inLanguage: "en",
          publisher: { "@id": `${site}/#person` },
        });
      }

      const tags: { tag: string; attrs?: Record<string, string>; children?: string; injectTo: "head" }[] = [
        { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }), injectTo: "head" },
      ];
      if (site) {
        tags.push(
          { tag: "link", attrs: { rel: "canonical", href: `${site}/` }, injectTo: "head" },
          { tag: "meta", attrs: { property: "og:url", content: `${site}/` }, injectTo: "head" },
          { tag: "meta", attrs: { property: "og:image", content: `${site}/og-image.png` }, injectTo: "head" },
          { tag: "meta", attrs: { name: "twitter:image", content: `${site}/og-image.png` }, injectTo: "head" },
        );
      }
      return tags;
    },

    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: ["User-agent: *", "Allow: /", ...(site ? ["", `Sitemap: ${site}/sitemap.xml`] : []), ""].join("\n"),
      });
      if (site) {
        const lastmod = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
        });
      }
    },
  };
}
