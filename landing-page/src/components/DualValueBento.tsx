'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Vault,
  Scales,
  GitBranch,
  ShieldCheck,
  LockKey,
  ClockCountdown,
  Scan,
  DeviceTabletCamera,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { BUYER_BENEFITS, SHOWROOM_BENEFITS, BentoBenefit } from '../data/aurumData';
import { TiltSpotlightCard } from './TiltSpotlightCard';

const renderBenefitIcon = (name: BentoBenefit['iconName']) => {
  const props = { size: 22, weight: 'light' as const, 'aria-hidden': true };
  switch (name) {
    case 'safe':
      return <Vault {...props} />;
    case 'scales':
      return <Scales {...props} />;
    case 'lineage':
      return <GitBranch {...props} />;
    case 'shield':
      return <ShieldCheck {...props} />;
    case 'lock':
      return <LockKey {...props} />;
    case 'timer':
      return <ClockCountdown {...props} />;
    case 'scan':
      return <Scan {...props} />;
    case 'device':
      return <DeviceTabletCamera {...props} />;
  }
};

interface DualValueBentoProps {
  onOpenArchitecture: () => void;
}

export const DualValueBento: React.FC<DualValueBentoProps> = ({ onOpenArchitecture }) => {
  const prefersReduced = useReducedMotion();
  const [persona, setPersona] = useState<'buyers' | 'showrooms'>('buyers');
  const activeBenefits = persona === 'buyers' ? BUYER_BENEFITS : SHOWROOM_BENEFITS;

  return (
    <section
      id="value"
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2.5 max-w-3xl">
            <p className="font-data text-xs text-[var(--gold-300)]">
              DUAL-SIDED ARCHITECTURE · BUYER VAULT &amp; SHOWROOM LOCK-IN
            </p>
            <h2 className="heading-section text-[var(--ink-1)]">
              Families keep every piece in one lifetime vault, while showrooms lock in repeat buyers
              without leaking a single sale.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Choose perspective between families and retail showrooms"
            className="inline-flex p-1.5 rounded-full bg-[var(--velvet-900)] border border-[var(--velvet-700)] self-start lg:self-auto shrink-0"
          >
            {[
              { id: 'buyers' as const, label: 'For Families & Buyers' },
              { id: 'showrooms' as const, label: 'For Retail Showrooms' },
            ].map((tab) => {
              const isSelected = persona === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setPersona(tab.id)}
                  className={`relative z-10 min-h-[44px] px-4 sm:px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-150 ${isSelected
                      ? 'text-[var(--velvet-950)]'
                      : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'
                    }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="persona-pill"
                      transition={
                        prefersReduced
                          ? { duration: 0 }
                          : { type: 'spring', duration: 0.42, bounce: 0 }
                      }
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--gold-400)]"
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={persona}
            id={`panel-${persona}`}
            role="tabpanel"
            aria-labelledby={`tab-${persona}`}
            initial={prefersReduced ? false : { opacity: 0.88, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0.88, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            {activeBenefits.map((item, idx) => (
              <div
                key={item.id}
                className={item.span === 'wide' ? 'lg:col-span-7' : 'lg:col-span-5'}
              >
                <TiltSpotlightCard
                  beam={idx === 0}
                  maxTilt={5}
                  className="h-full"
                  innerClassName="p-6 sm:p-8 flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-data text-xs font-medium text-[var(--gold-300)]">
                        {item.kicker}
                      </span>
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] text-[var(--gold-300)] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                        {renderBenefitIcon(item.iconName)}
                      </span>
                    </div>

                    <h3 className="heading-card text-[var(--ink-1)]">{item.title}</h3>
                    <p className="text-sm sm:text-base text-[var(--ink-2)] leading-relaxed">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[var(--velvet-850)] flex flex-wrap items-center justify-between gap-2">
                    <span className="font-data text-xs font-medium text-[var(--status-ok)]">
                      {item.metric}
                    </span>

                    <button
                      type="button"
                      onClick={onOpenArchitecture}
                      className="inline-flex items-center gap-1 font-data text-xs text-[var(--ink-2)] hover:text-[var(--gold-300)] cursor-pointer transition-colors min-h-[44px] px-2 -mr-2"
                    >
                      <span>Inspect Spec</span>
                      <ArrowUpRight
                        size={14}
                        weight="light"
                        className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  </div>
                </TiltSpotlightCard>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
