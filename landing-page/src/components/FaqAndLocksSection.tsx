'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockSimple, Plus, Scales, ShieldCheck } from '@phosphor-icons/react';
import { SKEPTIC_FAQS } from '../data/aurumData';

const ARCHITECTURAL_LOCKS = [
  {
    icon: ShieldCheck,
    title: 'Zero residential addresses stored',
    body: 'No street address, postal code, or GPS coordinate column exists anywhere in the database.',
  },
  {
    icon: LockSimple,
    title: 'On-device LKR valuation',
    body: 'Rupee metal value is multiplied privately on your handset—never logged to public tables.',
  },
  {
    icon: Scales,
    title: 'Physical showroom recovery',
    body: 'If a soft 22K surface mark ever fades, the issuing showroom relinks via ±1.5% weight audit.',
  },
];

export const FaqAndLocksSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(SKEPTIC_FAQS[0].id);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] pb-24 md:pb-32 pt-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl border-t border-[var(--hairline-light)] pt-20 md:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Sticky Column: Straight Answers + 3 Architectural Locks */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            <div className="space-y-3">
              <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
                Security, Privacy &amp; Edge Cases
              </p>
              <h2 id="faq-heading" className="heading-section text-[var(--ink-light-1)]">
                Straight answers to every hard question.
              </h2>
            </div>

            <div className="rounded-2xl bg-[var(--paper-pure)] border border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)] shadow-[0_12px_30px_-16px_rgba(9,23,17,0.08)]">
              {ARCHITECTURAL_LOCKS.map((lock) => {
                const Icon = lock.icon;
                return (
                  <div key={lock.title} className="p-5 flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-light)] text-[var(--bronze-ink)] shrink-0 mt-0.5"
                    >
                      <Icon size={18} weight="regular" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--ink-light-1)]">
                        {lock.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--ink-light-2)] mt-0.5 leading-relaxed">
                        {lock.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Clean Ruled 7-Question Accordion */}
          <div className="lg:col-span-7 border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
            {SKEPTIC_FAQS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className="py-1">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="w-full py-5 flex items-start justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-base sm:text-lg font-medium text-[var(--ink-light-1)] group-hover:text-[var(--bronze-ink)] transition-colors">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--hairline-light)] bg-[var(--paper-pure)] text-[var(--ink-light-1)] shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-45 bg-[var(--ink-light-1)] text-white border-[var(--ink-light-1)]' : ''
                          }`}
                      >
                        <Plus size={15} weight="regular" />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-10 text-sm sm:text-base text-[var(--ink-light-2)] leading-relaxed">
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
    </section>
  );
};
