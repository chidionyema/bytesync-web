import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bySlug, companies } from "@/content/companies";

export const dynamicParams = false;
export function generateStaticParams() { return companies.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = bySlug((await params).slug);
  return c ? { title: c.name, description: c.oneLine } : {};
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  if (!c) notFound();
  return (
    <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Link href="/companies/" className="eyebrow hover:text-ink">← Companies</Link>
      <p className="eyebrow mt-8">{c.kind} · {c.status}</p>
      <h1 className="mt-3 text-5xl sm:text-7xl">{c.name}</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink">{c.oneLine}</p>
      <div className="prose-site mt-8">{c.body.map((b) => <p key={b}>{b}</p>)}</div>
      <div className="mt-10 flex flex-wrap gap-3">
        {c.links.map((l) => <a key={l.href} href={l.href} className="btn" rel="noopener">{l.label} ↗</a>)}
      </div>
    </article>
  );
}
