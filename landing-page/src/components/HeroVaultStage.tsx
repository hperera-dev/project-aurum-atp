'use client';

import React from 'react';
import { Eye } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';
import { HeirloomPortraitCinema } from './HeirloomPortraitCinema';
import { MagneticCTA } from './MagneticCTA';

interface HeroVaultStageProps {
  onOpenPassport: (item: VaultItem) => void;
  onOpenPilot: () => void;
}

export const HeroVaultStage: React.FC<HeroVaultStageProps> = ({
  onOpenPassport,
  onOpenPilot,
}) => {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="surface-dark relative min-h-[100svh] flex flex-col justify-end pt-[23.5rem] sm:pt-[26rem] md:pt-28 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
    >
      {/* 4-Layer Interactive Renaissance Portrait + Blended Mountains + Binocular Eyes + Glittering Gems */}
      <HeirloomPortraitCinema />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          {/* Left: Breathable, High-Contrast Sentient Headline */}
          <div className="lg:col-span-7 space-y-5 md:space-y-6">
            <h1
              id="hero-title"
              className="heading-hero text-[var(--ink-dark-1)] max-w-[16ch] [text-shadow:0_2px_20px_rgba(16,2,5,0.85)]"
            >
              Never lose a <span className="text-[var(--gold-bright)]">gram of proof</span>—from
              the showroom counter to the next generation.
            </h1>

            <p className="text-sm sm:text-base md:text-lg font-medium text-[var(--ink-dark-2)] max-w-[42ch] leading-relaxed">
              Sri Lanka’s private digital gold vault. Exact 22K net weight sealed in 8 seconds—zero
              home addresses, zero rival visibility.
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
                <Eye size={18} weight="regular" className="text-[var(--gold-bright)]" />
                <span>Inspect Live Passport</span>
              </button>
            </div>
          </div>

          {/* Right Corner: Specimen Caption */}
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
};
