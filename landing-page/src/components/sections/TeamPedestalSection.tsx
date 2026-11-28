'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { TEAM_MEMBERS } from '../../content/aurumContent';
import { SplitReveal } from '../motion/SplitReveal';

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const TeamPedestalSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(TEAM_MEMBERS[0].id);
  const activeMember = TEAM_MEMBERS.find((m) => m.id === activeId) ?? TEAM_MEMBERS[0];

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="surface-light bg-white text-[var(--ink-light-1)] py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-10 lg:space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <p className="font-data text-xs text-[#8b141b] uppercase tracking-[0.08em]">
              08 · Group SE-10 · Level 5 ATP Engineering Team
            </p>
            <SplitReveal
              as="h2"
              id="team-heading"
              scrollTrigger
              text="Engineered in Colombo by Group SE-10."
              className="heading-section text-[var(--ink-light-1)]"
            />
          </div>
          <p className="text-sm font-medium text-[var(--ink-light-2)] max-w-sm leading-relaxed">
            Informatics Institute of Technology (IIT Sri Lanka) × University of Westminster.
          </p>
        </div>

        {/* Desktop: Sticky Double-Bezel Portrait Pedestal + Interactive Ruled Roster */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bezel-light-outer">
              <div className="bezel-light-inner overflow-hidden">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1a0304]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeMember.id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: EASE_EXPO }}
                      className="absolute inset-0"
                    >
                      <img
                        src={activeMember.avatarSrc}
                        alt={activeMember.avatarAlt}
                        width={600}
                        height={750}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />

                      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#1a0304]/85 border border-[rgba(247,223,163,0.42)] px-3 py-1 backdrop-blur-sm">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
                        />
                        <span className="font-data text-xs text-[var(--gold-bright)]">
                          SE-10 · {activeMember.memberIndex}
                        </span>
                      </div>

                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(24,3,4,0) 0%, rgba(24,3,4,0.64) 48%, rgba(20,2,3,0.95) 100%)',
                        }}
                      />

                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 space-y-1.5">
                        <p className="font-data text-xs text-[var(--gold-bright)]">
                          {activeMember.role}
                        </p>
                        <p className="font-display text-2xl text-[#fffaf6] leading-snug">
                          {activeMember.name}
                        </p>
                        <p className="text-xs font-medium text-[#ebd7d8]">
                          {activeMember.focusTag}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="px-5 py-3.5 bg-white border-t border-[var(--hairline-light)] flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-[var(--ink-light-2)]">
                    Hover or select a member to inspect role
                  </span>
                  <span className="font-data text-xs font-semibold text-[#7d1117] shrink-0">
                    {activeMember.memberIndex} / 0{TEAM_MEMBERS.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
            {TEAM_MEMBERS.map((member) => {
              const isActive = member.id === activeMember.id;
              const activate = () => setActiveId(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  data-cursor="Select"
                  aria-pressed={isActive}
                  onMouseEnter={activate}
                  onFocus={activate}
                  onClick={activate}
                  className={`group relative w-full text-left py-5 px-4 sm:px-5 flex items-start gap-4 cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-[var(--paper-1)]'
                      : 'bg-white hover:bg-[var(--paper-1)]/70'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#7d1117] transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <div className="flex items-center gap-3.5 shrink-0 pt-0.5">
                    <span
                      className={`font-data text-xs w-5 transition-colors duration-200 ${
                        isActive ? 'text-[#7d1117] font-semibold' : 'text-[var(--ink-light-3)]'
                      }`}
                    >
                      {member.memberIndex}
                    </span>

                    <div
                      className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border transition-colors duration-200 ${
                        isActive
                          ? 'border-[#7d1117] ring-2 ring-[#7d1117]/20 ring-offset-2 ring-offset-[var(--paper-1)]'
                          : 'border-[var(--hairline-strong)]'
                      }`}
                    >
                      <img
                        src={member.avatarSrc}
                        alt={member.avatarAlt}
                        width={112}
                        height={112}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>

                  <div
                    className={`flex-1 min-w-0 space-y-1.5 transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="text-base font-semibold text-[var(--ink-light-1)] leading-snug">
                        {member.name}
                      </h3>
                      <span className="font-data text-xs text-[var(--ink-light-3)]">
                        {member.focusTag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#8b141b]">{member.role}</p>
                    <p className="text-sm font-medium text-[var(--ink-light-2)] leading-relaxed pt-0.5">
                      {member.responsibility}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`shrink-0 self-center transition-opacity duration-200 ${
                      isActive ? 'opacity-100 text-[#7d1117]' : 'opacity-0'
                    }`}
                  >
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Portrait Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="rounded-2xl bg-white border border-[var(--hairline-light)] shadow-[0_14px_34px_-18px_rgba(48,8,12,0.14)] overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[5/6] w-full overflow-hidden bg-[#1a0304]">
                <img
                  src={member.avatarSrc}
                  alt={member.avatarAlt}
                  width={600}
                  height={750}
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#1a0304]/85 border border-[rgba(247,223,163,0.42)] px-2.5 py-1 backdrop-blur-sm">
                  <span
                    aria-hidden="true"
                    className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
                  />
                  <span className="font-data text-xs text-[var(--gold-bright)]">
                    SE-10 · {member.memberIndex}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[var(--ink-light-1)] leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#8b141b]">{member.role}</p>
                </div>
                <p className="text-sm font-medium text-[var(--ink-light-2)] leading-relaxed">
                  {member.responsibility}
                </p>
                <p className="pt-2 border-t border-[var(--hairline-light)] font-data text-xs text-[var(--ink-light-3)]">
                  {member.focusTag}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
