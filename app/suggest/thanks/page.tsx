import Link from 'next/link';

export const metadata = {
  title: 'Thanks | Halal Maps',
  description: 'Thanks for suggesting a spot. We review every submission before it goes live.',
};

export default function SuggestThanksPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 text-center">
        <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600">
          Suggestion received
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight font-manrope">Thanks for helping the community</h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          We’ll review this submission and add it if it looks legit. If we need more details, we’ll reach out.
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
            Suggest another spot
          </Link>
        </div>
      </div>
    </div>
  );
}
