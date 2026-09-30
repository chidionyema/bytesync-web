// Research programmes, grounded in the estate's own graph and decisions.
// Confident, not defensive (crew#691): tuned tooling for a specific job is the product.

export type Programme = {
  slug: string;
  title: string;
  lead: string;
  body: string[];
  measured?: { label: string; value: string }[];
};

export const programmes: Programme[] = [
  {
    slug: "tuned-models",
    title: "Models tuned for one job",
    lead: "General-purpose models are the wrong tool for a specific job. We tune and instrument models for the work in front of them.",
    body: [
      "Our first version leaned on general-purpose coding agents and large language models for tasks they were never tuned for. The lesson was not that models are unreliable. It was that fit is the whole game.",
      "The programme builds specially designed and tuned models for research and operations work, with evaluation that measures the outcome of the job, not a proxy for it.",
    ],
  },
  {
    slug: "token-efficiency",
    title: "Token efficiency",
    lead: "Eight compounding mechanisms that cut what an agent spends to reach the same outcome.",
    body: [
      "Cache guarding, structural compression with atom preservation, action fusion, observation packing, evidence preservation and online context compaction, stacked so each gain compounds on the last.",
      "The mechanisms live in a provider-agnostic gateway that sits in front of any OpenAI- or Anthropic-shaped API and reduces what a request costs without changing what the caller sends or receives.",
    ],
    measured: [{ label: "Cumulative reduction, one-shot implementation", value: "28.7%" }],
  },
  {
    slug: "enforced-agents",
    title: "Agents that cannot act outside the boundary",
    lead: "Every action an agent takes goes through a declared intent. If it is not declared, the agent cannot do it.",
    body: [
      "The company runs on this. A single executor, an intent catalogue, admission policy at the cluster and hooks at the shell mean the boundary is enforced by the infrastructure, not requested of the model.",
      "Destructive operations need quorum and a hardware signature on top of budget. Non-destructive ones need budget. Nothing is a judgement call at run time.",
    ],
  },
  {
    slug: "voice-first",
    title: "Voice first and realtime",
    lead: "The founder speaks to the company and hears it back, and watches what it does as it happens.",
    body: [
      "State is streamed as it changes over a bus, not written up afterwards in a report. A capability that cannot be reached by voice or seen live is not finished.",
      "This site is a small instance of that bar: speak to it, and watch the crew's work land in the feed.",
    ],
  },
];
