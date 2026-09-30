"use client";
import Link from "next/link";
import { HiveField } from "@/components/HiveField";
import { PulseFeed, usePulse } from "@/components/Pulse";
import { site } from "@/site.config";

export function HomeLive() {
  const pulse = usePulse();
  return (
    <>
      <section className="relative isolate min-h-[88svh] overflow-hidden">
        <HiveField energy={pulse.energy} />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_35%,var(--bg)_100%),linear-gradient(90deg,color-mix(in_oklch,var(--bg),transparent_25%)_0%,transparent_60%)]" />
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6">
          <p className="eyebrow flex items-center gap-2"><span className="live" aria-hidden="true" /> AI research and tooling · {site.location}</p>
          <h1 className="mt-4 max-w-4xl text-5xl leading-[1.02] sm:text-7xl md:text-8xl">
            One founder.<br />A crew of agents.<br /><em className="text-accent">One hive mind.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-2">
            We build models and tooling tuned for a specific job, and we run the company on them. What you see here is the same crew, working in public.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/research/" className="btn btn-accent">The research</Link>
            <Link href="/companies/" className="btn">The companies</Link>
          </div>
          <p className="mt-10 font-mono text-xs text-ink-3">Move the pointer: the field bends toward it. Brightness follows the crew&apos;s real output today.</p>
        </div>
      </section>
      <div className="py-20">
        <PulseFeed rows={pulse.rows} err={pulse.err} last24h={pulse.last24h} />
      </div>
    </>
  );
}
