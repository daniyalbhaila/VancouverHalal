import Link from 'next/link';

export const metadata = {
  title: 'Report received | Halal Maps',
  description: 'Thanks for reporting an issue. We review every report before updating listings.',
};

export default function ReportThanksPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600">
          Report received
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight font-manrope">Thanks for helping keep this accurate</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          We’ll review your report and update the listing if it checks out.
        </p>
        <div className="mt-8 flex flex-col gap-3 w-full">
          <Link
            href="/"
            className="w-full rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-bold text-[var(--bg-base)] shadow-lg"
          >
            Back to Explore
          </Link>
          <Link
            href="/suggest"
            className="w-full rounded-full border border-[var(--glass-border)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)]"
          >
            Suggest a spot
          </Link>
        </div>
      </div>
    </div>
  );
}
