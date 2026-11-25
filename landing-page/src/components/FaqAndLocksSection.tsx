'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown, HouseLine, Coins, KeyReturn } from '@phosphor-icons/react';
import { SKEPTIC_FAQS } from '../data/aurumData';

export const FaqAndLocksSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(SKEPTIC_FAQS[0].id);

  return (
    <section
      id="faq"
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="border-beam-card">
            <div className="bezel-core-velvet p-6 sm:p-8 space-y-6">
              <div>
                <p className="font-data text-xs text-[var(--gold-300)] mb-2">
                  ARCHITECTURAL SAFETY GUARANTEES
                </p>
                <h2 className="heading-card text-xl sm:text-2xl text-[var(--ink-1)]">
                  Engineered so a stolen shop tablet, a lost phone, or a server breach can never
                  build a “burglar’s map”.
                </h2>
              </div>

              <ul className="space-y-5 pt-3 border-t border-[var(--velvet-850)]">
                <li className="flex items-start gap-3.5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] text-[var(--gold-300)] shrink-0">
                    <HouseLine size={20} weight="light" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink-1)]">
                      Zero Home Street Addresses
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
                      Our PostgreSQL schema contains literally <span className="font-data">0</span>{' '}
                      columns for residential addresses, postal codes, or GPS coordinates.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] text-[var(--gold-300)] shrink-0">
                    <Coins size={20} weight="light" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink-1)]">
                      On-Device Rupee Privacy
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
                      Only physical gram weights and purity are stored; live LKR portfolio totals
                      are multiplied privately on your own handset.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3.5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] text-[var(--gold-300)] shrink-0">
                    <KeyReturn size={20} weight="light" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--ink-1)]">
                      In-Showroom Physical Recovery
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
                      Showroom screens stay masked after checkout, while 3-layer recovery restores
                      access in person at the issuing showroom holding your physical gold.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right 7 Columns — Silky Smooth Animated FAQ Accordion */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <p className="font-data text-xs text-[var(--gold-300)] mb-2">
              OBJECTION &amp; SECURITY AUDIT · FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="heading-section text-[var(--ink-1)]">
              Straight answers to the hardest questions from families and showroom owners
            </h2>
          </div>

          <div className="space-y-3">
            {SKEPTIC_FAQS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`velvet-glass-panel rounded-2xl overflow-hidden ${isOpen ? 'border-[oklch(79%_0.112_80.5/0.6)]' : ''
                    }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 min-h-[58px] p-5 sm:px-6 cursor-pointer text-left font-semibold text-sm sm:text-base text-[var(--ink-1)] hover:text-[var(--gold-300)] transition-colors"
                  >
                    <span>{item.question}</span>
                    <CaretDown
                      size={18}
                      weight="regular"
                      aria-hidden="true"
                      className={`shrink-0 text-[var(--gold-300)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${item.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 text-sm sm:text-base text-[var(--ink-2)] leading-relaxed border-t border-[var(--velvet-850)]">
                          {item.answer}
                        </div>
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
