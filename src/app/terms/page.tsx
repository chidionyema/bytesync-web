import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "Terms", description: "Terms of use for this site." };

export default function Terms() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <p className="eyebrow">Terms</p>
      <h1 className="mt-3 max-w-3xl text-5xl sm:text-6xl">Plain terms for a plain site.</h1>
      <div className="prose-site mt-10 text-lg">
        <p>This website is published by {site.legalName} (company no. {site.companyNumber}, {site.jurisdiction}) for information about the company, its research and its companies. It does not sell anything and it does not offer advice.</p>
        <p>Content is provided as is. We keep it accurate and current, but we make no warranty that it is complete or free of error, and we accept no liability for reliance on it beyond what the law does not allow us to exclude.</p>
        <p>Links to other sites, including our companies&apos; own sites and GitHub, take you to services with their own terms. Text on this site is © {site.legalName}; code we publish is licensed as stated in each repository.</p>
        <p>These terms are governed by the law of {site.jurisdiction}.</p>
      </div>
    </article>
  );
}
