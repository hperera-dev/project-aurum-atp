'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, Plus } from '@phosphor-icons/react';
import {
  FAMILY_BENEFITS,
  SHOWROOM_BENEFITS,
  SKEPTIC_FAQS,
} from '../../content/aurumContent';
import { SplitReveal } from '../motion/SplitReveal';

interface DualAudienceAndFaqSectionProps {
  onOpenArchitecture: () => void;
}

export const DualAudienceAndFaqSection: React.FC<DualAudienceAndFaqSectionProps> = ({
  onOpenArchitecture,
}) => {
  const [hoveredPanel, setHoveredPanel] = useState<'families' | 'showrooms' | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  return (
    <section
      id="value"
      aria-labelledby="dual-heading"
      className="surface-light bg-[var(--paper-1)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-24">
        {/* Dual Audience Side-by-Side Panels with Hover Sibling Dim */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="font-data text-xs text-[#8b141b] uppercase tracking-[0.1em]">
                06 · Two Sides of Every Counter
              </p>
              <SplitReveal
                as="h2"
                id="dual-heading"
                scrollTrigger
                text="One private vault for families. Lifetime retention for showrooms."
                className="heading-section text-[var(--ink-light-1)]"
              />
            </div>

            <button
              type="button"
              data-cursor="Inspect"
              onClick={onOpenArchitecture}
              className="btn-ghost-light self-start md:self-auto"
            >
              <Database size={16} className="text-[var(--bronze-ink)]" />
              <span>Inspect SQL RLS Policy</span>
            </button>
          </div>

          <div
            onMouseLeave={() => setHoveredPanel(null)}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Families Panel */}
            <div
              onMouseEnter={() => setHoveredPanel('families')}
              className={`rounded-[2rem] bg-white border border-[var(--hairline-light)] p-7 sm:p-9 shadow-[0_20px_50px_-24px_rgba(48,8,12,0.12)] transition-opacity duration-200 ${
                hoveredPanel === 'showrooms' ? 'lg:opacity-75' : 'opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-[var(--hairline-light)]">
                <div>
                  <span className="font-data text-xs text-[#8b141b] block">FOR BUYERS &amp; FAMILIES</span>
                  <h3 className="font-display text-2xl text-[var(--ink-light-1)] mt-1">
                    Cross-Shop Biometric Vault
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[var(--paper-2)] font-data text-xs text-[var(--ink-light-2)]">
                  Free Day-1
                </span>
              </div>

              <div className="divide-y divide-[var(--hairline-light)] mt-2">
                {FAMILY_BENEFITS.map((b) => (
                  <div key={b.num} className="py-4 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-base font-semibold text-[var(--ink-light-1)]">
                        <span className="font-data text-xs text-[#8b141b] mr-2">{b.num}</span>
                        {b.title}
                      </h4>
                      <span className="font-data text-xs text-[var(--bronze-ink)] shrink-0">
                        {b.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink-light-2)] leading-relaxed">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Showrooms Panel */}
            <div
              onMouseEnter={() => setHoveredPanel('showrooms')}
              className={`rounded-[2rem] surface-ruby border border-[#590e13] p-7 sm:p-9 shadow-[0_24px_60px_-24px_rgba(26,3,4,0.5)] transition-opacity duration-200 ${
                hoveredPanel === 'families' ? 'lg:opacity-75' : 'opacity-100'
              }`}
            >
              <div className="flex items-center justify-between gap-3 pb-5 border-b border-[rgba(247,223,163,0.16)]">
                <div>
                  <span className="font-data text-xs text-[var(--gold-bright)] block">
                    FOR RETAIL JEWELLERS
                  </span>
                  <h3 className="font-display text-2xl text-[var(--ink-dark-1)] mt-1">
                    Isolated Showroom Registry
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#3d090c] border border-[rgba(247,223,163,0.3)] font-data text-xs text-[var(--gold-bright)]">
                  Zero Poaching
                </span>
              </div>

              <div className="divide-y divide-[rgba(247,223,163,0.12)] mt-2">
                {SHOWROOM_BENEFITS.map((b) => (
                  <div key={b.num} className="py-4 space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-base font-semibold text-[var(--ink-dark-1)]">
                        <span className="font-data text-xs text-[var(--gold-bright)] mr-2">
                          {b.num}
                        </span>
                        {b.title}
                      </h4>
                      <span className="font-data text-xs text-[var(--gold-bright)] shrink-0">
                        {b.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--ink-dark-2)] leading-relaxed">{b.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skeptic FAQ Accordion */}
        <div id="faq" className="border-t border-[var(--hairline-light)] pt-16 md:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 space-y-3">
              <p className="font-data text-xs text-[#8b141b] uppercase tracking-[0.1em]">
                07 · Skeptic Guarantees
              </p>
              <h2 className="heading-section text-[var(--ink-light-1)]">
                Hard <span className="text-[#7d1117]">questions</span>, answered.
              </h2>
              <p className="text-sm font-medium text-[var(--ink-light-2)]">
                Inspect our zero-address schema, soft-gold wear recovery, and Nokia button-phone
                support.
              </p>
            </div>

            <div className="lg:col-span-8 border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
              {SKEPTIC_FAQS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <div key={item.id}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                        aria-expanded={isOpen}
                        aria-controls={`v3-faq-${item.id}`}
                        className="w-full py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                      >
                        <span className="text-base font-semibold text-[var(--ink-light-1)] group-hover:text-[#7d1117] transition-colors">
                          {item.question}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--hairline-light)] bg-white text-[var(--ink-light-1)] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-45 bg-[#430a0e] text-white border-[#430a0e]' : ''
                          }`}
                        >
                          <Plus size={14} />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`v3-faq-${item.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="pb-5 pr-10 text-sm sm:text-base text-[var(--ink-light-2)] leading-relaxed">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
