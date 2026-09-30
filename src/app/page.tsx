import Link from "next/link";
import { HomeLive } from "@/components/Home";
import { companies } from "@/content/companies";
import { programmes } from "@/content/research";

export default function Home() {
  return (
    <>
      <HomeLive />

      <section aria-labelledby="pr-h" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="reveal">
          <p className="eyebrow">Research</p>
          <h2 id="pr-h" className="mt-2 max-w-3xl text-3xl sm:text-5xl">Fit is the whole game.</h2>
          <p className="mt-4 max-w-2xl text-ink-2">General-purpose models are the wrong tool for a specific job. Four programmes, each measured on the outcome of the job itself.</p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/60 sm:grid-cols-2">
          {programmes.map((p, i) => (
            <Link key={p.slug} href={`/research/#${p.slug}`} className="reveal group bg-bg p-6 transition hover:bg-bg-2 sm:p-8">
              <p className="eyebrow">0{i + 1}</p>
              <h3 className="mt-3 text-2xl group-hover:text-accent">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-2">{p.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="co-h" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="reveal">
          <p className="eyebrow">Companies</p>
          <h2 id="co-h" className="mt-2 text-3xl sm:text-5xl">The parent sells nothing. Its companies do.</h2>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {companies.map((c) => (
            <li key={c.slug} className="reveal">
              <Link href={`/companies/${c.slug}/`} className="block h-full rounded-2xl border border-line/60 p-6 transition hover:border-accent">
                <p className="eyebrow">{c.kind}</p>
                <h3 className="mt-3 text-2xl">{c.name}</h3>
                <p className="mt-2 text-sm text-ink-2">{c.oneLine}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="reveal rounded-3xl border border-line/60 bg-bg-2 p-8 sm:p-14">
          <p className="eyebrow">Voice first</p>
          <h2 className="mt-2 max-w-3xl text-3xl sm:text-5xl">Don&apos;t read about it. Say it.</h2>
          <p className="mt-4 max-w-2xl text-ink-2">Press <strong className="text-ink">Speak</strong> in the dock and ask for a page. Or press <kbd className="font-mono text-sm">⌘K</kbd> and type. The company works the same way: spoken to first, watched live.</p>
        </div>
      </section>
    </>
  );
}
