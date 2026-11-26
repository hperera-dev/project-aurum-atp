'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Database,
  EyeSlash,
  LockKey,
  Prohibit,
  ShieldCheck,
} from '@phosphor-icons/react';
import { SIMULATOR_ROLES, SimulatorRole } from '../data/aurumData';

interface ZeroKnowledgeSimulatorProps {
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

export const ZeroKnowledgeSimulator: React.FC<ZeroKnowledgeSimulatorProps> = ({
  onOpenArchitecture,
}) => {
  const [roleId, setRoleId] = useState<SimulatorRole['id']>('owner');
  const activeRole = SIMULATOR_ROLES.find((r) => r.id === roleId) ?? SIMULATOR_ROLES[0];
  const meta = ROLE_META[roleId];
  const RoleIcon = meta.Icon;
  const isRival = roleId === 'rival';

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="bg-[var(--paper-stone)] py-12 md:py-20 px-3 sm:px-6 lg:px-8"
    >
      <div className="surface-dark mx-auto max-w-6xl rounded-[2.25rem] md:rounded-[3rem] px-6 sm:px-10 lg:px-14 py-16 md:py-24 border border-[#630f15] shadow-[0_32px_80px_-28px_rgba(34,4,8,0.52)] space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h2 id="solution-heading" className="heading-section text-[var(--ink-dark-1)] max-w-2xl">
            One passport. <span className="text-[var(--gold-bright)]">Three walls</span> of database
            truth.
          </h2>

          <button
            type="button"
            onClick={onOpenArchitecture}
            className="btn-ghost-dark self-start lg:self-auto"
          >
            <Database size={17} className="text-[var(--gold-bright)]" />
            <span>View RLS SQL Policy</span>
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Inspect database access by role"
          className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--obsidian-900)] border border-[#590e13]"
        >
          {SIMULATOR_ROLES.map((role) => {
            const active = role.id === roleId;
            return (
              <button
                key={role.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setRoleId(role.id)}
                className={`relative min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-semibold text-left cursor-pointer transition-colors duration-150 ${
                  active
                    ? 'text-[var(--obsidian-950)]'
                    : 'text-[var(--ink-dark-2)] hover:text-[var(--ink-dark-1)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="rls-role-pill"
                    transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                    className="absolute inset-0 rounded-xl bg-[var(--gold-bullion)]"
                  />
                )}
                <span className="relative z-10">{role.tabLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 relative rounded-3xl bg-gradient-to-br from-[#470a0f] via-[#2b0608] to-[#180304] border border-[#731319] p-6 sm:p-7 flex flex-col justify-between min-h-[340px] overflow-hidden">
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
                <div className="rounded-xl bg-[#180304]/80 border border-[#590e13] p-3.5">
                  <span className="font-data text-xs text-[var(--ink-dark-3)] block">Net Gold</span>
                  <span className="font-data text-lg text-[var(--gold-bright)] mt-0.5 block">
                    4.20 g · 18K
                  </span>
                </div>
                <div className="rounded-xl bg-[#180304]/80 border border-[#590e13] p-3.5">
                  <span className="font-data text-xs text-[var(--ink-dark-3)] block">
                    Buyer Phone
                  </span>
                  <span className="font-data text-sm text-[var(--ink-dark-1)] mt-1.5 block">
                    {roleId === 'owner' ? 'Owner Biometric' : '+94 •• ••• 4821'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#590e13] flex items-center justify-between text-xs font-data text-[var(--ink-dark-2)]">
              <span>Home Address Column</span>
              <span className="text-[var(--gold-bright)]">NULL (0 Columns)</span>
            </div>

            <AnimatePresence>
              {isRival && (
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', duration: 0.34, bounce: 0 }}
                  className="absolute inset-0 z-20 bg-[#2b0507]/96 backdrop-blur-sm p-7 flex flex-col items-center justify-center text-center space-y-4 border-2 border-[#a8242e] rounded-3xl"
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
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[var(--obsidian-900)] border border-[#590e13] overflow-hidden flex flex-col justify-between">
            <div className="px-6 py-4 border-b border-[#590e13] flex items-center justify-between gap-2">
              <span className="font-data text-xs text-[var(--ink-dark-2)]">
                {activeRole.badgeLabel}
              </span>
              <span className="font-data text-xs text-[var(--gold-bright)]">
                {activeRole.httpStatus}
              </span>
            </div>

            <dl className="divide-y divide-[#47090d] flex-1">
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
          </div>
        </div>
      </div>
    </section>
  );
};
