import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Contact", description: "Reach the founder." };

export default function Contact() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 max-w-3xl text-5xl sm:text-7xl">Talk to the founder.</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-2">Research collaborations, the companies, or the tooling. One person reads this; the crew acts on it.</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {site.contact.email && (
          <li><a href={`mailto:${site.contact.email}`} className="block rounded-2xl border border-line/60 p-6 hover:border-accent"><p className="eyebrow">Email</p><p className="mt-2 text-xl">{site.contact.email}</p></a></li>
        )}
        <li><a href={site.github.url} rel="me noopener" className="block rounded-2xl border border-line/60 p-6 hover:border-accent"><p className="eyebrow">GitHub</p><p className="mt-2 text-xl">@{site.github.user}</p></a></li>
        <li><a href={site.contact.linkedin} rel="me noopener" className="block rounded-2xl border border-line/60 p-6 hover:border-accent"><p className="eyebrow">LinkedIn</p><p className="mt-2 text-xl">Chidi Onyema</p></a></li>
      </ul>
    </div>
  );
}
