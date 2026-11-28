'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapSetup';
import { Glass } from '../glass/Glass';
import { GoldSweepText } from '../motion/GoldSweepText';

export const LineageDagSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dag-edge',
        { strokeDashoffset: 460 },
        {
          strokeDashoffset: 0,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            end: 'bottom 58%',
            scrub: 0.85,
          },
        }
      );

      gsap.fromTo(
        '.dag-node-card',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
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
      id="lineage"
      aria-labelledby="lineage-heading"
      className="surface-ruby py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#47090d]"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="font-data text-xs text-[var(--gold-bright)] uppercase tracking-[0.1em]">
              05 · Generational Provenance Graph
            </p>
            <h2 id="lineage-heading" className="heading-section text-[var(--ink-dark-1)]">
              When heirloom bangles melt, <GoldSweepText>provenance lives on</GoldSweepText>.
            </h2>
          </div>

          <Glass variant="pill" interactive={false} className="self-start md:self-auto px-4 py-2">
            <span className="font-data text-xs text-[var(--ok-dark)]">
              ✓ 100% Unbroken Parent → Child Mass Balance
            </span>
          </Glass>
        </div>

        {/* Visual Provenance Directed Acyclic Graph */}
        <Glass variant="panel" refract className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Parent Nodes */}
            <div className="lg:col-span-4 space-y-4">
              <div className="dag-node-card rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.28)] p-4 space-y-1.5">
                <div className="flex justify-between font-data text-xs">
                  <span className="text-[var(--gold-bright)]">PARENT · AUR · 7721</span>
                  <span className="text-[var(--ink-dark-3)]">1998 Archive</span>
                </div>
                <p className="font-display text-lg text-[var(--ink-dark-1)]">
                  Heritage 22K Filigree Bangles
                </p>
                <p className="font-data text-xs text-[var(--ok-dark)]">20.05 g Net · 22K (916)</p>
              </div>

              <div className="dag-node-card rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.28)] p-4 space-y-1.5">
                <div className="flex justify-between font-data text-xs">
                  <span className="text-[var(--gold-bright)]">PARENT · AUR · 5104</span>
                  <span className="text-[var(--ink-dark-3)]">2006 Sovereign</span>
                </div>
                <p className="font-display text-lg text-[var(--ink-dark-1)]">
                  Colombo Sovereign Bridal Ring
                </p>
                <p className="font-data text-xs text-[var(--ok-dark)]">8.00 g Net · 22K (916)</p>
              </div>
            </div>

            {/* Scrubbed Bezier Connector SVG + Showroom Melt Node */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3">
              <svg
                viewBox="0 0 320 140"
                className="hidden lg:block w-full h-28 overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 4 28 C 90 28, 95 70, 160 70"
                  stroke="rgba(247,223,163,0.18)"
                  strokeWidth="2"
                />
                <path
                  d="M 4 112 C 90 112, 95 70, 160 70"
                  stroke="rgba(247,223,163,0.18)"
                  strokeWidth="2"
                />
                <path
                  d="M 160 70 L 316 70"
                  stroke="rgba(247,223,163,0.18)"
                  strokeWidth="2"
                />

                <path
                  d="M 4 28 C 90 28, 95 70, 160 70"
                  stroke="#f7dfa3"
                  strokeWidth="2.4"
                  strokeDasharray="460"
                  className="dag-edge"
                />
                <path
                  d="M 4 112 C 90 112, 95 70, 160 70"
                  stroke="#f7dfa3"
                  strokeWidth="2.4"
                  strokeDasharray="460"
                  className="dag-edge"
                />
                <path
                  d="M 160 70 L 316 70"
                  stroke="#74e3ad"
                  strokeWidth="2.6"
                  strokeDasharray="460"
                  className="dag-edge"
                />
                <circle cx="160" cy="70" r="14" fill="#2b0608" stroke="#f7dfa3" strokeWidth="1.6" />
                <circle cx="160" cy="70" r="4.5" fill="#f7dfa3" />
              </svg>

              <div className="rounded-full px-4 py-1.5 bg-[#2b0608] border border-[rgba(247,223,163,0.35)] font-data text-xs text-[var(--gold-bright)] text-center">
                Certified Showroom Melt · 28.05 g Combined
              </div>
            </div>

            {/* Child Bridal Passport Node */}
            <div className="lg:col-span-4">
              <div className="dag-node-card rounded-2xl bg-gradient-to-br from-[#3d090c] to-[#160203] border border-[rgba(247,223,163,0.55)] p-5 space-y-2.5 shadow-[0_20px_50px_-18px_rgba(247,223,163,0.22)]">
                <div className="flex justify-between items-center font-data text-xs">
                  <span className="text-[var(--gold-bright)]">CHILD · AUR · 9940</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#103827] text-[var(--ok-dark)]">
                    Linked DAG
                  </span>
                </div>
                <p className="font-display text-xl text-[var(--ink-dark-1)]">
                  Kandyan Bridal Sovereign Necklace
                </p>
                <p className="font-data text-sm text-[var(--gold-bright)]">
                  28.05 g Pure 22K Lineage Sealed
                </p>
                <p className="text-xs text-[var(--ink-dark-2)] leading-relaxed">
                  Retains immutable cryptographic links to both ancestral Parent passports forever.
                </p>
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </section>
  );
};
