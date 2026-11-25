'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Database, EyeSlash, Prohibit } from '@phosphor-icons/react';
import { SIMULATOR_ROLES, SimulatorRole } from '../data/aurumData';

interface ZeroKnowledgeSimulatorProps {
  onOpenArchitecture: () => void;
}

export const ZeroKnowledgeSimulator: React.FC<ZeroKnowledgeSimulatorProps> = ({
  onOpenArchitecture,
}) => {
  const [roleId, setRoleId] = useState<SimulatorRole['id']>('owner');
  const activeRole = SIMULATOR_ROLES.find((r) => r.id === roleId) ?? SIMULATOR_ROLES[0];

  const statusColor =
    activeRole.statusTone === 'ok'
      ? 'text-[var(--ok-dark)] border-[oklch(50%_0.11_156)] bg-[oklch(20%_0.035_156)]'
      : activeRole.statusTone === 'restricted'
      ? 'text-[var(--gold-bright)] border-[oklch(55%_0.09_82)] bg-[oklch(22%_0.035_82)]'
      : 'text-[var(--err-dark)] border-[oklch(52%_0.12_22)] bg-[oklch(20%_0.04_22)]';

  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      className="bg-[var(--paper-stone)] py-10 md:py-16 px-3 sm:px-6 lg:px-8"
    >
      {/* Inset Dark Obsidian Architectural Vault Sheet */}
      <div className="surface-dark mx-auto max-w-6xl rounded-[2.25rem] md:rounded-[3rem] px-6 sm:px-10 lg:px-14 py-16 md:py-24 border border-[oklch(26%_0.028_166)] shadow-[0_32px_80px_-28px_rgba(7,23,17,0.45)] space-y-12">
        {/* Clean Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--gold-bright)]">
              PostgreSQL Row-Level Security · Live Access Model
            </p>
            <h2 id="solution-heading" className="heading-section text-[var(--ink-dark-1)]">
              Switch roles to inspect who sees what—at the database layer.
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenArchitecture}
            className="btn-ghost-dark self-start lg:self-auto"
          >
            <Database size={17} weight="regular" className="text-[var(--gold-bright)]" />
            <span>View RLS SQL Policy</span>
          </button>
        </div>

        {/* 3-Role Switcher */}
        <div
          role="tablist"
          aria-label="Inspect database access by role"
          className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[var(--obsidian-900)] border border-[oklch(26%_0.028_166)]"
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
                className={`relative min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-medium text-left cursor-pointer transition-colors duration-150 ${
                  active
                    ? 'text-[var(--obsidian-950)] font-semibold'
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

        {/* Crisp Database Response Sheet */}
        <div className="rounded-2xl bg-[var(--obsidian-900)] border border-[oklch(28%_0.028_166)] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[oklch(26%_0.028_166)]">
            <span className="font-data text-xs text-[var(--ink-dark-2)]">
              {activeRole.badgeLabel}
            </span>
            <span className={`font-data text-xs px-3 py-1 rounded-full border ${statusColor}`}>
              {activeRole.httpStatus}
            </span>
          </div>

          <div className="px-6 py-5 border-b border-[oklch(24%_0.026_166)]">
            <p className="text-sm sm:text-base text-[var(--ink-dark-2)] max-w-3xl">
              {activeRole.summary}
            </p>
          </div>

          <dl className="divide-y divide-[oklch(24%_0.026_166)]">
            {activeRole.rows.map((row) => (
              <div
                key={row.field}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 px-6 py-4 items-center"
              >
                <dt className="md:col-span-4 text-sm font-medium text-[var(--ink-dark-1)]">
                  {row.field}
                </dt>
                <dd className="md:col-span-8 flex items-center justify-between gap-4">
                  <span
                    className={`font-data text-xs sm:text-sm ${
                      row.state === 'visible'
                        ? 'text-[var(--ink-dark-1)]'
                        : row.state === 'masked'
                        ? 'text-[var(--gold-bright)]'
                        : 'text-[var(--err-dark)]'
                    }`}
                  >
                    {row.value}
                  </span>
                  <span className="shrink-0" aria-hidden="true">
                    {row.state === 'visible' && (
                      <CheckCircle size={18} weight="regular" className="text-[var(--ok-dark)]" />
                    )}
                    {row.state === 'masked' && (
                      <EyeSlash size={18} weight="regular" className="text-[var(--gold-bright)]" />
                    )}
                    {row.state === 'denied' && (
                      <Prohibit size={18} weight="regular" className="text-[var(--err-dark)]" />
                    )}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
