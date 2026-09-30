import Link from "next/link";
import { nav, site } from "@/site.config";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
        <Link href="/" className="wordmark display text-xl leading-none tracking-tight sm:text-2xl" aria-label={`${site.name} home`}>
          {site.name}<span className="text-accent">.</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-full px-2 py-1.5 text-[13px] text-ink-2 transition hover:bg-bg-2 hover:text-ink sm:px-3 sm:text-sm">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
