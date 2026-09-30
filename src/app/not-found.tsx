import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl sm:text-7xl">Nothing here yet.</h1>
      <p className="mt-6 text-ink-2">Say “home”, or <Link href="/" className="underline">go there</Link>.</p>
    </div>
  );
}
