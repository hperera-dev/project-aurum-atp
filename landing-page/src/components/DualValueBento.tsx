'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database } from '@phosphor-icons/react';
import { BUYER_BENEFITS, SHOWROOM_BENEFITS } from '../data/aurumData';

interface DualValueBentoProps {
  onOpenArchitecture: () => void;
}

export const DualValueBento: React.FC<DualValueBentoProps> = ({ onOpenArchitecture }) => {
  const [audience, setAudience] = useState<'families' | 'showrooms'>('families');
  const items = audience === 'families' ? BUYER_BENEFITS : SHOWROOM_BENEFITS;

  return (
    <section
      id="value"
      aria-labelledby="value-heading"
      className="bg-[var(--paper-pure)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Clean Header + Audience Switch */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
              Built for Both Sides of the Counter
            </p>
            <h2 id="value-heading" className="heading-section text-[var(--ink-light-1)]">
              {audience === 'families'
                ? 'One calm family vault across every trusted jeweller.'
                : 'Lifetime buyer retention with zero competitor leakage.'}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Choose audience benefits"
            className="inline-flex p-1 rounded-full bg-[var(--paper-stone)] border border-[var(--hairline-light)] self-start lg:self-auto"
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
                    active ? 'text-white' : 'text-[var(--ink-light-2)] hover:text-[var(--ink-light-1)]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="audience-pill"
                      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                      className="absolute inset-0 rounded-full bg-[var(--ink-light-1)]"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Ruled Editorial Index (Zero noisy 16-box grid!) */}
        <div className="border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="editorial-row grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-8 px-2 sm:px-4 items-baseline"
            >
              <div className="md:col-span-1 font-data text-xs font-medium text-[var(--bronze-ink)]">
                0{idx + 1}
              </div>

              <div className="md:col-span-4 space-y-1">
                <span className="font-data text-xs text-[var(--ink-light-3)] block">
                  {item.kicker}
                </span>
                <h3 className="heading-card text-[var(--ink-light-1)]">{item.title}</h3>
              </div>

              <p className="md:col-span-5 text-sm sm:text-base text-[var(--ink-light-2)] leading-relaxed">
                {item.body}
              </p>

              <div className="md:col-span-2 md:text-right">
                <span className="inline-block font-data text-xs text-[var(--bronze-ink)] bg-[var(--bronze-soft)] px-2.5 py-1 rounded-md">
                  {item.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Single Quiet Technical Action */}
        {audience === 'showrooms' && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="btn-ghost-light"
            >
              <Database size={16} weight="regular" className="text-[var(--bronze-ink)]" />
              <span>Inspect PostgreSQL RLS Isolation Policy</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
