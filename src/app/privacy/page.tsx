import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Privacy", description: "What this site does and does not collect." };

export default function Privacy() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Privacy</p>
      <h1 className="mt-3 max-w-3xl text-5xl sm:text-6xl">This site collects nothing about you.</h1>
      <div className="prose-site mt-10 text-lg">
        <p>There are no analytics, no cookies and no tracking pixels on this site. It is static files served from a content delivery network, which keeps ordinary server logs (IP address, user agent, request time) for security and capacity purposes and nothing else.</p>
        <p><strong className="text-ink">Voice.</strong> If you press Speak, your browser asks your permission and then runs speech recognition itself. On browsers that support it, recognition runs on your device; on others, the browser sends audio to its own vendor&apos;s service under that vendor&apos;s privacy policy. No audio or transcript is ever sent to {site.legalName}.</p>
        <p><strong className="text-ink">The live feed.</strong> The home page fetches public events from GitHub&apos;s API directly from your browser. That request is governed by GitHub&apos;s privacy statement.</p>
        <p><strong className="text-ink">Contact.</strong> If you email us, we keep the correspondence for as long as the conversation needs it. Data controller: {site.legalName}, company no. {site.companyNumber}, {site.jurisdiction}.</p>
      </div>
    </article>
  );
}
