// The one place the brand lives (crew#235: "brand = config + collection + domain";
// crew#691: the company name changes here and nowhere else).
// The hostname is config (LAW 46): set NEXT_PUBLIC_SITE_URL when the real domain lands.

export const site = {
  name: "Bytesync",
  legalName: "Bytesync Ltd",
  companyNumber: "17182157",
  jurisdiction: "England and Wales",
  tagline: "AI research and tooling, run by one founder and a crew of agents.",
  description:
    "Bytesync is an AI research and tooling company. We build tuned models and the tooling around them for specific jobs, and we run the company on that tooling: one founder, a crew of agents, one hive mind.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytesync-c0u.pages.dev",
  github: { user: "chidionyema", url: "https://github.com/chidionyema" },
  contact: {
    // Set NEXT_PUBLIC_CONTACT_EMAIL once the domain and mailbox exist.
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
    linkedin: "https://linkedin.com/in/chidionyema",
  },
  founded: 2025,
  location: "London, United Kingdom",
} as const;

export const nav = [
  { href: "/research/", label: "Research" },
  { href: "/companies/", label: "Companies" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;
