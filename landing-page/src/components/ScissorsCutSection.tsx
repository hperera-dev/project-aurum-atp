'use client';

import React, { useState } from 'react';
import { AnimatedNumber } from './AnimatedNumber';

const CBSL_RATES = {
  '22K': { label: '22K · 916', perGram: 36640, perSovereign: 293120 },
  '24K': { label: '24K · 999', perGram: 40000, perSovereign: 320000 },
} as const;

export const ScissorsCutSection: React.FC = () => {
  const [grams, setGrams] = useState(24);
  const [karat, setKarat] = useState<'22K' | '24K'>('22K');

  const rate = CBSL_RATES[karat];
  const metalValue = grams * rate.perGram;

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="relative -mt-6 rounded-t-[2.25rem] md:rounded-t-[3rem] bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div
          className="surface-dark relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-end shadow-[0_30px_70px_-28px_rgba(34,4,8,0.48)] border border-[#630f15]"
          style={{
            background:
              'radial-gradient(ellipse 62% 76% at 75% 50%, #590d13 0%, #2e0508 50%, #180304 100%)',
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 520"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-90"
            fill="none"
          >
            <defs>
              <linearGradient id="cutGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff3cf" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#e5be6a" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#9c6c22" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <g stroke="url(#cutGold)" strokeWidth="0.9" opacity="0.34">
              <circle cx="890" cy="245" r="215" strokeDasharray="3 8" />
              <circle cx="890" cy="245" r="158" />
              <line x1="620" y1="245" x2="1160" y2="245" strokeDasharray="2 10" />
            </g>
            <g stroke="url(#cutGold)" strokeLinecap="round">
              <ellipse cx="905" cy="215" rx="146" ry="62" strokeWidth="2.4" />
              <ellipse cx="905" cy="215" rx="124" ry="48" strokeWidth="1.3" opacity="0.8" />
              <ellipse cx="905" cy="248" rx="146" ry="62" strokeWidth="2.1" />
              <path d="M759 215 L759 248 M1051 215 L1051 248" strokeWidth="2.2" />
              <path
                d="M782 248 C808 272, 834 252, 858 278 C882 292, 928 292, 952 278 C976 252, 1002 272, 1028 248"
                strokeWidth="1.4"
                opacity="0.85"
              />
              <circle cx="905" cy="283" r="8" strokeWidth="1.5" />
              <circle cx="852" cy="274" r="5" strokeWidth="1.2" opacity="0.8" />
              <circle cx="958" cy="274" r="5" strokeWidth="1.2" opacity="0.8" />
            </g>
            <g stroke="url(#cutGold)" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M666 322 L738 308 L754 328 L744 358 L672 370 Z"
                strokeWidth="1.8"
                fill="rgba(247,223,163,0.06)"
              />
              <circle cx="734" cy="332" r="4" strokeWidth="1.3" />
              <path
                d="M738 332 C768 334, 782 356, 804 356 M824 352 C844 344, 858 328, 868 306"
                strokeWidth="1.3"
                strokeDasharray="4 4"
              />
              <path d="M812 362 L928 398 L918 412 L812 362 Z M820 348 L938 372 L932 386 L820 348 Z" strokeWidth="1.8" />
              <path d="M926 392 L1034 426 C1054 432, 1054 456, 1030 452 L922 408" strokeWidth="1.6" />
              <circle cx="916" cy="389" r="3.5" fill="#f7dfa3" />
            </g>
          </svg>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(24,3,4,0.92) 0%, rgba(28,4,6,0.72) 46%, rgba(28,4,6,0.12) 78%, rgba(28,4,6,0.04) 100%)',
            }}
          />

          <div className="relative z-10 p-7 sm:p-10 md:p-14 max-w-2xl space-y-4">
            <h2 id="problem-heading" className="heading-section text-[var(--ink-dark-1)]">
              The paper tag gets <span className="text-[var(--gold-bright)]">cut</span> at checkout.
              The proof walks out blind.
            </h2>
            <p className="text-sm sm:text-base font-medium text-[var(--ink-dark-2)] max-w-[44ch]">
              Hallmarks and XRF scans read surface alloy—never your original showroom, stone weight,
              or why a faded thermal receipt costs you 2%–5% at trade-in.
            </p>
          </div>
        </div>

        <div className="bezel-light-outer">
          <div className="bezel-light-inner p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="gold-weight-slider"
                  className="font-display text-2xl sm:text-3xl text-[var(--ink-light-1)]"
                >
                  Slide your gold weight
                </label>

                <div
                  role="group"
                  aria-label="Select gold purity"
                  className="inline-flex p-1 rounded-full bg-[var(--paper-stone)] border border-[var(--hairline-light)]"
                >
                  {(['22K', '24K'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKarat(k)}
                      aria-pressed={karat === k}
                      className={`min-h-[38px] px-4 rounded-full font-data text-xs font-medium cursor-pointer transition-colors ${
                        karat === k
                          ? 'bg-[#430a0e] text-white'
                          : 'text-[var(--ink-light-2)] hover:text-[var(--ink-light-1)]'
                      }`}
                    >
                      {CBSL_RATES[k].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl sm:text-6xl text-[var(--ink-light-1)] tracking-tight">
                    {grams} <span className="text-2xl text-[var(--ink-light-2)]">grams</span>
                  </span>
                  <span className="font-data text-xs sm:text-sm font-medium text-[#8b141b]">
                    {(grams / 8).toFixed(1)} Sovereigns (Pavan)
                  </span>
                </div>

                <input
                  id="gold-weight-slider"
                  type="range"
                  min={4}
                  max={80}
                  step={2}
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                  className="aurum-range-light"
                />

                <div className="flex justify-between font-data text-xs text-[var(--ink-light-3)]">
                  <span>4 g Ring</span>
                  <span>24 g Thali Chain</span>
                  <span>80 g Bridal Set</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[var(--paper-mineral)] border border-[var(--hairline-light)] p-5">
                <span className="font-data text-xs text-[var(--ink-light-3)] block">
                  CBSL Metal Value
                </span>
                <p className="font-data text-xl sm:text-2xl font-medium text-[var(--ink-light-1)] mt-2">
                  <AnimatedNumber value={metalValue} prefix="LKR " />
                </p>
                <span className="font-data text-xs text-[var(--ink-light-3)] mt-1 block">
                  LKR {rate.perGram.toLocaleString('en-LK')}/g
                </span>
              </div>

              <div className="rounded-2xl bg-[var(--err-surface-light)] border border-[#ecc4c8] p-5">
                <span className="font-data text-xs font-medium text-[var(--err-light)] block">
                  Unverified 2%–5% Cut
                </span>
                <p className="font-data text-xl sm:text-2xl font-medium text-[var(--err-light)] mt-2">
                  <AnimatedNumber value={Math.round(metalValue * 0.02)} prefix="LKR " /> –{' '}
                  <AnimatedNumber value={Math.round(metalValue * 0.05)} />
                </p>
                <span className="text-xs font-medium text-[var(--ink-light-2)] mt-1 block">
                  Saved by a permanent AURUM passport.
                </span>
              </div>

              <p className="sm:col-span-2 text-xs text-[var(--ink-light-3)]">
                Illustrative CBSL benchmark ({rate.perSovereign.toLocaleString('en-LK')}/sovereign).
                Final buy-back terms are set by each participating showroom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
