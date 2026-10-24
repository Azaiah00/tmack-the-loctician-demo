import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-ink px-5 text-center">
      <div aria-hidden className="absolute inset-0 bg-[url(/media/hero/back-1200.webp)] bg-cover bg-center opacity-40" />
      <div className="relative">
        <p className="eyebrow text-rose">404</p>
        <h1 className="display mt-3 text-6xl text-pearl">This loc slipped.</h1>
        <p className="mt-3 text-champagne/75">The page you’re looking for isn’t here — but your next appointment can be.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back home
          </Link>
          <Link href="/services" className="btn btn-ghost">
            See services
          </Link>
        </div>
      </div>
    </main>
  );
}
