'use client';

import React from 'react';
import { Eye } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';

interface HowItWorksSectionProps {
  onOpenPassport: (item: VaultItem) => void;
}

const COMPACT_STEPS = [
  {
    num: '01',
    title: 'Seal in 8 seconds',
    body: 'Showrooms scan their normal tag—sending a live 4-digit PIN, surprise gift SMS, or button-phone receipt.',
  },
  {
    num: '02',
    title: 'Hold in one vault',
    body: 'Retailer-verified purchases and Day-1 home heirlooms sit together with private on-device LKR valuation.',
  },
  {
    num: '03',
    title: 'Upgrade or pass down',
    body: 'Return decades later for weight-audited polishing, full trade-in credit, or Parent → Child melting lineage.',
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onOpenPassport }) => {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 id="how-heading" className="heading-section text-[var(--ink-light-1)] max-w-xl">
            From showroom counter to <span className="text-[#7d1117]">heirloom</span> in three
            beats.
          </h2>

          <button
            type="button"
            onClick={() => onOpenPassport(HERO_VAULT_ITEMS[0])}
            className="btn-ghost-light self-start md:self-auto"
          >
            <Eye size={16} weight="regular" className="text-[#8b141b]" />
            <span>Open Live Passport</span>
          </button>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {COMPACT_STEPS.map((step) => (
            <li key={step.num} className="border-t border-[#430a0e] pt-5 space-y-2.5">
              <span className="font-data text-xs font-medium text-[#8b141b] block">{step.num}</span>
              <h3 className="heading-card text-[var(--ink-light-1)]">{step.title}</h3>
              <p className="text-sm sm:text-base font-medium text-[var(--ink-light-2)] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
