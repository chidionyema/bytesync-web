"use client";
import { useEffect, useState } from "react";
import { ago, fetchPulse, type Pulse as Row } from "@/lib/github";
import { site } from "@/site.config";

// "The crew, now." Real public events from the founder's GitHub account. The
// hero's energy is derived from how much landed in the last day, and the feed is
// the proof the About page makes in words: one founder, a crew of agents.

export function usePulse() {
  const [state, setState] = useState<{ rows: Row[]; at: number } | null>(null);
  const rows = state?.rows ?? null;
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    const load = () => fetchPulse(site.github.user, ac.signal).then((rows) => setState({ rows, at: Date.now() })).catch((e: Error) => setErr(e.message));
    load();
    const id = setInterval(load, 90_000);
    return () => { ac.abort(); clearInterval(id); };
  }, []);
  const dayAgo = (state?.at ?? 0) - 86_400_000;
  const last24h = rows?.filter((r) => new Date(r.at).getTime() > dayAgo).length ?? 0;
  const energy = rows ? Math.min(1, 0.25 + last24h / 20) : 0.3;
  return { rows, err, last24h, energy };
}

const tone: Record<Row["kind"], string> = {
  merge: "text-accent", pr: "text-accent-2", push: "text-ink", issue: "text-ink-2", release: "text-accent", other: "text-ink-3",
};

export function PulseFeed({ rows, err, last24h }: { rows: Row[] | null; err: string | null; last24h: number }) {
  return (
    <section aria-labelledby="pulse-h" className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow flex items-center gap-2"><span className="live" aria-hidden="true" /> The crew, now</p>
          <h2 id="pulse-h" className="mt-2 text-3xl sm:text-4xl">What the crew is doing, right now.</h2>
        </div>
        <p className="font-mono text-sm text-ink-3" aria-live="polite">
          {rows ? `${last24h} events in the last 24h · public GitHub` : err ? "feed unavailable" : "listening…"}
        </p>
      </div>
      <ol className="mt-8 divide-y divide-line/60 border-y border-line/60 font-mono text-sm">
        {(rows ?? Array.from({ length: 6 }, () => null)).map((r, i) => (
          <li key={r?.id ?? i} className="grid grid-cols-[4.5rem_8rem_1fr] items-baseline gap-3 py-3 sm:grid-cols-[5rem_11rem_1fr]">
            {r ? (
              <>
                <span className="text-ink-3">{ago(r.at)}</span>
                <span className="truncate text-ink-2">{r.repo}</span>
                <span className={`truncate ${tone[r.kind]}`}>{r.text}</span>
              </>
            ) : (
              <><span className="h-3 w-10 rounded bg-bg-2" /><span className="h-3 w-24 rounded bg-bg-2" /><span className="h-3 w-3/4 rounded bg-bg-2" /></>
            )}
          </li>
        ))}
      </ol>
      {err && <p className="mt-3 text-sm text-ink-3">The public feed did not answer ({err}). The work is still on <a className="underline" href={site.github.url}>GitHub</a>.</p>}
    </section>
  );
}
