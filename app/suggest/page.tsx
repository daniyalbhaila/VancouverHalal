"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function SuggestPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [address, setAddress] = useState('');
  const [halalStatus, setHalalStatus] = useState('');
  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setErrors(null);
  }, [step]);

  const validateBasics = () => {
    if (!name.trim()) {
      setErrors('Please add a restaurant name.');
      return false;
    }
    if (!mapsUrl.trim() && !address.trim()) {
      setErrors('Add a Google Maps link or an address so we can verify it.');
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateBasics()) return;
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const handleBack = () => {
    setErrors(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-lg px-5 pb-32 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-[var(--glass-border)] bg-[var(--bg-card)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Explore
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-black tracking-tight font-manrope">Suggest a spot</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Tell us about a halal place we missed. We review every suggestion before it goes live.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
          <span className={step === 0 ? 'text-[var(--text-primary)]' : ''}>Basics</span>
          <span className="h-1 w-1 rounded-full bg-[var(--glass-border)]" />
          <span className={step === 1 ? 'text-[var(--text-primary)]' : ''}>Halal info</span>
          <span className="h-1 w-1 rounded-full bg-[var(--glass-border)]" />
          <span className={step === 2 ? 'text-[var(--text-primary)]' : ''}>Notes</span>
        </div>

        <form
          ref={formRef}
          name="suggest-spot"
          method="POST"
          action="/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={(event) => event.preventDefault()}
          className="mt-6 space-y-4"
        >
          <input type="hidden" name="form-name" value="suggest-spot" />
          <p className="hidden">
            <label>
              Don’t fill this out: <input name="bot-field" />
            </label>
          </p>

          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Restaurant name</label>
                <input
                  name="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Example: Damascus Kitchen"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Google Maps link (best)</label>
                <input
                  type="url"
                  name="google_maps_url"
                  value={mapsUrl}
                  onChange={(event) => setMapsUrl(event.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Address (if no link)</label>
                <input
                  name="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="123 Main St, Vancouver"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
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
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Halal status (optional)</label>
                <select
                  name="halal_status_claim"
                  value={halalStatus}
                  onChange={(event) => setHalalStatus(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                >
                  <option value="">Select one</option>
                  <option value="certified">Certified</option>
                  <option value="verbally_confirmed">Verbally confirmed</option>
                  <option value="community_listed">Community listed</option>
                  <option value="unverified">Not sure</option>
                </select>
              </div>

              {halalStatus === 'certified' && (
                <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)]/60 p-4 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Who certified it?</label>
                    <input
                      name="certification_body"
                      required
                      placeholder="Example: HMA, IFANCA"
                      className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)]">Proof link (optional)</label>
                    <input
                      type="url"
                      name="certification_link"
                      placeholder="Website, Instagram post, or photo"
                      className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Cuisine (optional)</label>
                <input
                  name="cuisine"
                  placeholder="Afghan, Pakistani"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Anything helpful: halal certificate, best dishes, alcohol policy, etc."
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Your email (optional)</label>
                <input
                  type="email"
                  name="submitter_email"
                  placeholder="so we can follow up"
                  className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] px-4 py-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>

              <div className="rounded-2xl border border-dashed border-[var(--glass-border)] bg-[var(--bg-card)]/60 px-4 py-3 text-xs text-[var(--text-secondary)]">
                We’ll check for duplicates and review each submission before it appears in the app.
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
              onClick={handleBack}
              disabled={step === 0}
              className="rounded-full border border-[var(--glass-border)] px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={async () => {
                if (step < 2) {
                  handleNext();
                  return;
                }

                if (isSubmitting) return;
                setIsSubmitting(true);
                setErrors(null);

                const form = formRef.current;
                if (!form) {
                  setErrors('Submission failed. Please try again.');
                  setIsSubmitting(false);
                  return;
                }

                const formData = new FormData(form);
                const params = new URLSearchParams();
                formData.forEach((value, key) => {
                  if (typeof value === 'string') params.append(key, value);
                });

                const controller = new AbortController();
                const timeoutId = window.setTimeout(() => controller.abort(), 8000);

                try {
                  const response = await fetch('/', {
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
              disabled={isSubmitting}
              className="rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-xs font-bold text-[var(--bg-base)] shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70"
            >
              {step < 2 ? 'Continue' : isSubmitting ? 'Submitting...' : 'Submit suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
