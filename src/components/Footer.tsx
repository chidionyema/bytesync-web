import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="display text-2xl">{site.name}<span className="text-accent">.</span></p>
          <p className="mt-2 max-w-sm text-sm text-ink-3">{site.tagline}</p>
        </div>
        <ul className="space-y-2 text-sm text-ink-2">
          <li><Link href="/research/" className="hover:text-ink">Research</Link></li>
          <li><Link href="/companies/" className="hover:text-ink">Companies</Link></li>
          <li><Link href="/about/" className="hover:text-ink">About</Link></li>
          <li><Link href="/contact/" className="hover:text-ink">Contact</Link></li>
        </ul>
        <ul className="space-y-2 text-sm text-ink-2">
          <li><a href={site.github.url} className="hover:text-ink" rel="me noopener">GitHub</a></li>
          <li><Link href="/privacy/" className="hover:text-ink">Privacy</Link></li>
          <li><Link href="/terms/" className="hover:text-ink">Terms</Link></li>
        </ul>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <p className="eyebrow">© {year} {site.legalName} · registered in {site.jurisdiction}, company no. {site.companyNumber}</p>
      </div>
    </footer>
  );
}
