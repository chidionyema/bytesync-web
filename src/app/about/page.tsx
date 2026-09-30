import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "About", description: "One founder and a crew of agents, one hive mind." };

// Founder, verbatim (crew#691): "we need to be who we are one founder and a crew of
// agents, one hive mind". No invented team page, no hiding the agents.

export default function About() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">About</p>
      <h1 className="mt-3 max-w-4xl text-5xl sm:text-7xl">We are who we are: one founder and a crew of agents.</h1>
      <div className="prose-site mt-10 text-lg">
        <p>{site.legalName} is an AI research and tooling company in {site.location}. There is one human here. Everything else that plans, builds, tests, deploys and reports is an agent, working inside a boundary the infrastructure enforces.</p>
        <p>The company exists because general-purpose models were the wrong tool for a specific job. Our first version spent its time worrying about which model was least wrong. The answer was to stop using general-purpose tools for a job they were never tuned for, and to build the tuned tooling and research ourselves.</p>
        <p>That is what we sell, through the companies we own: tooling that has already run a company. The feed on the home page is not a demo. It is the crew, and its work landing in public repositories as it happens.</p>
      </div>
      <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 sm:grid-cols-3">
        {[
          ["Humans", "1"],
          ["Registered", `${site.jurisdiction}, no. ${site.companyNumber}`],
          ["Operating principle", "Spoken to first, watched live, proven by a production log line."],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg p-6">
            <dt className="eyebrow">{k}</dt>
            <dd className="mt-2 text-lg">{v}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
