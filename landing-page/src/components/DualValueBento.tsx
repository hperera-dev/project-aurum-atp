'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Database } from '@phosphor-icons/react';

interface DualValueBentoProps {
  onOpenArchitecture: () => void;
}

const MANIFESTO_WORDS =
  'One private vault across every showroom. Zero home addresses. Zero rival access.'.split(' ');

const COMPACT_FAMILIES = [
  {
    num: '01',
    title: 'Log existing home heirlooms on Day 1',
    note: 'Track bank-locker bangles alongside verified showroom pieces.',
    tag: 'Day-1 Utility',
  },
  {
    num: '02',
    title: 'Keep full own-gold trade-in weight',
    note: 'Separated 4.80 g gross / 4.20 g net proof stops 2%–5% cutting.',
    tag: '0.001 g Net',
  },
  {
    num: '03',
    title: 'Unbroken mother-to-daughter lineage',
    note: 'Melted heirlooms link permanently as Parent → Child bridal records.',
    tag: 'Provenance DAG',
  },
  {
    num: '04',
    title: '10-second police & insurance dossier',
    note: 'AES-256 original VAT invoice PDFs outlast fading thermal bills.',
    tag: 'AES-256 Sealed',
  },
];

const COMPACT_SHOWROOMS = [
  {
    num: '01',
    title: 'Zero competitor poaching',
    note: 'PostgreSQL RLS blocks rivals mathematically—buyers return to you.',
    tag: 'HTTP 403 Lock',
  },
  {
    num: '02',
    title: '2-minute bridal trade-ins',
    note: 'Read original net gold weight instantly without scraping stones.',
    tag: 'Zero Scraping',
  },
  {
    num: '03',
    title: 'Stop warranty swaps & 0.25 g shaving',
    note: '±1.5% natural wear weight gates catch lookalikes and workshop theft.',
    tag: '±1.5% Gate',
  },
  {
    num: '04',
    title: '8-second checkout beside your ERP',
    note: 'Live PIN, surprise gift SMS, bridal batches, and Nokia button phones.',
    tag: '4 POS Modes',
  },
];

export const DualValueBento: React.FC<DualValueBentoProps> = ({ onOpenArchitecture }) => {
  const [audience, setAudience] = useState<'families' | 'showrooms'>('families');
  const [litCount, setLitCount] = useState(MANIFESTO_WORDS.length);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let prev = MANIFESTO_WORDS.length;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (vh * 0.57)));
      const next = Math.max(2, Math.round(progress * MANIFESTO_WORDS.length));
      if (next !== prev) {
        prev = next;
        setLitCount(next);
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const rows = audience === 'families' ? COMPACT_FAMILIES : COMPACT_SHOWROOMS;

  return (
    <section
      id="value"
      aria-labelledby="manifesto-heading"
      className="bg-[var(--paper-pure)] text-[var(--ink-light-1)] py-28 md:py-36 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-20">
        <div ref={manifestoRef} className="max-w-5xl">
          <h2 id="manifesto-heading" className="heading-manifesto">
            {MANIFESTO_WORDS.map((word, idx) => (
              <span
                key={`${word}-${idx}`}
                className={`inline-block mr-[0.26em] transition-colors duration-300 ${
                  idx < litCount
                    ? word === 'private' || word === 'Zero'
                      ? 'text-[#7d1117]'
                      : 'text-[var(--ink-light-1)]'
                    : 'text-[#8c7075]'
                }`}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Choose audience benefits"
              className="inline-flex p-1 rounded-full bg-[var(--paper-stone)] border border-[var(--hairline-light)]"
            >
              {(
                [
                  { id: 'families', label: 'For Families' },
                  { id: 'showrooms', label: 'For Showrooms' },
                ] as const
              ).map((tab) => {
                const active = audience === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setAudience(tab.id)}
                    className={`relative min-h-[44px] px-5 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-150 ${
                      active
                        ? 'text-white'
                        : 'text-[var(--ink-light-2)] hover:text-[var(--ink-light-1)]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="audience-pill"
                        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                        className="absolute inset-0 rounded-full bg-[#430a0e]"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {audience === 'showrooms' && (
              <button type="button" onClick={onOpenArchitecture} className="btn-ghost-light">
                <Database size={16} className="text-[var(--bronze-ink)]" />
                <span>Inspect SQL RLS Policy</span>
              </button>
            )}
          </div>

          <div className="border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
            {rows.map((item) => (
              <div
                key={item.num + item.title}
                className="editorial-row grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 py-6 px-2 sm:px-3 items-baseline"
              >
                <span className="md:col-span-1 font-data text-xs font-medium text-[#8b141b]">
                  {item.num}
                </span>
                <h3 className="md:col-span-4 heading-card text-[var(--ink-light-1)]">
                  {item.title}
                </h3>
                <p className="md:col-span-5 text-sm sm:text-base text-[var(--ink-light-2)] font-medium">
                  {item.note}
                </p>
                <div className="md:col-span-2 md:text-right">
                  <span className="font-data text-xs font-medium text-[var(--bronze-ink)]">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
