'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { TEAM_MEMBERS, type TeamMember } from '../data/aurumData';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MonogramPedestalArt: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div
    className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse 80% 70% at 50% 34%, #520d19 0%, #2a050c 58%, #160206 100%)',
    }}
  >
    {/* Fine architectural assay compass hairlines */}
    <svg
      aria-hidden="true"
      viewBox="0 0 400 500"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-65"
    >
      <circle
        cx="200"
        cy="205"
        r="128"
        fill="none"
        stroke="rgba(247, 223, 158, 0.16)"
        strokeWidth="1"
      />
      <circle
        cx="200"
        cy="205"
        r="96"
        fill="none"
        stroke="rgba(247, 223, 158, 0.28)"
        strokeWidth="1"
        strokeDasharray="3 5"
      />
      <circle
        cx="200"
        cy="205"
        r="74"
        fill="rgba(30, 3, 8, 0.55)"
        stroke="rgba(247, 223, 158, 0.45)"
        strokeWidth="1.2"
      />
      <line
        x1="200"
        y1="52"
        x2="200"
        y2="82"
        stroke="rgba(247, 223, 158, 0.35)"
        strokeWidth="1"
      />
      <line
        x1="200"
        y1="328"
        x2="200"
        y2="352"
        stroke="rgba(247, 223, 158, 0.22)"
        strokeWidth="1"
      />
      <line
        x1="48"
        y1="205"
        x2="76"
        y2="205"
        stroke="rgba(247, 223, 158, 0.28)"
        strokeWidth="1"
      />
      <line
        x1="324"
        y1="205"
        x2="352"
        y2="205"
        stroke="rgba(247, 223, 158, 0.28)"
        strokeWidth="1"
      />
    </svg>

    <div className="relative z-10 -mt-12 flex flex-col items-center text-center px-6">
      <span
        aria-hidden="true"
        className="font-display text-6xl text-[var(--gold-bright)] tracking-[-0.02em] select-none"
      >
        {member.initials}
      </span>
      <span className="mt-10 font-data text-xs text-[rgba(247,223,158,0.82)] tracking-[0.08em] uppercase">
        Group SE-10 · Colombo
      </span>
    </div>
  </div>
);

export const TeamShowcaseSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(TEAM_MEMBERS[0].id);
  const activeMember = TEAM_MEMBERS.find((m) => m.id === activeId) ?? TEAM_MEMBERS[0];

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="bg-[var(--paper-pure)] text-[var(--ink-light-1)] py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-10 lg:space-y-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <p className="font-data text-xs text-[#7a1020] uppercase tracking-[0.08em]">
              Group SE-10 · Level 5 ATP Engineering Team
            </p>
            <h2 id="team-heading" className="heading-section text-[var(--ink-light-1)]">
              Engineered in Colombo by <span className="text-[#6e0d1c]">Group SE-10</span>.
            </h2>
          </div>
          <p className="text-sm font-medium text-[var(--ink-light-2)] max-w-sm leading-relaxed">
            Informatics Institute of Technology (IIT Sri Lanka) × University of Westminster.
          </p>
        </div>

        {/* Desktop Asymmetric Gallery Split: Sticky Double-Bezel Portrait Pedestal + Interactive Ruled Roster */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 xl:gap-12 items-start">
          {/* Left Sticky Pedestal (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bezel-light-outer">
              <div className="bezel-light-inner overflow-hidden">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1e0308]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeMember.id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="absolute inset-0"
                    >
                      {activeMember.avatarSrc ? (
                        <img
                          src={activeMember.avatarSrc}
                          alt={activeMember.avatarAlt ?? activeMember.name}
                          width={600}
                          height={750}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <MonogramPedestalArt member={activeMember} />
                      )}

                      {/* Top index hallmark badge */}
                      <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-[#1e0308]/85 border border-[rgba(247,223,158,0.42)] px-3 py-1 backdrop-blur-sm">
                        <span
                          aria-hidden="true"
                          className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
                        />
                        <span className="font-data text-xs text-[var(--gold-bright)]">
                          SE-10 · {activeMember.memberIndex}
                        </span>
                      </div>

                      {/* Bottom Bordeaux velvet scrim for AAA text clarity */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(24, 3, 7, 0) 0%, rgba(24, 3, 7, 0.62) 48%, rgba(20, 2, 6, 0.95) 100%)',
                        }}
                      />

                      {/* Editorial nameplate over scrim */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 space-y-1.5">
                        <p className="font-data text-xs text-[var(--gold-bright)]">
                          {activeMember.role}
                        </p>
                        <p className="font-display text-2xl text-[#fffaf5] leading-snug">
                          {activeMember.name}
                        </p>
                        <p className="text-xs font-medium text-[#e6d3d6]">
                          {activeMember.focusTag}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pedestal Museum Plaque Footer */}
                <div className="px-5 py-3.5 bg-[var(--paper-pure)] border-t border-[var(--hairline-light)] flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-[var(--ink-light-2)]">
                    Hover or select a member to inspect role
                  </span>
                  <span className="font-data text-xs font-semibold text-[#6e0d1c] shrink-0">
                    {activeMember.memberIndex} / 0{TEAM_MEMBERS.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Ruled Directory (7 cols) */}
          <div className="lg:col-span-7 border-t border-[var(--hairline-light)] divide-y divide-[var(--hairline-light)]">
            {TEAM_MEMBERS.map((member) => {
              const isActive = member.id === activeMember.id;
              return (
                <button
                  key={member.id}
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setActiveId(member.id)}
                  onFocus={() => setActiveId(member.id)}
                  onClick={() => setActiveId(member.id)}
                  className={`group relative w-full text-left py-5 px-4 sm:px-5 flex items-start gap-4 cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-[var(--paper-mineral)]'
                      : 'bg-[var(--paper-pure)] hover:bg-[var(--paper-mineral)]/60'
                  }`}
                >
                  {/* Active left Royal Bordeaux bar */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#6e0d1c] transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  {/* Index + Portrait Avatar */}
                  <div className="flex items-center gap-3.5 shrink-0 pt-0.5">
                    <span
                      className={`font-data text-xs w-5 transition-colors duration-200 ${
                        isActive ? 'text-[#6e0d1c] font-semibold' : 'text-[var(--ink-light-3)]'
                      }`}
                    >
                      {member.memberIndex}
                    </span>

                    {member.avatarSrc ? (
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border transition-colors duration-200 ${
                          isActive
                            ? 'border-[#6e0d1c] ring-2 ring-[#6e0d1c]/20 ring-offset-2 ring-offset-[var(--paper-mineral)]'
                            : 'border-[var(--hairline-strong)]'
                        }`}
                      >
                        <img
                          src={member.avatarSrc}
                          alt={member.avatarAlt ?? member.name}
                          width={112}
                          height={112}
                          loading="lazy"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <span
                        aria-hidden="true"
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-full font-display text-base shrink-0 border transition-colors duration-200 ${
                          isActive
                            ? 'bg-[#3a0710] text-[var(--gold-bright)] border-[#6e0d1c] ring-2 ring-[#6e0d1c]/20 ring-offset-2 ring-offset-[var(--paper-mineral)]'
                            : 'bg-[#2e060d] text-[var(--gold-bright)] border-transparent'
                        }`}
                      >
                        {member.initials}
                      </span>
                    )}
                  </div>

                  {/* Member Details */}
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

                    <p className="text-xs font-semibold text-[#7a1020]">{member.role}</p>

                    <p className="text-sm font-medium text-[var(--ink-light-2)] leading-relaxed pt-0.5">
                      {member.responsibility}
                    </p>
                  </div>

                  {/* Subtle active direction chevron */}
                  <span
                    aria-hidden="true"
                    className={`shrink-0 self-center transition-opacity duration-200 ${
                      isActive ? 'opacity-100 text-[#6e0d1c]' : 'opacity-0'
                    }`}
                  >
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile & Tablet Recomposition (< 1024px): Zero Hover-Hidden Portraits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="studio-card rounded-2xl overflow-hidden flex flex-col"
            >
              {member.avatarSrc ? (
                <div className="relative aspect-[5/6] w-full overflow-hidden bg-[#1e0308]">
                  <img
                    src={member.avatarSrc}
                    alt={member.avatarAlt ?? member.name}
                    width={600}
                    height={750}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#1e0308]/85 border border-[rgba(247,223,158,0.42)] px-2.5 py-1 backdrop-blur-sm">
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
                    />
                    <span className="font-data text-xs text-[var(--gold-bright)]">
                      SE-10 · {member.memberIndex}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="px-5 py-4 flex items-center justify-between gap-3 border-b border-[var(--hairline-light)]"
                  style={{
                    background:
                      'linear-gradient(135deg, #2b050c 0%, #440914 60%, #1d0308 100%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1e0308] border border-[rgba(247,223,158,0.45)] text-[var(--gold-bright)] font-display text-base shrink-0"
                    >
                      {member.initials}
                    </span>
                    <span className="font-data text-xs text-[var(--gold-bright)]">
                      SE-10 · {member.memberIndex}
                    </span>
                  </div>
                  <span className="font-data text-xs text-[#e6d3d6] text-right">
                    {member.focusTag}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between gap-3 bg-[var(--paper-pure)]">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[var(--ink-light-1)] leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#7a1020]">{member.role}</p>
                </div>

                <p className="text-sm font-medium text-[var(--ink-light-2)] leading-relaxed">
                  {member.responsibility}
                </p>

                {member.avatarSrc && (
                  <p className="pt-2 border-t border-[var(--hairline-light)] font-data text-xs text-[var(--ink-light-3)]">
                    {member.focusTag}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
