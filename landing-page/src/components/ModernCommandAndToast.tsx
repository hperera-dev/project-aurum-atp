'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Coins,
  Command,
  Database,
  IdentificationCard,
  MagnifyingGlass,
  ShieldCheck,
  Sparkle,
  X,
} from '@phosphor-icons/react';

/* ============================================================================
   1. MODERN RAYCAST / LINEAR-STYLE COMMAND PALETTE MODAL (Ctrl+K / Cmd+K)
   ============================================================================ */
export interface CommandAction {
  id: string;
  group: 'Interactive Modals' | 'Jump to Section';
  title: string;
  subtitle: string;
  shortcut?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: CommandAction[];
}

export const CommandPaletteModal: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  actions,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subtitle.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[selectedIdx]) {
        e.preventDefault();
        filtered[selectedIdx].onSelect();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, filtered, selectedIdx]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Project AURUM Command Palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] flex items-start justify-center pt-[12vh] p-4 bg-[oklch(8%_0.02_166/0.78)] backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-[var(--velvet-950)] border border-[oklch(78.5%_0.116_82/0.45)] shadow-[0_32px_90px_-16px_rgba(0,0,0,0.92)] overflow-hidden text-[var(--ink-1)]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--velvet-850)]">
              <MagnifyingGlass size={20} weight="light" className="text-[var(--gold-300)] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, open Passport QR, inspect SQL RLS, or check gold rates..."
                className="w-full bg-transparent text-sm sm:text-base text-[var(--ink-1)] placeholder:text-[var(--ink-3)] focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close command palette"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[var(--velvet-900)] hover:bg-[var(--velvet-850)] text-[var(--ink-2)] cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filtered Action List */}
            <div className="max-h-[54vh] overflow-y-auto p-2.5 space-y-1">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--ink-3)]">
                  No matching AURUM action for “{query}”.
                </p>
              ) : (
                filtered.map((item, idx) => {
                  const active = idx === selectedIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onClick={() => {
                        item.onSelect();
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left cursor-pointer transition-colors duration-150 ${
                        active
                          ? 'bg-[var(--velvet-850)] text-[var(--ink-1)] border border-[oklch(78.5%_0.116_82/0.45)]'
                          : 'border border-transparent text-[var(--ink-2)] hover:bg-[var(--velvet-900)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                            active
                              ? 'bg-[var(--gold-400)] text-[var(--velvet-950)]'
                              : 'bg-[var(--velvet-900)] text-[var(--gold-300)]'
                          }`}
                        >
                          {item.group === 'Interactive Modals' ? (
                            item.id.includes('sql') ? (
                              <Database size={17} />
                            ) : item.id.includes('cbsl') ? (
                              <Coins size={17} />
                            ) : (
                              <IdentificationCard size={17} />
                            )
                          ) : (
                            <ArrowRight size={17} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <span className="block text-sm font-semibold truncate">{item.title}</span>
                          <span className="block text-xs text-[var(--ink-3)] truncate">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      <span className="font-data text-xs text-[var(--gold-300)] shrink-0">
                        {item.shortcut ?? item.group}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Keyboard Hint Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--velvet-850)] bg-[var(--velvet-900)] text-xs text-[var(--ink-3)]">
              <span className="inline-flex items-center gap-1.5">
                <Command size={14} className="text-[var(--gold-300)]" />
                Use ↑ ↓ and Enter to navigate
              </span>
              <span className="font-data text-[var(--gold-300)]">ESC to close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================================
   2. MODERN LIVE CBSL GOLD RATES & SOVEREIGN BENCHMARK MODAL
   ============================================================================ */
interface CbslRatesModalProps {
  open: boolean;
  onClose: () => void;
}

export const CbslRatesModal: React.FC<CbslRatesModalProps> = ({ open, onClose }) => {
  const [pavans, setPavans] = useState(2);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const grams = pavans * 8;
  const val22k = grams * 36640;
  const val24k = grams * 40000;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cbsl-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[85] flex items-center justify-center p-4 bg-[oklch(8%_0.02_166/0.8)] backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-[var(--velvet-950)] border border-[oklch(78.5%_0.116_82/0.5)] shadow-[0_32px_80px_-14px_rgba(0,0,0,0.92)] p-6 sm:p-7 text-[var(--ink-1)] space-y-5"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--velvet-850)]">
              <div>
                <span className="font-data text-xs text-[var(--gold-300)] block">
                  SRI LANKA DAILY BENCHMARK · ZERO PROMO SPAM
                </span>
                <h3 id="cbsl-modal-title" className="heading-card text-xl sm:text-2xl mt-0.5">
                  CBSL Reference Gold &amp; Sovereign Converter
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close CBSL Gold Rates Modal"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-900)] hover:bg-[var(--velvet-850)] border border-[var(--velvet-700)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-2xl bg-[var(--velvet-900)] border border-[oklch(78.5%_0.116_82/0.45)] p-4">
                <span className="font-data text-xs text-[var(--gold-300)] block">22K · 916 BRIDAL</span>
                <span className="font-data text-xl font-medium block mt-1">LKR 36,640 / g</span>
                <span className="font-data text-xs text-[var(--ink-2)] block mt-0.5">
                  LKR 293,120 / 8g Sovereign
                </span>
              </div>
              <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-4">
                <span className="font-data text-xs text-[var(--status-ok)] block">24K · 999 BULLION</span>
                <span className="font-data text-xl font-medium block mt-1">LKR 40,000 / g</span>
                <span className="font-data text-xs text-[var(--ink-2)] block mt-0.5">
                  LKR 320,000 / 8g Sovereign
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label htmlFor="pavan-quick-slider" className="font-semibold">
                  Quick Pavan (Sovereign) Estimator
                </label>
                <span className="font-data text-[var(--gold-300)]">
                  {pavans} {pavans === 1 ? 'Pavan' : 'Pavans'} ({grams} g)
                </span>
              </div>
              <input
                id="pavan-quick-slider"
                type="range"
                min={1}
                max={12}
                step={1}
                value={pavans}
                onChange={(e) => setPavans(Number(e.target.value))}
                className="aurum-range"
              />
              <div className="grid grid-cols-2 gap-3 pt-1 font-data text-xs sm:text-sm">
                <div>
                  <span className="text-[var(--ink-3)] block text-xs">22K Indicative Value</span>
                  <span className="text-[var(--ink-1)] font-medium">
                    LKR {val22k.toLocaleString('en-LK')}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--ink-3)] block text-xs">24K Indicative Value</span>
                  <span className="text-[var(--gold-300)] font-medium">
                    LKR {val24k.toLocaleString('en-LK')}
                  </span>
                </div>
              </div>
            </div>

            <p className="flex items-center gap-2 text-xs text-[var(--ink-3)]">
              <ShieldCheck size={16} className="text-[var(--status-ok)] shrink-0" />
              <span>
                In Project AURUM, rupee totals are multiplied privately on your phone—never written
                to analytics or third-party servers.
              </span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ============================================================================
   3. SONNER-STYLE BOTTOM-RIGHT GLASS TOAST NOTIFICATION STACK
   ============================================================================ */
export interface AurumToast {
  id: number;
  title: string;
  detail?: string;
}

export const AurumToastStack: React.FC<{ toasts: AurumToast[]; onDismiss: (id: number) => void }> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[95] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2.5rem)] pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="pointer-events-auto rounded-2xl bg-[oklch(16%_0.026_166/0.94)] backdrop-blur-md border border-[oklch(78.5%_0.116_82/0.55)] shadow-[0_18px_46px_-10px_rgba(0,0,0,0.85)] px-4 py-3.5 text-[var(--ink-1)] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {t.title.includes('Scan') ? (
                <Sparkle size={18} className="text-[var(--gold-300)] shrink-0 mt-0.5" />
              ) : (
                <CheckCircle size={18} className="text-[var(--status-ok)] shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold">{t.title}</p>
                {t.detail && <p className="text-xs text-[var(--ink-2)] mt-0.5">{t.detail}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-[var(--ink-3)] hover:text-[var(--ink-1)] p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
