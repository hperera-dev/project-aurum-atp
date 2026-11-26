'use client';

import React from 'react';
import { Check, Eye } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';
import { HeroRedEditorialStage } from './HeroRedEditorialStage';
import { MagneticCTA } from './MagneticCTA';

interface HeroVaultStageProps {
  onOpenPassport: (item: VaultItem) => void;
  onOpenPilot: () => void;
}

const TRUST_SIGNALS = [
  'PostgreSQL RLS isolated',
  'AES-256 VAT invoices',
  'Free Colombo pilot',
];

export const HeroVaultStage: React.FC<HeroVaultStageProps> = ({
  onOpenPassport,
  onOpenPilot,
}) => (
  <section
    id="top"
    aria-labelledby="hero-title"
    className="surface-dark relative min-h-[100svh] flex flex-col justify-end pt-[22rem] sm:pt-[25rem] md:pt-32 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
  >
    <HeroRedEditorialStage />

    <div className="relative z-10 mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
        <div className="lg:col-span-7 space-y-5 md:space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#3b080b]/85 border border-[rgba(247,223,163,0.3)] px-3.5 py-1.5 font-data text-xs text-[var(--gold-bright)] backdrop-blur-sm">
            Digital Jewellery Passport · Sri Lanka
          </p>

          <h1
            id="hero-title"
            className="heading-hero text-[var(--ink-dark-1)] max-w-[15ch] [text-shadow:0_2px_22px_rgba(18,2,3,0.85)]"
          >
            Never lose a <span className="text-[var(--gold-bright)]">gram of proof</span>—from the
            showroom counter to the next generation.
          </h1>

          <p className="text-sm sm:text-base md:text-lg font-medium text-[var(--ink-dark-2)] max-w-[44ch] leading-relaxed">
            Sri Lanka’s private digital gold vault. Exact 22K &amp; 18K net gold weight sealed in 8
            seconds at checkout—zero faded receipts, zero home addresses, zero rival visibility.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <MagneticCTA onClick={onOpenPilot} variant="gold" className="w-full sm:w-auto">
              Join the Free Colombo Pilot
            </MagneticCTA>

            <button
              type="button"
              onClick={() => onOpenPassport(HERO_VAULT_ITEMS[0])}
              className="btn-ghost-dark w-full sm:w-auto"
            >
              <Eye size={18} className="text-[var(--gold-bright)]" />
              <span>Inspect Live Passport</span>
            </button>
          </div>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-[var(--ink-dark-2)]">
            {TRUST_SIGNALS.map((label) => (
              <li key={label} className="inline-flex items-center gap-1.5">
                <Check
                  size={14}
                  weight="bold"
                  className="text-[var(--gold-bright)] shrink-0"
                  aria-hidden="true"
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end pt-2 lg:pt-0">
          <div className="text-left lg:text-right space-y-0.5">
            <p className="font-data text-xs text-[var(--gold-bright)]">AUR · 0842 · 6190</p>
            <p className="text-xs font-medium text-[var(--ink-dark-2)]">
              0 home addresses · PostgreSQL RLS isolated
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
