'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitBranch, IdentificationCard } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, HOW_IT_WORKS_STEPS, VaultItem } from '../data/aurumData';
import { TiltSpotlightCard } from './TiltSpotlightCard';

gsap.registerPlugin(ScrollTrigger);

interface HowItWorksSectionProps {
  onOpenPassport: (item: VaultItem) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenPassport }) => {
  const prefersReduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (prefersReduced || !listRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.lineage-step-card', {
        y: 26,
        scale: 0.97,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: {
          trigger: listRef.current,
          start: 'top 82%',
          once: true,
        },
      });
    }, listRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="how-it-works"
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="font-data text-xs text-[var(--gold-300)] mb-2.5">
              ZERO COUNTER DISRUPTION · GENERATIONAL ASSET LINEAGE
            </p>
            <h2 className="heading-section text-[var(--ink-1)]">
              From the showroom display tray to your daughter’s wedding safe in 3 effortless steps
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onOpenPassport(HERO_VAULT_ITEMS[2])}
            className="btn-secondary-velvet self-start lg:self-auto shrink-0"
          >
            <IdentificationCard size={18} weight="light" className="text-[var(--gold-300)]" />
            <span>Inspect Heirloom Passport</span>
          </button>
        </div>

        {/* Interactive Animated SVG Parent -> Child Melting Lineage Graph */}
        <div className="bezel-shell-velvet">
          <div className="bezel-core-velvet p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-[var(--velvet-850)]">
              <div className="flex items-center gap-2.5">
                <GitBranch size={20} weight="light" className="text-[var(--gold-300)]" />
                <div>
                  <p className="font-data text-xs text-[var(--gold-300)]">
                    PARENT → CHILD CRYPTOGRAPHIC MELTING GRAPH
                  </p>
                  <p className="text-sm text-[var(--ink-2)]">
                    When heirloom bangles are melted to forge a bridal necklace, provenance stays
                    mathematically linked forever.
                  </p>
                </div>
              </div>
              <span className="font-data text-xs px-3 py-1 rounded-full bg-[var(--velvet-900)] border border-[var(--velvet-700)] text-[var(--status-ok)]">
                0.000 g Provenance Lost
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
              <div className="lg:col-span-4 space-y-3">
                <div className="velvet-glass-panel rounded-2xl p-4">
                  <span className="font-data text-xs text-[var(--gold-300)]">
                    PARENT NODE A · 1998
                  </span>
                  <p className="text-sm font-semibold mt-0.5">Amma’s 22K Bridal Bangle Pair</p>
                  <p className="font-data text-xs text-[var(--ink-2)] mt-1">
                    24.000 g Net 916 · Swarna Mahal Ledger
                  </p>
                </div>
                <div className="velvet-glass-panel rounded-2xl p-4">
                  <span className="font-data text-xs text-[var(--gold-300)]">
                    PARENT NODE B · 2004
                  </span>
                  <p className="text-sm font-semibold mt-0.5">Family Heirloom Chain</p>
                  <p className="font-data text-xs text-[var(--ink-2)] mt-1">
                    12.000 g Net 916 · Owner-Reported Safe
                  </p>
                </div>
              </div>

              <div className="lg:col-span-3 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 240 140"
                  className="w-full max-w-[240px] h-24 lg:h-36"
                >
                  <path
                    d="M 10 35 C 90 35, 110 70, 230 70"
                    fill="none"
                    stroke="oklch(86% 0.098 82 / 0.25)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 10 105 C 90 105, 110 70, 230 70"
                    fill="none"
                    stroke="oklch(78.5% 0.142 156 / 0.28)"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M 10 35 C 90 35, 110 70, 230 70"
                    fill="none"
                    stroke="oklch(85.5% 0.105 83.5)"
                    strokeWidth="2.5"
                    className={prefersReduced ? '' : 'svg-flow-beam'}
                  />
                  <path
                    d="M 10 105 C 90 105, 110 70, 230 70"
                    fill="none"
                    stroke="oklch(78.5% 0.142 156)"
                    strokeWidth="2.5"
                    className={prefersReduced ? '' : 'svg-flow-beam'}
                  />
                  <circle
                    cx="120"
                    cy="70"
                    r="20"
                    fill="oklch(14.5% 0.022 166)"
                    stroke="oklch(85.5% 0.105 83.5)"
                    strokeWidth="2"
                  />
                  <text
                    x="120"
                    y="74"
                    textAnchor="middle"
                    fill="oklch(92% 0.072 84)"
                    fontSize="10"
                    fontFamily="Azeret Mono, monospace"
                  >
                    916
                  </text>
                </svg>
              </div>

              <div className="lg:col-span-4">
                <div className="rounded-2xl bg-[oklch(20%_0.036_162)] border border-[var(--gold-400)] p-5 shadow-[0_18px_42px_-14px_oklch(78.5%_0.116_82/0.3)]">
                  <span className="font-data text-xs text-[var(--status-ok)]">
                    CHILD PASSPORT · 2026 BRIDAL RE-CRAFT
                  </span>
                  <p className="text-base font-semibold text-[var(--ink-1)] mt-1">
                    Daughter’s Kandyan Wedding Necklace
                  </p>
                  <p className="font-data text-sm text-[var(--gold-300)] mt-1.5">
                    35.850 g Verified Net Gold · 2 Parent Proofs Linked
                  </p>
                  <p className="text-xs text-[var(--ink-2)] mt-2">
                    Original 1998 &amp; 2004 assay hashes permanently sealed inside the new digital
                    passport.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ol ref={listRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li key={step.numeral} className="lineage-step-card">
              <TiltSpotlightCard
                maxTilt={4.5}
                className="h-full"
                innerClassName="p-6 sm:p-8 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between gap-3 pb-4 border-b border-[var(--velvet-850)]">
                    <span className="font-display text-4xl sm:text-5xl text-[var(--gold-300)] leading-none">
                      {step.numeral}
                    </span>
                    <span className="font-data text-xs text-[var(--gold-200)]">{step.kicker}</span>
                  </div>

                  <h3 className="heading-card text-[var(--ink-1)]">{step.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </TiltSpotlightCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
