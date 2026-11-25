'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Scan,
  Pause,
  Play,
  ShieldCheck,
  LockKey,
  QrCode,
  Sparkle,
  IdentificationCard,
} from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';
import { MagneticCTA } from './MagneticCTA';
import { AurumBangleCanvas } from './AurumBangleCanvas';
import { ScrambleText } from './ScrambleText';
import { AnimatedNumber } from './AnimatedNumber';

const PIECE_VALUES = [1767880, 1420000, 1185600];

interface HeroVaultStageProps {
  onOpenPassport: (item: VaultItem) => void;
  onOpenPilot: () => void;
  onNotify: (title: string, detail?: string) => void;
}

export const HeroVaultStage: React.FC<HeroVaultStageProps> = ({
  onOpenPassport,
  onOpenPilot,
  onNotify,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scanPulseCount, setScanPulseCount] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAmbientMotion = () => {
    const nextPaused = !motionPaused;
    setMotionPaused(nextPaused);
    if (videoRef.current) {
      if (nextPaused) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
    }
  };

  const activeItem = HERO_VAULT_ITEMS[selectedIndex];

  const handleFireScan = () => {
    setScanPulseCount((c) => c + 1);
    onNotify(
      `10× Laser Assay Scan Complete`,
      `${activeItem.id} verified · ${activeItem.netGrams} Net Gold (${activeItem.karat})`
    );
  };

  return (
    <section
      id="top"
      className="royal-velvet relative pt-28 sm:pt-32 lg:pt-36 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 text-[var(--ink-1)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-25">
        {videoAvailable && (
          <video
            ref={videoRef}
            src="/videos/hero-gold.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoAvailable(false)}
            className="h-full w-full object-cover mix-blend-screen"
          />
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[oklch(20%_0.03_166/0.92)] border border-[oklch(78.5%_0.116_82/0.45)] text-xs sm:text-[13px] font-medium text-[var(--gold-300)] shadow-[0_0_26px_-6px_oklch(78.5%_0.116_82/0.35)]">
            <ShieldCheck size={16} weight="light" aria-hidden="true" />
            <span>Sri Lanka PDPA Aligned · Zero-Knowledge Gold Registry</span>
          </div>

          <h1 className="heading-hero text-[var(--ink-1)]">
            Never lose a gram of proof—from the showroom counter to the next generation.
          </h1>

          <p className="text-base sm:text-lg text-[var(--ink-2)] max-w-[54ch] leading-relaxed">
            In Sri Lanka, 22K gold is a family’s life savings, yet a Rs. 500,000 bangle still leaves
            the showroom backed only by a snipped barcode tag and a fading thermal bill. Project
            AURUM locks exact net gold weight, purity, and your encrypted invoice PDF into one
            private vault across every shop you trust—while keeping each jeweller’s records
            mathematically invisible to rivals.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <MagneticCTA onClick={onOpenPilot}>Join the Free Colombo Pilot</MagneticCTA>
            <button
              type="button"
              onClick={() => onOpenPassport(activeItem)}
              className="btn-secondary-velvet"
            >
              <IdentificationCard size={18} weight="light" className="text-[var(--gold-300)]" />
              <span>Open Live Digital Passport</span>
            </button>
          </div>

          <ul
            aria-label="Core privacy and utility guarantees"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[var(--velvet-750)] text-xs sm:text-[13px] text-[var(--ink-2)]"
          >
            <li className="flex items-start gap-2">
              <Check size={16} weight="regular" className="text-[var(--gold-300)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Log existing home heirlooms on day one</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} weight="regular" className="text-[var(--gold-300)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Zero street-address columns in our database</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} weight="regular" className="text-[var(--gold-300)] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Rival shops receive HTTP 403</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="border-beam-card">
            <div className="bezel-core-velvet relative overflow-hidden">
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 pt-4 pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--velvet-900)] border border-[var(--velvet-700)] font-data text-xs text-[var(--status-ok)]">
                  <LockKey size={13} weight="regular" aria-hidden="true" />
                  Drag 3D Gold · RLS Isolated
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleFireScan}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] hover:-translate-y-0.5 border border-[oklch(85.5%_0.105_83.5/0.55)] text-xs font-medium text-[var(--gold-200)] cursor-pointer transition-transform duration-200"
                  >
                    <Scan size={15} weight="light" aria-hidden="true" />
                    <span>Fire 10× Laser Scan</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleAmbientMotion}
                    aria-pressed={motionPaused}
                    aria-label={motionPaused ? 'Resume 3D stage motion' : 'Pause 3D stage motion'}
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-900)] hover:bg-[var(--velvet-850)] border border-[var(--velvet-700)] text-[var(--ink-2)] cursor-pointer transition-colors"
                  >
                    {motionPaused ? <Play size={15} weight="regular" /> : <Pause size={15} weight="regular" />}
                  </button>
                </div>
              </div>

              <div className="relative h-[300px] sm:h-[360px] lg:h-[375px] w-full">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,oklch(48%_0.088_83/0.24)_0%,oklch(32%_0.06_162/0.22)_40%,transparent_68%)]"
                />

                <AurumBangleCanvas
                  activePieceIndex={selectedIndex}
                  scanPulseCount={scanPulseCount}
                  paused={motionPaused}
                />

                {scanPulseCount > 0 && (
                  <div
                    key={scanPulseCount}
                    aria-hidden="true"
                    className="hud-laser-sweep pointer-events-none absolute inset-x-6 top-0 h-16 bg-[linear-gradient(180deg,transparent,oklch(78.5%_0.142_156/0.35),oklch(78.5%_0.142_156/0.92),transparent)] border-b border-[var(--status-ok)]"
                  />
                )}

                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
                  <div className="rounded-2xl bg-[oklch(14.5%_0.022_166/0.92)] border border-[var(--velvet-700)] px-3.5 py-2.5">
                    <span className="block text-xs text-[var(--ink-3)]">Active Vault Valuation</span>
                    <AnimatedNumber
                      value={PIECE_VALUES[selectedIndex]}
                      prefix="LKR "
                      className="font-data text-base sm:text-lg font-medium text-[var(--ink-1)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenPassport(activeItem)}
                    className="pointer-events-auto rounded-2xl bg-[oklch(14.5%_0.022_166/0.94)] hover:bg-[var(--velvet-850)] hover:-translate-y-0.5 border border-[oklch(78.5%_0.116_82/0.6)] hover:border-[var(--gold-200)] px-3.5 py-2.5 text-right cursor-pointer transition-transform duration-200"
                  >
                    <span className="flex items-center justify-end gap-1.5 font-data text-xs text-[var(--gold-300)]">
                      <QrCode size={14} weight="light" aria-hidden="true" />
                      <ScrambleText text={activeItem.id} />
                    </span>
                    <span className="block font-data text-xs text-[var(--ink-2)] mt-0.5">
                      {activeItem.netGrams} Net · Inspect Passport ↗
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-[var(--velvet-750)] bg-[oklch(17%_0.025_166)]">
                <div className="flex items-center justify-between gap-2 mb-2.5 text-xs">
                  <span className="text-[var(--ink-3)] flex items-center gap-1.5">
                    <Sparkle size={14} weight="light" className="text-[var(--gold-300)]" />
                    Select a vault piece to rotate 3D assay &amp; trigger laser scan
                  </span>
                  <span className="font-data text-[var(--gold-300)] hidden sm:inline">
                    {activeItem.karat}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Inspect family vault pieces in 3D"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                >
                  {HERO_VAULT_ITEMS.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedIndex(idx);
                          setScanPulseCount((c) => c + 1);
                        }}
                        aria-pressed={isSelected}
                        className={`relative rounded-xl p-2.5 text-left cursor-pointer border transition-colors duration-200 min-h-[54px] ${
                          isSelected
                            ? 'bg-[var(--velvet-850)] border-[var(--gold-400)] shadow-[0_0_20px_-6px_oklch(78.5%_0.116_82/0.48)]'
                            : 'bg-[var(--velvet-950)] hover:bg-[var(--velvet-900)] hover:border-[oklch(78.5%_0.116_82/0.5)] border-[var(--velvet-750)]'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="hero-piece-indicator"
                            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--gold-300)]"
                          />
                        )}
                        <span className="block text-xs font-semibold text-[var(--ink-1)] truncate pr-3">
                          {item.issuer}
                        </span>
                        <span className="block font-data text-xs text-[var(--gold-300)] mt-0.5">
                          {item.netGrams} Net · {item.karat.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
