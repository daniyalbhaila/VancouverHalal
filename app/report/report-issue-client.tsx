"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function ReportIssueClient() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const slug = searchParams.get('slug') || '';
  const [step, setStep] = useState(0);
  const [issueType, setIssueType] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = useMemo(() => {
    if (!name) return 'Report an issue';
    return `Report an issue for ${name}`;
  }, [name]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-lg px-5 pb-32 pt-8">
        <Link
          href={slug ? `/restaurant/${slug}` : '/'}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-black tracking-tight font-manrope">{title}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Help us keep listings accurate. We review each report before making changes.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
          <span className={step === 0 ? 'text-[var(--text-primary)]' : ''}>What’s wrong</span>
          <span className="h-1 w-1 rounded-full bg-[var(--glass-border)]" />
          <span className={step === 1 ? 'text-[var(--text-primary)]' : ''}>Details</span>
          <span className="h-1 w-1 rounded-full bg-[var(--glass-border)]" />
          <span className={step === 2 ? 'text-[var(--text-primary)]' : ''}>Contact</span>
        </div>

        <form
          name="report-issue"
          method="POST"
          action="/__forms.html"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={async (event) => {
            if (step < 2) {
              event.preventDefault();
              if (step === 0 && !issueType) {
                setErrors('Please pick the issue type.');
                return;
              }
              setErrors(null);
              setStep((prev) => Math.min(prev + 1, 2));
              return;
            }

            event.preventDefault();
            if (isSubmitting) return;
            setIsSubmitting(true);
            setErrors(null);

            const form = event.currentTarget;
            const formData = new FormData(form);
            const params = new URLSearchParams();
            formData.forEach((value, key) => {
              if (typeof value === 'string') params.append(key, value);
            });

            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), 8000);

            try {
              const response = await fetch('/__forms.html', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                signal: controller.signal,
              });

              if (!response.ok) {
                throw new Error('Submission failed');
              }

              window.location.href = '/suggest/thanks';
            } catch (error) {
              setErrors('Submission failed. Please try again.');
            } finally {
              window.clearTimeout(timeoutId);
              setIsSubmitting(false);
            }
          }}
          className="mt-6 space-y-4"
        >
          <input type="hidden" name="form-name" value="report-issue" />
          <input type="hidden" name="restaurant_name" value={name} />
          <input type="hidden" name="restaurant_slug" value={slug} />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">What’s wrong?</label>
                <div className="grid gap-2">
                  {[
                    { value: 'not_halal', label: 'Not halal / unclear' },
                    { value: 'wrong_hours', label: 'Incorrect hours' },
                    { value: 'wrong_address', label: 'Wrong address or pin' },
                    { value: 'closed', label: 'Permanently closed' },
                    { value: 'duplicate', label: 'Duplicate listing' },
                    { value: 'other', label: 'Other issue' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm font-medium"
                    >
                      <input
                        type="radio"
                        name="issue_type"
                        value={option.value}
                        checked={issueType === option.value}
                        onChange={(event) => {
                          setIssueType(event.target.value);
                          setErrors(null);
                        }}
                        className="h-4 w-4"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {errors && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
                  {errors}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Details (optional)</label>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Share anything that helps us verify faster"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Your email (optional)</label>
                <input
                  type="email"
                  name="reporter_email"
                  placeholder="in case we need more info"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]/60 px-4 py-3 text-xs text-[var(--text-secondary)]">
                Reports go to a private review queue. We verify before updating listings.
              </div>

              {errors && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
                  {errors}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setErrors(null);
                setStep((prev) => Math.max(prev - 1, 0));
              }}
              disabled={step === 0}
              className="rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-40"
            >
              Back
            </button>
            {step < 2 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 0 && !issueType) {
                    setErrors('Please pick the issue type.');
                    return;
                  }
                  setErrors(null);
                  setStep((prev) => Math.min(prev + 1, 2));
                }}
                className="rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-xs font-bold text-[var(--bg-base)] shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.98]"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-xs font-bold text-[var(--bg-base)] shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit report'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
