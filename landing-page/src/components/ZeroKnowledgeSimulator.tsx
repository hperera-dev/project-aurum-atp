'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Code,
  Database,
  Eye,
  EyeSlash,
  Prohibit,
  QrCode,
  ShieldCheck,
} from '@phosphor-icons/react';
import { SIMULATOR_ROLES, SimulatorRole } from '../data/aurumData';
import { ScrambleText } from './ScrambleText';

interface ZeroKnowledgeSimulatorProps {
  onOpenArchitecture: () => void;
}

export const ZeroKnowledgeSimulator: React.FC<ZeroKnowledgeSimulatorProps> = ({
  onOpenArchitecture,
}) => {
  const prefersReduced = useReducedMotion();
  const [roleId, setRoleId] = useState<SimulatorRole['id']>('owner');

  const activeRole = SIMULATOR_ROLES.find((r) => r.id === roleId) ?? SIMULATOR_ROLES[0];

  const beamColor =
    activeRole.statusTone === 'ok'
      ? 'oklch(80.5% 0.12 156)'
      : activeRole.statusTone === 'restricted'
        ? 'oklch(86% 0.098 82)'
        : 'oklch(75.5% 0.145 19)';

  return (
    <section
      id="solution"
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <p className="font-data text-xs text-[var(--gold-300)] mb-2.5">
              LIVE POSTGRESQL RLS FIREWALL · ASSET AUR · 0842 · 6190
            </p>
            <h2 className="heading-section text-[var(--ink-1)]">
              Test what three different eyes see when scanning the exact same 22K bangle.
            </h2>
            <p className="text-sm sm:text-base text-[var(--ink-2)] mt-3 max-w-[60ch]">
              Showrooms fear rivals poaching customers; families fear outsiders inspecting holdings.
              Switch roles below to watch PostgreSQL Row-Level Security enforce zero-knowledge
              isolation in real time.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenArchitecture}
            className="btn-secondary-velvet self-start lg:self-auto shrink-0"
          >
            <Code size={18} weight="light" className="text-[var(--gold-300)]" />
            <span>Inspect SQL RLS Policy</span>
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Database access role lenses"
          className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 rounded-3xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] mb-6"
        >
          {SIMULATOR_ROLES.map((role) => {
            const isSelected = role.id === roleId;
            return (
              <button
                key={role.id}
                role="tab"
                type="button"
                id={`sim-tab-${role.id}`}
                aria-selected={isSelected}
                aria-controls={`sim-panel-${role.id}`}
                onClick={() => setRoleId(role.id)}
                className={`relative z-10 min-h-[48px] px-4 py-2.5 rounded-2xl text-left sm:text-center text-sm font-semibold cursor-pointer transition-colors ${isSelected
                    ? 'text-[var(--velvet-950)]'
                    : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'
                  }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="rls-role-pill"
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { type: 'spring', duration: 0.42, bounce: 0 }
                    }
                    className={`absolute inset-0 -z-10 rounded-2xl ${role.id === 'rival' ? 'bg-[var(--status-err)]' : 'bg-[var(--gold-400)]'
                      }`}
                  />
                )}
                <span>{role.tabLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="velvet-glass-panel rounded-2xl p-4 sm:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-center">
            <div className="rounded-xl bg-[var(--velvet-950)] border border-[var(--velvet-750)] p-3 flex items-center gap-3">
              <QrCode size={22} weight="light" className="text-[var(--gold-300)] shrink-0" />
              <div className="min-w-0">
                <span className="block font-data text-xs text-[var(--ink-3)]">SCAN INPUT</span>
                <span className="block font-data text-xs text-[var(--ink-1)] truncate">
                  AUR · 0842 · 6190
                </span>
              </div>
            </div>

            <svg aria-hidden="true" viewBox="0 0 80 20" className="hidden md:block w-16 h-5">
              <line
                x1="0"
                y1="10"
                x2="80"
                y2="10"
                stroke={beamColor}
                strokeWidth="2.5"
                className={prefersReduced ? '' : 'svg-flow-beam'}
              />
            </svg>

            <div className="rounded-xl bg-[var(--velvet-950)] border border-[oklch(79%_0.112_80.5/0.55)] p-3 flex items-center gap-3">
              <Database size={22} weight="light" className="text-[var(--gold-300)] shrink-0" />
              <div className="min-w-0">
                <span className="block font-data text-xs text-[var(--gold-300)]">
                  POSTGRESQL RLS GATE
                </span>
                <span className="block font-data text-xs text-[var(--ink-2)] truncate">
                  <ScrambleText text={activeRole.badgeLabel} durationMs={340} />
                </span>
              </div>
            </div>

            <svg aria-hidden="true" viewBox="0 0 80 20" className="hidden md:block w-16 h-5">
              <line
                x1="0"
                y1="10"
                x2="80"
                y2="10"
                stroke={beamColor}
                strokeWidth="2.5"
                className={
                  prefersReduced || activeRole.statusTone === 'blocked' ? '' : 'svg-flow-beam'
                }
                strokeDasharray={activeRole.statusTone === 'blocked' ? '3 5' : undefined}
              />
            </svg>

            <div
              className={`rounded-xl p-3 flex items-center gap-3 border ${activeRole.statusTone === 'ok'
                  ? 'bg-[var(--velvet-900)] border-[oklch(55%_0.12_156)]'
                  : activeRole.statusTone === 'restricted'
                    ? 'bg-[var(--velvet-900)] border-[oklch(79%_0.112_80.5/0.6)]'
                    : 'bg-[oklch(22%_0.085_19)] border-[var(--status-err)]'
                }`}
            >
              {activeRole.statusTone === 'ok' && (
                <ShieldCheck size={22} weight="regular" className="text-[var(--status-ok)] shrink-0" />
              )}
              {activeRole.statusTone === 'restricted' && (
                <Eye size={22} weight="regular" className="text-[var(--gold-300)] shrink-0" />
              )}
              {activeRole.statusTone === 'blocked' && (
                <Prohibit size={22} weight="regular" className="text-[var(--status-err)] shrink-0" />
              )}
              <div className="min-w-0">
                <span className="block font-data text-xs text-[var(--ink-3)]">ENGINE RESPONSE</span>
                <span className="block font-data text-xs font-medium text-[var(--ink-1)] truncate">
                  <ScrambleText text={activeRole.httpStatus} durationMs={380} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          id={`sim-panel-${activeRole.id}`}
          role="tabpanel"
          aria-labelledby={`sim-tab-${activeRole.id}`}
          className="border-beam-card"
        >
          <div className="bezel-core-velvet p-5 sm:p-8 space-y-5">
            <p className="text-sm sm:text-base text-[var(--ink-1)] pb-4 border-b border-[var(--velvet-750)]">
              {activeRole.summary}
            </p>

            <div className="divide-y divide-[var(--velvet-850)]">
              {activeRole.rows.map((row) => (
                <div
                  key={`${activeRole.id}-${row.field}`}
                  className="py-3.5 px-2 -mx-2 rounded-xl hover:bg-[oklch(20%_0.028_166/0.65)] transition-colors grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4 items-start sm:items-center"
                >
                  <div className="sm:col-span-4 text-xs sm:text-sm font-medium text-[var(--ink-2)]">
                    {row.field}
                  </div>
                  <div className="sm:col-span-8 flex items-start sm:items-center gap-2.5">
                    {row.state === 'visible' && (
                      <Eye
                        size={16}
                        weight="light"
                        className="text-[var(--status-ok)] shrink-0 mt-0.5 sm:mt-0"
                        aria-hidden="true"
                      />
                    )}
                    {row.state === 'masked' && (
                      <EyeSlash
                        size={16}
                        weight="light"
                        className="text-[var(--gold-300)] shrink-0 mt-0.5 sm:mt-0"
                        aria-hidden="true"
                      />
                    )}
                    {row.state === 'denied' && (
                      <Prohibit
                        size={16}
                        weight="light"
                        className="text-[var(--status-err)] shrink-0 mt-0.5 sm:mt-0"
                        aria-hidden="true"
                      />
                    )}
                    <ScrambleText
                      text={row.value}
                      durationMs={340}
                      className={`font-data text-xs sm:text-sm break-words ${row.state === 'visible'
                          ? 'text-[var(--ink-1)]'
                          : row.state === 'masked'
                            ? 'text-[var(--gold-300)]'
                            : 'text-[var(--status-err)]'
                        }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
