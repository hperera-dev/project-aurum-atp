'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PROVENANCE_PHASES, ProvenancePhase } from '../../content/aurumContent';
import { gsap } from '../../lib/gsapSetup';
import { Glass } from '../glass/Glass';
import { GoldSweepText } from '../motion/GoldSweepText';

const PhaseMiniVisual: React.FC<{ kind: ProvenancePhase['animKind'] }> = ({ kind }) => {
  switch (kind) {
    case 'assay':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 space-y-2.5">
          <div className="flex justify-between font-data text-xs">
            <span className="text-[var(--gold-bright)]">Net Gold: 4.20 g (87.5%)</span>
            <span className="text-[var(--ink-dark-3)]">Stones: 0.60 g</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#360609] overflow-hidden flex gap-0.5">
            <div className="h-full w-[87.5%] rounded-l-full bg-gradient-to-r from-[#c7983e] to-[#f7dfa3]" />
            <div className="h-full w-[12.5%] rounded-r-full bg-[#8b141b]" />
          </div>
        </div>
      );
    case 'pin':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {['4', '8', '2', '9'].map((d, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center w-8 h-9 rounded-lg bg-[#2b0608] border border-[rgba(247,223,163,0.38)] font-data text-sm text-[var(--gold-bright)]"
              >
                {d}
              </span>
            ))}
          </div>
          <span className="font-data text-xs text-[var(--ok-dark)]">✓ Sealed in 8s</span>
        </div>
      );
    case 'vault':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 space-y-1.5 font-data text-xs">
          <div className="flex justify-between text-[var(--ink-dark-1)]">
            <span>Serendib · 18K Bangle</span>
            <span className="text-[var(--ok-dark)]">Verified</span>
          </div>
          <div className="flex justify-between text-[var(--ink-dark-2)]">
            <span>Home Safe · 22K Pair</span>
            <span className="text-[var(--gold-bright)]">Day-1 Log</span>
          </div>
        </div>
      );
    case 'cbsl':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 flex items-center justify-between">
          <div>
            <span className="font-data text-xs text-[var(--ink-dark-3)] block">CBSL 22K / Sovereign</span>
            <span className="font-data text-sm text-[var(--gold-bright)]">LKR 293,120</span>
          </div>
          <svg viewBox="0 0 96 32" className="w-24 h-8" fill="none" aria-hidden="true">
            <path
              d="M2 26 L22 21 L42 23 L62 13 L80 15 L94 5"
              stroke="#f7dfa3"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case 'qr':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 flex items-center justify-between font-data text-xs">
          <span className="text-[var(--gold-bright)]">TOKEN · CP-1459</span>
          <span className="px-2.5 py-1 rounded-full bg-[#103827] text-[var(--ok-dark)]">
            14:59 Active
          </span>
        </div>
      );
    case 'lineage':
      return (
        <div className="rounded-2xl bg-[#140203]/85 border border-[rgba(247,223,163,0.18)] p-4 flex items-center justify-between font-data text-xs">
          <span className="text-[var(--ink-dark-2)]">20.05g Bangles</span>
          <span className="text-[var(--gold-bright)]">──►</span>
          <span className="text-[var(--ok-dark)]">Bridal Necklace</span>
        </div>
      );
  }
};

export const ProvenanceLoopTrack: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const metroFillRef = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const getScrollWidth = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

        gsap.to(track, {
          x: () => -getScrollWidth(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(1400, getScrollWidth())}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (metroFillRef.current) {
                metroFillRef.current.style.transform = `scaleX(${self.progress.toFixed(3)})`;
              }
              const idx = Math.min(
                PROVENANCE_PHASES.length - 1,
                Math.floor(self.progress * PROVENANCE_PHASES.length)
              );
              setActiveStation(idx);
            },
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="loop-heading"
      className="surface-ruby assay-grid-dark relative py-20 lg:py-0 lg:min-h-screen flex flex-col justify-center overflow-hidden border-t border-[#47090d]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-10">
        {/* Header + Self-Drawing 22K Gold Metro Line */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="font-data text-xs text-[var(--gold-bright)] uppercase tracking-[0.1em]">
                02 · Six-Stage Provenance Lifecycle
              </p>
              <h2 id="loop-heading" className="heading-section text-[var(--ink-dark-1)]">
                From showroom counter to <GoldSweepText>generational heirloom</GoldSweepText>.
              </h2>
            </div>
            <p className="text-sm font-medium text-[var(--ink-dark-2)] max-w-xs">
              Scroll to trace how every gram stays sealed, private, and verifiable across decades.
            </p>
          </div>

          {/* Desktop Metro Track Bar */}
          <div className="hidden lg:block space-y-2.5 pt-1">
            <div className="relative h-[2px] w-full bg-[rgba(247,223,163,0.16)] rounded-full overflow-hidden">
              <div
                ref={metroFillRef}
                style={{ transform: 'scaleX(0.16)' }}
                className="h-full w-full origin-left bg-gradient-to-r from-[#c7983e] via-[#f7dfa3] to-[#fff8e6]"
              />
            </div>
            <div className="grid grid-cols-6 gap-2">
              {PROVENANCE_PHASES.map((p, idx) => {
                const lit = idx <= activeStation;
                return (
                  <div key={p.num} className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                        lit
                          ? 'bg-[var(--gold-bright)] shadow-[0_0_10px_rgba(247,223,163,0.8)]'
                          : 'bg-[#4d0d13]'
                      }`}
                    />
                    <span
                      className={`font-data text-xs transition-colors duration-200 ${
                        lit ? 'text-[var(--gold-bright)]' : 'text-[var(--ink-dark-3)]'
                      }`}
                    >
                      {p.num} · {p.station}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Scrubbed Track / Mobile Vertical Stack */}
      <div className="mt-8 lg:mt-10 px-4 sm:px-6 lg:px-12">
        <div
          ref={trackRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:flex gap-5 lg:gap-6 lg:w-max will-change-transform"
        >
          {PROVENANCE_PHASES.map((phase) => (
            <Glass
              key={phase.num}
              variant="card"
              refract
              className="lg:w-[410px] p-6 sm:p-7 flex flex-col justify-between gap-6 shrink-0"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[rgba(247,223,163,0.14)]">
                  <span className="font-data text-xs text-[var(--gold-bright)]">
                    PHASE {phase.num}
                  </span>
                  <span className="font-data text-xs text-[var(--ink-dark-3)]">{phase.metric}</span>
                </div>

                <h3 className="heading-card text-xl sm:text-2xl text-[var(--ink-dark-1)]">
                  {phase.title}
                </h3>

                <p className="text-sm text-[var(--ink-dark-2)] leading-relaxed">{phase.action}</p>
                <p className="text-xs font-medium text-[var(--gold-bright)]/90 leading-relaxed">
                  {phase.outcome}
                </p>
              </div>

              <PhaseMiniVisual kind={phase.animKind} />
            </Glass>
          ))}
        </div>
      </div>
    </section>
  );
};
