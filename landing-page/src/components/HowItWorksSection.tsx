'use client';

import React from 'react';
import { Eye } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, HOW_IT_WORKS_STEPS, VaultItem } from '../data/aurumData';

interface HowItWorksSectionProps {
  onOpenPassport: (item: VaultItem) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenPassport }) => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
              End-to-End Lifecycle
            </p>
            <h2 id="how-heading" className="heading-section text-[var(--ink-light-1)]">
              Three steps from checkout to generational provenance.
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onOpenPassport(HERO_VAULT_ITEMS[0])}
            className="btn-ghost-light self-start lg:self-auto"
          >
            <Eye size={16} weight="regular" className="text-[var(--bronze-ink)]" />
            <span>Preview Live Digital Passport</span>
          </button>
        </div>

        {/* Clean 3-Column Horizontal Editorial Steps */}
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <li
              key={step.numeral}
              className="border-t-2 border-[var(--ink-light-1)] pt-6 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-data text-xs font-medium text-[var(--bronze-ink)]">
                  STEP {step.numeral}
                </span>
                <span className="font-data text-xs text-[var(--ink-light-3)]">{step.kicker}</span>
              </div>

              <h3 className="heading-card text-[var(--ink-light-1)]">{step.title}</h3>
              <p className="text-sm sm:text-base text-[var(--ink-light-2)] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
