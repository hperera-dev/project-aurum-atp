import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="surface-dark min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full rounded-3xl bg-[var(--obsidian-900)] border border-[#6b1117] p-8 sm:p-10 text-center space-y-5 shadow-2xl">
        <p className="font-data text-xs text-[var(--gold-bright)]">
          HTTP 404 · VAULT ROUTE NOT FOUND
        </p>
        <h1 className="heading-section text-[var(--ink-dark-1)]">This page does not exist.</h1>
        <p className="text-sm sm:text-base text-[var(--ink-dark-2)]">
          Return to Project AURUM to view the digital gold vault, Figma prototype screens, or
          Colombo pilot.
        </p>
        <div className="pt-2">
          <Link href="/" className="btn-primary-gold">
            <span>Return to Project AURUM</span>
            <span className="btn-pill-badge-dark" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
