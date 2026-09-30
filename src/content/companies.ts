// The companies under the parent (crew#235: Alphabet-style; each keeps its own
// front door). Every line here is grounded in the estate catalogue; nothing invented.

export type Company = {
  slug: string;
  name: string;
  kind: string;
  oneLine: string;
  body: string[];
  links: { label: string; href: string }[];
  status: "live" | "building";
};

export const companies: Company[] = [
  {
    slug: "mumchimp",
    name: "Mumchimp",
    kind: "Commerce",
    oneLine: "The store: a storefront, its API and everything that takes a customer's money.",
    body: [
      "Mumchimp is the company's commerce arm. It runs on the same platform as everything else here, with its own brand and its own domain.",
      "It is where the tooling meets a real customer: checkout, catalogue and fulfilment are the proving ground for the agents that run the rest of the company.",
    ],
    links: [{ label: "mumchimp.com", href: "https://mumchimp.com" }],
    status: "live",
  },
  {
    slug: "hermes",
    name: "Hermes",
    kind: "Agent",
    oneLine: "The agent that acts for the founder from anywhere: a message in, a pull request or a run out.",
    body: [
      "Hermes is the founder's hands when the founder is away from a keyboard. Speak or type to it from a phone; it plans the work, runs it inside the estate's execution boundary, and reports what actually happened.",
      "It is voice-first by design. The company is moving every surface to spoken intent and live observation, and Hermes is where that started.",
    ],
    links: [{ label: "Hermes on GitHub", href: "https://github.com/chidionyema/hermes-v2" }],
    status: "live",
  },
  {
    slug: "prospector",
    name: "Prospector",
    kind: "Product",
    oneLine: "The product that finds and qualifies prospects.",
    body: [
      "Prospector finds and qualifies prospects for a business, and keeps doing it whatever the platform underneath it changes into.",
      "It is one product, not the company. It runs on the platform like its siblings and inherits every capability the research programme lands there.",
    ],
    links: [{ label: "Prospector on GitHub", href: "https://github.com/chidionyema/prospector" }],
    status: "live",
  },
];

export const bySlug = (slug: string) => companies.find((c) => c.slug === slug);
