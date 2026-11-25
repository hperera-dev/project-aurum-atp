'use client';

import React, { useState } from 'react';
import { AnimatedNumber } from './AnimatedNumber';

const CBSL_RATES = {
  '22K': { label: '22K · 916', perGram: 36640, perSovereign: 293120 },
  '24K': { label: '24K · 999', perGram: 40000, perSovereign: 320000 },
} as const;

const SCISSORS_STEPS = [
  {
    numeral: '01',
    title: 'Inside the display tray — 0.001 g precision',
    body: 'Before purchase, every bangle and chain carries a barcode tag separating stone weight from pure gold down to the milligram.',
  },
  {
    numeral: '02',
    title: 'The Scissors Cut at checkout',
    body: 'At the counter, the tag is snipped off and kept by the showroom. You leave with a thermal paper bill that fades blank in monsoon humidity.',
  },
  {
    numeral: '03',
    title: 'Years later, 916 & XRF go blind',
    body: 'Hallmarks and XRF scans read surface alloy—never your original shop, hidden Kundan stone deductions, or whether a workshop shaved 0.25 g during polishing.',
  },
];

export const ScissorsCutSection: React.FC = () => {
  const [grams, setGrams] = useState<number>(24);
  const [karat, setKarat] = useState<'22K' | '24K'>('22K');

  const rate = CBSL_RATES[karat];
  const sovereigns = grams / 8;
  const metalValue = grams * rate.perGram;
  const lowLoss = Math.round(metalValue * 0.02);
  const highLoss = Math.round(metalValue * 0.05);

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="relative -mt-6 rounded-t-[2.25rem] md:rounded-t-[3rem] bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Clean Editorial Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
              The Sri Lankan Blind Spot
            </p>
            <h2 id="problem-heading" className="heading-section text-[var(--ink-light-1)]">
              The paper tag gets cut at checkout. The proof walks out blind.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base text-[var(--ink-light-2)] leading-relaxed">
            Without a permanent record of original net gold weight, families face unverified 2%–5%
            cutting deductions at trade-in—and honest jewellers cannot tell their own 8-year-old
            pieces apart from lookalikes.
          </p>
        </div>

        {/* Clean 5 / 7 Split: Ruled Narrative vs Elevated White Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: 3 Clean Ruled Editorial Steps (Zero boxy cards) */}
          <ol className="lg:col-span-5 divide-y divide-[var(--hairline-light)] border-y border-[var(--hairline-light)]">
            {SCISSORS_STEPS.map((step) => (
              <li key={step.numeral} className="py-7 first:pt-6 last:pb-6 flex gap-5">
                <span className="font-data text-xs font-medium text-[var(--bronze-ink)] pt-1 shrink-0">
                  {step.numeral}
                </span>
                <div className="space-y-1.5">
                  <h3 className="heading-card text-[var(--ink-light-1)]">{step.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--ink-light-2)] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Right: ONE Focused Double-Bezel Interactive LKR Calculator */}
          <div className="lg:col-span-7">
            <div className="bezel-light-outer">
              <div className="bezel-light-inner p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--hairline-light)]">
                  <div>
                    <p className="font-data text-xs uppercase tracking-[0.1em] text-[var(--bronze-ink)]">
                      Exchange Deduction Estimator
                    </p>
                    <h3 className="heading-card text-[var(--ink-light-1)] mt-1">
                      What a missing paper bill costs in LKR
                    </h3>
                  </div>

                  {/* Clean Karat Toggle */}
                  <div
                    role="group"
                    aria-label="Select gold purity"
                    className="inline-flex p-1 rounded-full bg-[var(--paper-stone)] border border-[var(--hairline-light)]"
                  >
                    {(['22K', '24K'] as const).map((k) => {
                      const active = karat === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setKarat(k)}
                          aria-pressed={active}
                          className={`min-h-[38px] px-4 rounded-full font-data text-xs font-medium cursor-pointer transition-colors ${
                            active
                              ? 'bg-[var(--ink-light-1)] text-white'
                              : 'text-[var(--ink-light-2)] hover:text-[var(--ink-light-1)]'
                          }`}
                        >
                          {CBSL_RATES[k].label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <label
                      htmlFor="gold-weight-slider"
                      className="text-sm font-medium text-[var(--ink-light-2)]"
                    >
                      Jewellery Weight
                    </label>
                    <div className="text-right">
                      <span className="font-data text-2xl font-medium text-[var(--ink-light-1)]">
                        {grams} g
                      </span>
                      <span className="font-data text-xs text-[var(--ink-light-3)] ml-2">
                        ({sovereigns.toFixed(1)} Sovereigns / Pavan)
                      </span>
                    </div>
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
                    <span>4 g (Ring)</span>
                    <span>24 g (3 Pavan Chain)</span>
                    <span>80 g (10 Pavan Bridal)</span>
                  </div>
                </div>

                {/* Output Readout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl bg-[var(--paper-mineral)] border border-[var(--hairline-light)] p-5">
                    <span className="font-data text-xs text-[var(--ink-light-3)] block">
                      CBSL Reference Metal Value
                    </span>
                    <p className="font-data text-xl sm:text-2xl font-medium text-[var(--ink-light-1)] mt-1.5">
                      <AnimatedNumber value={metalValue} prefix="LKR " />
                    </p>
                    <span className="font-data text-xs text-[var(--ink-light-3)] mt-1 block">
                      LKR {rate.perGram.toLocaleString('en-LK')}/g ·{' '}
                      {rate.perSovereign.toLocaleString('en-LK')}/sovereign
                    </span>
                  </div>

                  <div className="rounded-2xl bg-[var(--err-surface-light)] border border-[#f0c7c7] p-5">
                    <span className="font-data text-xs text-[var(--err-light)] block">
                      At Risk Without Proof (2%–5% Cut)
                    </span>
                    <p className="font-data text-xl sm:text-2xl font-medium text-[var(--err-light)] mt-1.5">
                      <AnimatedNumber value={lowLoss} prefix="LKR " /> –{' '}
                      <AnimatedNumber value={highLoss} />
                    </p>
                    <span className="text-xs text-[var(--ink-light-2)] mt-1 block">
                      Protected with a permanent AURUM passport.
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[var(--ink-light-3)]">
                  Illustrative benchmark using CBSL daily reference rates. Actual retail making
                  charges and buy-back terms are set by each participating showroom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
