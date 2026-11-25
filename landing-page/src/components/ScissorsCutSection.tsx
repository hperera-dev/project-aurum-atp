'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Scissors, Scales, ShieldCheck, WarningCircle, ArrowRight } from '@phosphor-icons/react';
import { TiltSpotlightCard } from './TiltSpotlightCard';
import { AnimatedNumber } from './AnimatedNumber';

type PurityOption = '22k' | '24k';
type CounterMode = 'blind' | 'aurum';

const RATES: Record<PurityOption, { label: string; ratePerGram: number; purityNote: string }> = {
  '22k': {
    label: '22K · 916 Bridal Gold',
    ratePerGram: 36640,
    purityNote: 'LKR 36,640 / g · LKR 293,120 / Sovereign',
  },
  '24k': {
    label: '24K · 999 Fine Gold',
    ratePerGram: 40000,
    purityNote: 'LKR 40,000 / g · LKR 320,000 / Sovereign',
  },
};

const FLOW_NODES: Record<
  CounterMode,
  {
    headline: string;
    tone: 'crimson' | 'gold';
    steps: { tag: string; title: string; detail: string }[];
  }
> = {
  blind: {
    headline: 'Traditional Showroom Counter — Identity Severed at Checkout',
    tone: 'crimson',
    steps: [
      { tag: '0.001 g ERP', title: 'Inside Glass Tray', detail: '15.000 g Gross / 12.450 g Net' },
      { tag: 'SCISSORS CUT', title: 'Barcode Tag Snipped', detail: 'ERP link permanently broken' },
      { tag: '18–24 MONTHS', title: 'Thermal Bill Fades', detail: 'Humidity wipes paper proof' },
      { tag: '2%–5% LOSS', title: 'Blind Uragala Scraping', detail: 'Cutting disputes & swaps' },
    ],
  },
  aurum: {
    headline: 'Project AURUM Counter — Unbroken Cryptographic Proof in 8 Seconds',
    tone: 'gold',
    steps: [
      { tag: '0.001 g ERP', title: 'Existing Tray Tag', detail: 'Zero ERP rip-and-replace' },
      { tag: '8s HANDOVER', title: 'PIN / Gift SMS / Offline', detail: 'Atomic showroom transfer' },
      { tag: 'AES-256 + RLS', title: 'Private Family Vault', detail: 'Invoice sealed · Rivals 403' },
      { tag: 'LIFETIME LOCK', title: '100% Net Weight Verified', detail: 'Fast upgrades & lineage' },
    ],
  },
};

export const ScissorsCutSection: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [counterMode, setCounterMode] = useState<CounterMode>('blind');
  const [grams, setGrams] = useState<number>(16);
  const [purity, setPurity] = useState<PurityOption>('22k');

  const rate = RATES[purity].ratePerGram;
  const sovereigns = grams / 8;
  const metalValue = Math.round(grams * rate);
  const minCuttingLoss = Math.round(metalValue * 0.02);
  const maxCuttingLoss = Math.round(metalValue * 0.05);
  const activeFlow = FLOW_NODES[counterMode];

  return (
    <section
      id="problem"
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 font-data text-xs text-[var(--gold-300)] mb-3">
              <Scissors size={16} weight="light" aria-hidden="true" />
              <span>WHERE THE SHOWROOM COUNTER GOES BLIND</span>
            </div>
            <h2 className="heading-section text-[var(--ink-1)]">
              Inside the display case, your bangle is tracked to 0.001 grams. One snip of the
              cashier’s scissors erases all of it.
            </h2>
          </div>

          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            {[
              { val: '0.001 g', label: 'ERP tray precision', tone: 'text-[var(--gold-300)]' },
              { val: '18 mo', label: 'Thermal ink fade', tone: 'text-[var(--status-err)]' },
              { val: '8 sec', label: 'AURUM handover', tone: 'text-[var(--status-ok)]' },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="velvet-glass-panel rounded-2xl p-3.5 sm:p-4 text-center"
              >
                <span className={`font-data text-lg sm:text-xl font-medium block ${kpi.tone}`}>
                  {kpi.val}
                </span>
                <span className="text-xs text-[var(--ink-3)] mt-1 block">{kpi.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Animated SVG Counter Pipeline */}
        <div className="bezel-shell-velvet">
          <div className="bezel-core-velvet p-5 sm:p-7 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--velvet-850)]">
              <div>
                <p className="font-data text-xs text-[var(--gold-300)] mb-1">
                  INTERACTIVE SYSTEM ARCHITECTURE COMPARISON
                </p>
                <h3 className="heading-card text-lg sm:text-xl text-[var(--ink-1)]">
                  {activeFlow.headline}
                </h3>
              </div>

              <div
                role="tablist"
                aria-label="Compare traditional checkout against Project AURUM"
                className="inline-flex p-1 rounded-full bg-[var(--velvet-950)] border border-[var(--velvet-700)] self-start"
              >
                {[
                  { id: 'blind' as const, label: 'Without AURUM (Scissors Cut)' },
                  { id: 'aurum' as const, label: 'With Project AURUM' },
                ].map((t) => {
                  const selected = counterMode === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setCounterMode(t.id)}
                      className={`relative z-10 min-h-[44px] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${selected
                          ? 'text-[var(--velvet-950)]'
                          : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'
                        }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="counter-mode-pill"
                          transition={
                            prefersReduced
                              ? { duration: 0 }
                              : { type: 'spring', duration: 0.4, bounce: 0 }
                          }
                          className={`absolute inset-0 -z-10 rounded-full ${t.id === 'blind' ? 'bg-[var(--status-err)]' : 'bg-[var(--gold-400)]'
                            }`}
                        />
                      )}
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 40"
                preserveAspectRatio="none"
                className="hidden lg:block w-full h-10 -mb-5 opacity-95"
              >
                <line
                  x1="120"
                  y1="20"
                  x2="880"
                  y2="20"
                  stroke={
                    activeFlow.tone === 'crimson'
                      ? 'oklch(75.5% 0.145 19 / 0.25)'
                      : 'oklch(86% 0.098 82 / 0.28)'
                  }
                  strokeWidth="2"
                />
                <line
                  x1="120"
                  y1="20"
                  x2="880"
                  y2="20"
                  stroke={
                    activeFlow.tone === 'crimson'
                      ? 'oklch(75.5% 0.145 19)'
                      : 'oklch(86% 0.098 82)'
                  }
                  strokeWidth="2.5"
                  className={prefersReduced ? '' : 'svg-flow-beam'}
                />
              </svg>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
                {activeFlow.steps.map((node, i) => (
                  <div
                    key={`${counterMode}-${node.title}`}
                    className={`rounded-2xl p-4 border transition-transform duration-200 hover:-translate-y-1 ${activeFlow.tone === 'crimson'
                        ? i >= 1
                          ? 'bg-[oklch(22%_0.075_19/0.86)] border-[oklch(50%_0.13_19)] hover:border-[var(--status-err)]'
                          : 'bg-[var(--velvet-900)] border-[var(--velvet-700)]'
                        : 'bg-[oklch(19%_0.036_166/0.88)] border-[oklch(78.5%_0.116_82/0.55)] hover:border-[var(--gold-200)]'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`font-data text-xs px-2.5 py-0.5 rounded-full ${activeFlow.tone === 'crimson' && i >= 1
                            ? 'bg-[var(--velvet-850)] text-[var(--status-err)]'
                            : 'bg-[var(--velvet-850)] text-[var(--gold-300)]'
                          }`}
                      >
                        {node.tag}
                      </span>
                      {i < 3 && (
                        <ArrowRight
                          size={14}
                          weight="light"
                          aria-hidden="true"
                          className="text-[var(--ink-3)] lg:hidden"
                        />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[var(--ink-1)]">{node.title}</p>
                    <p className="font-data text-xs text-[var(--ink-2)] mt-1">{node.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5 / 7 Split: Belief-Breaker + Rolling LKR Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          <div className="lg:col-span-5 space-y-4">
            <TiltSpotlightCard maxTilt={4} innerClassName="p-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--status-err)]">
                <WarningCircle size={16} weight="regular" aria-hidden="true" />
                <span>Why 916 Stamps &amp; X-Ray Machines Fail Both Sides</span>
              </div>
              <h3 className="heading-card text-[var(--ink-1)]">
                XRF proves alloy purity—never which specific bangle is on the counter.
              </h3>
              <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
                Whether in Kollupitiya, Kandy, or Sea Street (<em>Hetti Weediya</em>), a{' '}
                <span className="font-data text-[var(--gold-300)]">916</span> stamp and XRF
                analyzer cannot separate hidden Kundan stone weight from pure gold once the barcode
                tag is snipped.
              </p>
            </TiltSpotlightCard>

            <div className="grid grid-cols-2 gap-4">
              <TiltSpotlightCard maxTilt={5} innerClassName="p-5">
                <span className="font-data text-2xl font-medium text-[var(--status-err)] block">
                  2%–5%
                </span>
                <span className="text-xs sm:text-sm text-[var(--ink-2)] mt-1.5 block">
                  Unverified “cutting” loss families pay during <em>Uragala</em> scraping
                </span>
              </TiltSpotlightCard>
              <TiltSpotlightCard maxTilt={5} innerClassName="p-5">
                <span className="font-data text-2xl font-medium text-[var(--gold-300)] block">
                  0.250 g
                </span>
                <span className="text-xs sm:text-sm text-[var(--ink-2)] mt-1.5 block">
                  Workshop gold-shaving &amp; warranty swaps caught by gram audits
                </span>
              </TiltSpotlightCard>
            </div>
          </div>

          <div className="lg:col-span-7">
            <TiltSpotlightCard beam maxTilt={3.5} innerClassName="p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-[var(--velvet-850)]">
                <div className="inline-flex items-center gap-1.5 font-data text-xs text-[var(--gold-300)] mb-1">
                  <Scales size={16} weight="light" aria-hidden="true" />
                  <span>INTERACTIVE TRADE-IN SPECIFICITY INSTRUMENT</span>
                </div>
                <h3 className="heading-card text-[var(--ink-1)]">
                  Calculate What Unverified 2%–5% “Cutting” Costs on Your Family’s Gold
                </h3>
              </div>

              <div
                role="group"
                aria-label="Select gold karatage"
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              >
                {(['22k', '24k'] as PurityOption[]).map((opt) => {
                  const active = purity === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPurity(opt)}
                      aria-pressed={active}
                      className={`min-h-[52px] px-4 py-2.5 rounded-2xl text-left cursor-pointer transition-colors border ${active
                          ? 'bg-[var(--gold-400)] text-[var(--velvet-950)] border-[var(--gold-300)]'
                          : 'bg-[var(--velvet-900)] text-[var(--ink-1)] border-[var(--velvet-700)] hover:border-[var(--gold-400)]'
                        }`}
                    >
                      <span className="block text-sm font-semibold">{RATES[opt].label}</span>
                      <span
                        className={`block font-data text-xs mt-0.5 ${active ? 'text-[var(--velvet-950)]' : 'text-[var(--gold-300)]'
                          }`}
                      >
                        {RATES[opt].purityNote}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-2">
                  <label htmlFor="gold-grams-slider" className="text-sm font-semibold text-[var(--ink-1)]">
                    Pure Net Gold Weight
                  </label>
                  <output
                    htmlFor="gold-grams-slider"
                    className="font-data text-base sm:text-lg font-medium text-[var(--gold-300)]"
                  >
                    {grams.toFixed(1)} g · {sovereigns.toFixed(2)} Sovereigns
                  </output>
                </div>

                <input
                  id="gold-grams-slider"
                  type="range"
                  min={4}
                  max={80}
                  step={2}
                  value={grams}
                  onChange={(e) => setGrams(Number(e.target.value))}
                  className="aurum-range"
                />

                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded-full bg-[var(--velvet-900)] border border-[var(--velvet-750)] overflow-hidden relative">
                    <div
                      style={{
                        transform: `scaleX(${Math.max(0.14, grams / 80)})`,
                        transformOrigin: 'left center',
                      }}
                      className="h-full w-full bg-[linear-gradient(90deg,var(--gold-500)_0%,var(--gold-200)_88%,var(--status-err)_88%,var(--status-err)_100%)] transition-transform duration-200"
                    />
                  </div>
                  <div className="flex justify-between font-data text-xs text-[var(--ink-3)]">
                    <span>4 g (0.5 Pavan)</span>
                    <span>24 g (3 Pavan Chain)</span>
                    <span>80 g (10 Pavan Bridal Set)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--velvet-900)] p-4 border border-[var(--velvet-700)]">
                  <span className="block text-xs font-medium text-[var(--ink-3)]">
                    Indicative Pure Metal Value
                  </span>
                  <AnimatedNumber
                    value={metalValue}
                    prefix="LKR "
                    className="block font-data text-xl sm:text-2xl font-medium text-[var(--ink-1)] mt-1"
                  />
                </div>

                <div className="rounded-2xl bg-[oklch(22%_0.08_19)] p-4 border border-[oklch(52%_0.14_19)]">
                  <span className="block text-xs font-semibold text-[var(--status-err)]">
                    Unverified 2%–5% Deduction Risk
                  </span>
                  <div className="font-data text-lg sm:text-xl font-medium text-[var(--status-err)] mt-1">
                    <AnimatedNumber value={minCuttingLoss} prefix="LKR " /> –{' '}
                    <AnimatedNumber value={maxCuttingLoss} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] p-4 flex items-start gap-3">
                <ShieldCheck
                  size={20}
                  weight="light"
                  className="text-[var(--gold-300)] shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                  <strong className="text-[var(--gold-300)]">AURUM Verified Passport:</strong>{' '}
                  Preserves Day-1 Net Gold Weight (
                  <span className="font-data text-[var(--ink-1)]">{grams.toFixed(2)} g</span>) and
                  your encrypted VAT invoice PDF so your showroom never guesses stone weight.
                </p>
              </div>
            </TiltSpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};
