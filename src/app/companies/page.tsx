import type { Metadata } from "next";
import Link from "next/link";
import { companies } from "@/content/companies";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Companies", description: "The companies under Bytesync: Mumchimp, Hermes and Prospector." };

export default function Companies() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Companies</p>
      <h1 className="mt-3 max-w-4xl text-5xl sm:text-7xl">{site.name} is the parent. These are its companies.</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">Each has its own brand and its own front door, and each runs on the one platform the research lands on.</p>
      <ul className="mt-14 divide-y divide-line/60 border-y border-line/60">
        {companies.map((c) => (
          <li key={c.slug} className="reveal">
            <Link href={`/companies/${c.slug}/`} className="group grid gap-3 py-8 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline">
              <p className="eyebrow">{c.kind}</p>
              <div>
                <h2 className="text-3xl group-hover:text-accent sm:text-4xl">{c.name}</h2>
                <p className="mt-2 max-w-xl text-ink-2">{c.oneLine}</p>
              </div>
              <span className="font-mono text-xs text-ink-3">{c.status === "live" ? "● live" : "○ building"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
