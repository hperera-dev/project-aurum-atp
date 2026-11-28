'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SCISSORS_STATS } from '../../content/aurumContent';
import { gsap } from '../../lib/gsapSetup';
import { Glass } from '../glass/Glass';
import { GoldSweepText } from '../motion/GoldSweepText';

const CBSL_RATES = {
  '22K': { label: '22K · 916', perGram: 36640, perSovereign: 293120 },
  '24K': { label: '24K · 999', perGram: 40000, perSovereign: 320000 },
} as const;

const PROBLEM_WORDS =
  'A mother saves for years to place 22K gold in her daughter’s hands. One snip of the counter tag, two monsoons on a thermal bill, and the proof behind your family’s heirloom fades blank.'.split(
    ' '
  );

const GOLD_EMPHASIS_WORDS = new Set(['daughter’s', 'heirloom', 'blank.']);

const SmoothLkr: React.FC<{ value: number; prefix?: string }> = ({ value, prefix = '' }) => {
  const [shown, setShown] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    if (from === value) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      prevRef.current = value;
      setShown(value);
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 340);
      setShown(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) rafId = requestAnimationFrame(tick);
      else {
        prevRef.current = value;
        setShown(value);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      prevRef.current = value;
    };
  }, [value]);

  return (
    <span>
      {prefix}
      {Math.round(shown).toLocaleString('en-LK')}
    </span>
  );
};

export const ScissorsCutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsWrapRef = useRef<HTMLHeadingElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const [grams, setGrams] = useState(24);
  const [karat, setKarat] = useState<'22K' | '24K'>('22K');

  const rate = CBSL_RATES[karat];
  const metalValue = grams * rate.perGram;

  useEffect(() => {
    const section = sectionRef.current;
    const wordsWrap = wordsWrapRef.current;
    const cardsWrap = cardsWrapRef.current;
    if (!section || !wordsWrap || !cardsWrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const wordSpans = wordsWrap.querySelectorAll('.scrub-word');
      gsap.fromTo(
        wordSpans,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: wordsWrap,
            start: 'top 82%',
            end: 'bottom 42%',
            scrub: 0.7,
          },
        }
      );

      const cards = cardsWrap.querySelectorAll('.scissors-stat-card');
      gsap.fromTo(
        cards,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: cardsWrap,
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="problem"
      aria-labelledby="problem-heading"
      className="surface-ruby relative z-20 py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#47090d]"
    >
      <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
        {/* Part A: Scrubbed Word-by-Word Reading Illumination */}
        <div className="max-w-5xl space-y-4">
          <p className="font-data text-xs text-[var(--gold-bright)] uppercase tracking-[0.1em]">
            01 · The Scissors Cut Blind Spot
          </p>
          <h2
            ref={wordsWrapRef}
            id="problem-heading"
            className="heading-manifesto text-[var(--ink-dark-1)]"
          >
            {PROBLEM_WORDS.map((w, idx) => {
              const isGold = GOLD_EMPHASIS_WORDS.has(w);
              return (
                <React.Fragment key={`${w}-${idx}`}>
                  <span
                    className={`scrub-word inline-block ${
                      isGold ? 'text-[var(--gold-bright)] italic' : ''
                    }`}
                  >
                    {w}
                  </span>
                  {idx < PROBLEM_WORDS.length - 1 ? ' ' : null}
                </React.Fragment>
              );
            })}
          </h2>
        </div>

        {/* Part B: 3 Liquid Ruby Glass Proof Stat Cards */}
        <div ref={cardsWrapRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SCISSORS_STATS.map((stat) => (
            <Glass
              key={stat.id}
              variant="card"
              refract
              className="scissors-stat-card p-6 sm:p-7 flex flex-col justify-between gap-5"
            >
              <div className="space-y-2">
                <p className="font-display text-4xl sm:text-5xl text-[var(--gold-bright)] tabular-nums">
                  {stat.prefix}
                  {stat.numEnd}
                  {stat.suffix}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--ink-dark-1)]">
                  {stat.title}
                </h3>
                <p className="text-sm text-[var(--ink-dark-2)] leading-relaxed">{stat.detail}</p>
              </div>
              <p className="pt-3 border-t border-[rgba(247,223,163,0.14)] font-data text-xs text-[var(--ink-dark-3)]">
                {stat.source}
              </p>
            </Glass>
          ))}
        </div>

        {/* Part C: Interactive CBSL Gold Weight Loss Calculator (Warm Alabaster Contrast Card) */}
        <div className="surface-light bezel-light-outer">
          <div className="bezel-light-inner p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label
                  htmlFor="v3-gold-slider"
                  className="font-display text-2xl sm:text-3xl text-[var(--ink-light-1)]"
                >
                  Calculate your <GoldSweepText className="!text-[#7d1117] !bg-none">cut risk</GoldSweepText>
                </label>

                <div
                  role="group"
                  aria-label="Select gold purity"
                  className="inline-flex p-1 rounded-full bg-[var(--paper-2)] border border-[var(--hairline-light)]"
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

              <div className="space-y-3 pt-1" data-cursor="Slide">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-5xl sm:text-6xl text-[var(--ink-light-1)] tracking-tight tabular-nums">
                    {grams} <span className="text-2xl text-[var(--ink-light-2)]">grams</span>
                  </span>
                  <span className="font-data text-xs sm:text-sm font-medium text-[#8b141b]">
                    {(grams / 8).toFixed(1)} Sovereigns (Pavan)
                  </span>
                </div>

                <input
                  id="v3-gold-slider"
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
              <div className="rounded-2xl bg-[var(--paper-1)] border border-[var(--hairline-light)] p-5">
                <span className="font-data text-xs text-[var(--ink-light-3)] block">
                  CBSL Metal Value
                </span>
                <p className="font-data text-xl sm:text-2xl font-medium text-[var(--ink-light-1)] mt-2">
                  <SmoothLkr value={metalValue} prefix="LKR " />
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
                  <SmoothLkr value={Math.round(metalValue * 0.02)} prefix="LKR " /> –{' '}
                  <SmoothLkr value={Math.round(metalValue * 0.05)} />
                </p>
                <span className="text-xs font-medium text-[var(--ink-light-2)] mt-1 block">
                  Protected by a permanent AURUM passport.
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
