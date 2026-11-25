'use client';

import React, { useState } from 'react';
import { Eye, Pause, Play } from '@phosphor-icons/react';
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
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="surface-dark relative min-h-[100svh] flex flex-col justify-end pt-28 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-10 overflow-hidden"
    >
      {/* 4-Layer Interactive Renaissance Portrait + Blended Mountains + Cursor Eyes + Glittering Gems */}
      <HeirloomPortraitCinema paused={paused} />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left: Breathable, High-Contrast Sentient Headline */}
          <div className="lg:col-span-7 space-y-6">
            <h1 id="hero-title" className="heading-hero text-[var(--ink-dark-1)] max-w-[15ch]">
              Never lose a <span className="text-[var(--gold-bright)]">gram of proof</span>—from
              the showroom counter to the next generation.
            </h1>

            <p className="text-base sm:text-lg font-medium text-[var(--ink-dark-2)] max-w-[42ch] leading-relaxed">
              Sri Lanka’s private digital gold vault. Exact 22K net weight sealed in 8 seconds—zero
              home addresses, zero rival visibility.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <MagneticCTA onClick={onOpenPilot} variant="gold">
                Join the Free Colombo Pilot
              </MagneticCTA>

              <button
                type="button"
                onClick={() => onOpenPassport(HERO_VAULT_ITEMS[0])}
                className="btn-ghost-dark"
              >
                <Eye size={18} weight="regular" className="text-[var(--gold-bright)]" />
                <span>Inspect Live Passport</span>
              </button>
            </div>
          </div>

          {/* Right Corner: Specimen & Pause Toggle */}
          <div className="lg:col-span-5 flex items-end justify-between lg:justify-end gap-4">
            <div className="text-left lg:text-right space-y-0.5">
              <p className="font-data text-xs text-[var(--gold-bright)]">AUR · 0842 · 6190</p>
              <p className="text-xs font-medium text-[var(--ink-dark-2)]">
                Move cursor to interact · 0 home addresses stored
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={
                paused ? 'Resume portrait eye tracking and gem glitter' : 'Pause portrait effects'
              }
              aria-pressed={paused}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[rgba(46,6,13,0.78)] hover:bg-[var(--obsidian-850)] border border-[rgba(247,223,158,0.34)] text-[var(--ink-dark-1)] cursor-pointer transition-colors shrink-0"
            >
              {paused ? <Play size={16} weight="fill" /> : <Pause size={16} weight="fill" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
