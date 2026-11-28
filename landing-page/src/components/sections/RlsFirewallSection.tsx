'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Database,
  EyeSlash,
  LockKey,
  Prohibit,
  ShieldCheck,
} from '@phosphor-icons/react';
import { SIMULATOR_ROLES, SimulatorRole } from '../../content/aurumContent';
import { gsap } from '../../lib/gsapSetup';
import { Glass } from '../glass/Glass';
import { GoldSweepText } from '../motion/GoldSweepText';

interface RlsFirewallSectionProps {
  onOpenArchitecture: () => void;
}

const ROLE_META = {
  owner: {
    pillClass: 'bg-[#103827] text-[var(--ok-dark)]',
    pillText: 'OWNER KEY',
    subText: 'Serendib Jewellers · +3 other family shops',
    Icon: ShieldCheck,
  },
  issuer: {
    pillClass: 'bg-[#3d2a0d] text-[var(--gold-bright)]',
    pillText: 'SCOPED LEDGER',
    subText: 'Serendib Jewellers · Other shops hidden',
    Icon: EyeSlash,
  },
  rival: {
    pillClass: 'bg-[#590d14] text-[var(--err-dark)]',
    pillText: 'HTTP 403',
    subText: '0 bytes returned',
    Icon: Prohibit,
  },
} as const;

const ROW_STATE = {
  visible: { textClass: 'text-[var(--ink-dark-1)]', iconClass: 'text-[var(--ok-dark)]', Icon: CheckCircle },
  masked: { textClass: 'text-[var(--gold-bright)]', iconClass: 'text-[var(--gold-bright)]', Icon: EyeSlash },
  denied: { textClass: 'text-[var(--err-dark)]', iconClass: 'text-[var(--err-dark)]', Icon: Prohibit },
} as const;

const CIRCUIT_NODES = [
  { x: 110, label: 'Counter QR Scan' },
  { x: 370, label: 'Signed Tenant JWT' },
  { x: 630, label: 'PostgreSQL 16 Engine' },
  { x: 890, label: 'RLS Policy Gate' },
];

export const RlsFirewallSection: React.FC<RlsFirewallSectionProps> = ({ onOpenArchitecture }) => {
  const [roleId, setRoleId] = useState<SimulatorRole['id']>('owner');
  const sectionRef = useRef<HTMLElement>(null);
  const packetDotRef = useRef<SVGCircleElement>(null);
  const activeLineRef = useRef<SVGLineElement>(null);

  const activeRole = SIMULATOR_ROLES.find((r) => r.id === roleId) ?? SIMULATOR_ROLES[0];
  const meta = ROLE_META[roleId];
  const RoleIcon = meta.Icon;
  const isRival = roleId === 'rival';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        activeLineRef.current,
        { strokeDashoffset: 780 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 76%',
            end: 'top 25%',
            scrub: 0.8,
          },
        }
      );
      gsap.fromTo(
        packetDotRef.current,
        { attr: { cx: 110 } },
        {
          attr: { cx: 890 },
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 76%',
            end: 'top 25%',
            scrub: 0.8,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="solution"
      aria-labelledby="solution-heading"
      className="surface-ruby assay-grid-dark py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#47090d]"
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="font-data text-xs text-[var(--gold-bright)] uppercase tracking-[0.1em]">
              04 · Zero-Knowledge PostgreSQL RLS
            </p>
            <h2 id="solution-heading" className="heading-section text-[var(--ink-dark-1)]">
              One passport. <GoldSweepText>Three walls</GoldSweepText> of database truth.
            </h2>
          </div>

          <button
            type="button"
            data-cursor="Inspect"
            onClick={onOpenArchitecture}
            className="btn-ghost-dark self-start lg:self-auto"
          >
            <Database size={17} className="text-[var(--gold-bright)]" />
            <span>View RLS SQL Policy</span>
          </button>
        </div>

        {/* Scrubbed Query Packet Circuit */}
        <Glass variant="card" interactive={false} className="hidden md:block px-6 py-5">
          <svg viewBox="0 0 1000 74" className="w-full h-auto" aria-hidden="true">
            <line
              x1="110"
              y1="28"
              x2="890"
              y2="28"
              stroke="rgba(247,223,163,0.16)"
              strokeWidth="2"
            />
            <line
              ref={activeLineRef}
              x1="110"
              y1="28"
              x2="890"
              y2="28"
              stroke="#f7dfa3"
              strokeWidth="2.5"
              strokeDasharray="780"
            />
            {CIRCUIT_NODES.map((n) => (
              <g key={n.label}>
                <circle
                  cx={n.x}
                  cy="28"
                  r="8"
                  fill="#240406"
                  stroke="#f7dfa3"
                  strokeWidth="1.6"
                />
                <text
                  x={n.x}
                  y="60"
                  textAnchor="middle"
                  fill="#ebd7d8"
                  fontSize="12"
                  fontFamily="var(--font-mono)"
                >
                  {n.label}
                </text>
              </g>
            ))}
            <circle ref={packetDotRef} cx="110" cy="28" r="5.5" fill="#fff8e6" />
          </svg>
        </Glass>

        {/* Interactive 3-Role Switcher */}
        <div
          role="tablist"
          aria-label="Inspect database access by role"
          className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#140203]/90 border border-[#590e13]"
        >
          {SIMULATOR_ROLES.map((role) => {
            const active = role.id === roleId;
            return (
              <button
                key={role.id}
                type="button"
                role="tab"
                data-cursor="Select"
                aria-selected={active}
                onClick={() => setRoleId(role.id)}
                className={`relative min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-semibold text-left cursor-pointer transition-colors duration-150 ${
                  active
                    ? 'text-[var(--ruby-0)]'
                    : 'text-[var(--ink-dark-2)] hover:text-[var(--ink-dark-1)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="v3-rls-pill"
                    transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                    className="absolute inset-0 rounded-xl bg-[var(--gold-bullion)]"
                  />
                )}
                <span className="relative z-10">{role.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Tactile Vault Card with Live HTTP 403 Shutter + Permission Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <Glass
            variant="card"
            refract
            className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between min-h-[340px] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-data text-xs text-[var(--gold-bright)]">
                {isRival ? 'REDACTED' : 'AUR · 0842 · 6190'}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 font-data text-xs px-2.5 py-1 rounded-full ${meta.pillClass}`}
              >
                <RoleIcon size={14} />
                <span>{meta.pillText}</span>
              </span>
            </div>

            <div className="my-6 space-y-4">
              <div>
                <p className="font-display text-2xl text-[var(--ink-dark-1)]">
                  Kandyan Studded Bangle
                </p>
                <p className="font-data text-xs text-[var(--ink-dark-2)] mt-1">{meta.subText}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-[#140203]/85 border border-[#590e13] p-3.5">
                  <span className="font-data text-xs text-[var(--ink-dark-3)] block">Net Gold</span>
                  <span className="font-data text-lg text-[var(--gold-bright)] mt-0.5 block">
                    4.20 g · 18K
                  </span>
                </div>
                <div className="rounded-xl bg-[#140203]/85 border border-[#590e13] p-3.5">
                  <span className="font-data text-xs text-[var(--ink-dark-3)] block">
                    Buyer Phone
                  </span>
                  <span className="font-data text-sm text-[var(--ink-dark-1)] mt-1.5 block">
                    {roleId === 'owner' ? 'Owner Biometric' : '+94 •• ••• 4821'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(247,223,163,0.16)] flex items-center justify-between text-xs font-data text-[var(--ink-dark-2)]">
              <span>Home Address Column</span>
              <span className="text-[var(--gold-bright)]">NULL (0 Columns)</span>
            </div>

            <AnimatePresence>
              {isRival && (
                <motion.div
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', duration: 0.34, bounce: 0 }}
                  className="absolute inset-0 z-20 bg-[#2b0507]/96 backdrop-blur-md p-7 flex flex-col items-center justify-center text-center space-y-4 border-2 border-[#a8242e] rounded-3xl"
                >
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#540a11] border border-[#b52c36] text-[var(--gold-bright)]">
                    <LockKey size={28} />
                  </span>
                  <div className="space-y-1.5">
                    <p className="font-data text-xs text-[var(--err-dark)]">
                      POSTGRESQL RLS · TENANT MISMATCH
                    </p>
                    <p className="font-display text-3xl text-white">HTTP 403 Forbidden</p>
                    <p className="text-sm text-[#f0d0d2] max-w-xs mx-auto">
                      0 bytes returned. Rival showrooms cannot confirm this piece or buyer even
                      exists.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Glass>

          <Glass
            variant="card"
            interactive={false}
            className="lg:col-span-7 overflow-hidden flex flex-col justify-between"
          >
            <div className="px-6 py-4 border-b border-[rgba(247,223,163,0.14)] flex flex-wrap items-center justify-between gap-2">
              <span className="font-data text-xs text-[var(--ink-dark-2)]">
                {activeRole.badgeLabel}
              </span>
              <span className="font-data text-xs text-[var(--gold-bright)]">
                {activeRole.httpStatus}
              </span>
            </div>

            <dl className="divide-y divide-[rgba(247,223,163,0.1)] flex-1">
              {activeRole.rows.map((row) => {
                const st = ROW_STATE[row.state];
                const RowIcon = st.Icon;
                return (
                  <div
                    key={row.field}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 px-6 py-4 items-center"
                  >
                    <dt className="sm:col-span-5 text-sm font-medium text-[var(--ink-dark-1)]">
                      {row.field}
                    </dt>
                    <dd className="sm:col-span-7 flex items-center justify-between gap-3">
                      <span className={`font-data text-xs ${st.textClass}`}>{row.value}</span>
                      <span className="shrink-0" aria-hidden="true">
                        <RowIcon size={17} className={st.iconClass} />
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Glass>
        </div>
      </div>
    </section>
  );
};
