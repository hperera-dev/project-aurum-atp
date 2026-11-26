'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import { SKEPTIC_FAQS } from '../data/aurumData';

export const FaqAndLocksSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] pb-24 md:pb-28 pt-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl border-t border-[var(--hairline-light)] pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-3">
            <h2 id="faq-heading" className="heading-section text-[var(--ink-light-1)]">
              Hard <span className="text-[#7d1117]">questions</span>, answered.
            </h2>
            <p className="text-sm font-medium text-[var(--ink-light-2)]">
              Tap any question to inspect our privacy, soft-gold recovery, and button-phone rules.
            </p>
          </div>

          <div className="lg:col-span-8 border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
            {SKEPTIC_FAQS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="w-full py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-base font-semibold text-[var(--ink-light-1)] group-hover:text-[#7d1117] transition-colors">
                        {item.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--hairline-light)] bg-[var(--paper-pure)] text-[var(--ink-light-1)] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-45 bg-[#430a0e] text-white border-[#430a0e]' : ''
                        }`}
                      >
                        <Plus size={14} weight="regular" />
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
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
    </section>
  );
};
