'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Eye, Pause, Play } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';
import { MagneticCTA } from './MagneticCTA';

const AurumBangleCanvas = dynamic(
  () => import('./AurumBangleCanvas').then((m) => m.AurumBangleCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden="true"
        className="w-full h-full flex items-center justify-center"
      >
        <div className="w-40 h-40 rounded-full border-2 border-[oklch(78%_0.114_82/0.35)]" />
      </div>
    ),
  }
);

interface HeroVaultStageProps {
  onOpenPassport: (item: VaultItem) => void;
  onOpenPilot: () => void;
}

export const HeroVaultStage: React.FC<HeroVaultStageProps> = ({
  onOpenPassport,
  onOpenPilot,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeItem = HERO_VAULT_ITEMS[activeIdx];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="surface-dark hero-studio-glow relative min-h-[100svh] flex flex-col justify-center pt-28 pb-20 md:pt-32 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: Clean Editorial Command */}
          <div className="lg:col-span-7 space-y-7">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--gold-bright)]">
              Colombo, Sri Lanka · Digital Jewellery Ownership Vault
            </p>

            <h1 id="hero-title" className="heading-hero text-[var(--ink-dark-1)]">
              Never lose a gram of proof—from the showroom counter to the next generation.
            </h1>

            <p className="text-base sm:text-lg text-[var(--ink-dark-2)] max-w-[48ch] leading-relaxed">
              One private family vault for Sri Lankan 22K gold across every showroom. Lock exact
              net gold weight and encrypted invoices at checkout while keeping competitor records
              mathematically isolated.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <MagneticCTA onClick={onOpenPilot} variant="gold">
                Join the Free Colombo Pilot
              </MagneticCTA>

              <button
                type="button"
                onClick={() => onOpenPassport(activeItem)}
                className="btn-ghost-dark"
              >
                <Eye size={18} weight="regular" className="text-[var(--gold-bright)]" />
                <span>Inspect Live Passport</span>
              </button>
            </div>

            {/* Quiet Architectural Proof Bar (No boxed chips!) */}
            <dl className="grid grid-cols-3 gap-6 pt-6 border-t border-[oklch(28%_0.028_166)] max-w-xl">
              <div>
                <dt className="font-data text-xs text-[var(--ink-dark-3)]">Handover</dt>
                <dd className="font-display text-xl text-[var(--ink-dark-1)] mt-0.5">8 Seconds</dd>
              </div>
              <div>
                <dt className="font-data text-xs text-[var(--ink-dark-3)]">Home Addresses</dt>
                <dd className="font-display text-xl text-[var(--ink-dark-1)] mt-0.5">0 Stored</dd>
              </div>
              <div>
                <dt className="font-data text-xs text-[var(--ink-dark-3)]">Rival Access</dt>
                <dd className="font-display text-xl text-[var(--gold-bright)] mt-0.5">HTTP 403</dd>
              </div>
            </dl>
          </div>

          {/* Right: The ONE Signature 3D Object — Clean Studio Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full h-[360px] sm:h-[430px] lg:h-[470px]">
              <AurumBangleCanvas activePieceIndex={activeIdx} paused={paused} />

              {/* Single Unobtrusive Pause Control (WCAG SC 2.2.2) */}
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Resume 3D bangle rotation' : 'Pause 3D bangle rotation'}
                aria-pressed={paused}
                className="absolute top-2 right-2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-[oklch(19%_0.026_166/0.78)] hover:bg-[var(--obsidian-850)] border border-[oklch(34%_0.032_166)] text-[var(--ink-dark-2)] hover:text-[var(--ink-dark-1)] cursor-pointer transition-colors"
              >
                {paused ? <Play size={16} weight="fill" /> : <Pause size={16} weight="fill" />}
              </button>
            </div>

            {/* Minimal Floating Vault Piece Caption & Switcher */}
            <div className="w-full max-w-sm rounded-2xl bg-[oklch(19%_0.026_166/0.78)] border border-[oklch(30%_0.03_166)] px-4 py-3.5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--ink-dark-1)] truncate">
                    {activeItem.title}
                  </p>
                  <p className="font-data text-xs text-[var(--ink-dark-3)] truncate">
                    {activeItem.id} · {activeItem.karat}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-data text-sm font-medium text-[var(--gold-bright)] block">
                    {activeItem.netGrams} net
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPassport(activeItem)}
                    className="text-xs text-[var(--ink-dark-2)] hover:text-[var(--gold-bright)] underline cursor-pointer"
                  >
                    Open Passport
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Select sample heirloom">
                {HERO_VAULT_ITEMS.map((piece, idx) => {
                  const selected = idx === activeIdx;
                  return (
                    <button
                      key={piece.id}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      aria-pressed={selected}
                      className={`min-h-[36px] px-2 rounded-lg font-data text-xs cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[var(--gold-bullion)] text-[var(--obsidian-950)] font-medium'
                          : 'bg-[var(--obsidian-950)] text-[var(--ink-dark-2)] hover:text-[var(--ink-dark-1)]'
                      }`}
                    >
                      {piece.netGrams}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
