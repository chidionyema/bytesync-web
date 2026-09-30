import type { Metadata } from "next";
import { programmes } from "@/content/research";

export const metadata: Metadata = { title: "Research", description: "Four programmes: tuned models, token efficiency, enforced agents, voice-first operation." };

export default function Research() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Research</p>
      <h1 className="mt-3 max-w-4xl text-5xl sm:text-7xl">Tuned for the job, measured on the job.</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">
        We are a research and tooling company. The research is what makes the tooling work; the tooling is where the research is proven. Nothing here is a benchmark for its own sake.
      </p>
      <div className="mt-16 space-y-16">
        {programmes.map((p, i) => (
          <section key={p.slug} id={p.slug} className="reveal grid gap-6 border-t border-line/60 pt-10 md:grid-cols-[8rem_1fr] scroll-mt-24">
            <p className="eyebrow">Programme 0{i + 1}</p>
            <div className="prose-site">
              <h2 className="text-3xl sm:text-4xl">{p.title}</h2>
              <p className="mt-3 text-lg text-ink">{p.lead}</p>
              <div className="mt-4">{p.body.map((b) => <p key={b}>{b}</p>)}</div>
              {p.measured && (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  {p.measured.map((m) => (
                    <div key={m.label} className="rounded-xl border border-line/60 p-4">
                      <dd className="display text-4xl text-accent">{m.value}</dd>
                      <dt className="mt-1 text-xs text-ink-3">{m.label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
