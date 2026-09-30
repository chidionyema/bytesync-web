// The site's voice intent plane, in miniature. A spoken or typed utterance
// resolves to one of these intents, or to nothing. Pure, so it is unit tested.

export type Intent =
  | { kind: "go"; href: string; say: string }
  | { kind: "say"; say: string }
  | { kind: "read" }
  | { kind: "stop" }
  | { kind: "none" };

const routes: { words: string[]; href: string; say: string }[] = [
  { words: ["home", "start", "top"], href: "/", say: "Home." },
  { words: ["research", "science", "papers"], href: "/research/", say: "Research." },
  { words: ["companies", "products", "portfolio"], href: "/companies/", say: "Our companies." },
  { words: ["mumchimp", "store", "shop"], href: "/companies/mumchimp/", say: "Mumchimp, the store." },
  { words: ["hermes", "agent"], href: "/companies/hermes/", say: "Hermes, the agent." },
  { words: ["prospector", "prospects"], href: "/companies/prospector/", say: "Prospector." },
  { words: ["about", "who are you", "who is bytesync", "story"], href: "/about/", say: "About Bytesync." },
  { words: ["contact", "email", "reach", "talk to"], href: "/contact/", say: "Contact." },
  { words: ["privacy"], href: "/privacy/", say: "Privacy." },
  { words: ["terms"], href: "/terms/", say: "Terms." },
];

export function resolve(utterance: string): Intent {
  const u = utterance.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (!u) return { kind: "none" };
  if (/^(stop|quiet|silence|shut up|enough)$/.test(u)) return { kind: "stop" };
  if (/\b(read|speak|narrate)\b/.test(u) && /\b(this|page|it|aloud)\b/.test(u)) return { kind: "read" };
  if (/\bwhat (is|does) bytesync\b/.test(u) || /\bwhat do you do\b/.test(u)) {
    return {
      kind: "say",
      say: "Bytesync is an AI research and tooling company. One founder, a crew of agents, one hive mind.",
    };
  }
  for (const r of routes) {
    if (r.words.some((w) => u.includes(w))) return { kind: "go", href: r.href, say: r.say };
  }
  return { kind: "none" };
}

export const examples = ["go to research", "show me the companies", "what is Bytesync", "read this page", "contact"];
