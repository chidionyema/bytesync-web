import type { MetadataRoute } from "next";
import { site } from "@/site.config";
import { companies } from "@/content/companies";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/research/", "/companies/", "/about/", "/contact/", "/privacy/", "/terms/", ...companies.map((c) => `/companies/${c.slug}/`)];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() }));
}
