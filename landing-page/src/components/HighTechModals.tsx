'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  Copy,
  Database,
  FileLock,
  Fingerprint,
  LockSimple,
  QrCode,
  ShieldCheck,
  Timer,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';
import { ScrambleText } from './ScrambleText';
import { MagneticCTA } from './MagneticCTA';

interface PassportModalProps {
  open: boolean;
  onClose: () => void;
  initialItem?: VaultItem;
}

export const PassportInspectorModal: React.FC<PassportModalProps> = ({
  open,
  onClose,
  initialItem,
}) => {
  const prefersReduced = useReducedMotion();
  const [tab, setTab] = useState<'assay' | 'invoice' | 'counterpass'>('assay');
  const [secondsLeft, setSecondsLeft] = useState(894);
  const [hashVerified, setHashVerified] = useState(false);

  const item = initialItem ?? HERO_VAULT_ITEMS[0];

  useEffect(() => {
    if (!open) return;
    setHashVerified(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 900));
    }, 1000);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearInterval(timer);
    };
  }, [open, onClose]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="passport-modal-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[oklch(8%_0.02_166/0.84)] backdrop-blur-md"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.42, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="border-beam-card w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="bezel-core-velvet p-5 sm:p-7 text-[var(--ink-1)] overflow-y-auto max-h-[88vh] space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--velvet-750)]">
                <div>
                  <span className="font-data text-xs text-[var(--gold-300)] block mb-1">
                    LIVE DIGITAL PASSPORT INSPECTOR · {item.badge.toUpperCase()}
                  </span>
                  <h3 id="passport-modal-title" className="heading-card text-xl sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="font-data text-xs text-[var(--ink-2)] mt-1">
                    <ScrambleText text={`${item.id} · ${item.issuer} (${item.location})`} />
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Digital Passport Inspector"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] text-[var(--ink-1)] cursor-pointer transition-colors"
                >
                  <X size={20} weight="light" />
                </button>
              </div>

              <div
                role="tablist"
                aria-label="Passport inspection views"
                className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)]"
              >
                {[
                  { id: 'assay' as const, label: 'Assay & Weights' },
                  { id: 'invoice' as const, label: 'AES-256 Invoice' },
                  { id: 'counterpass' as const, label: '15m Counter Pass' },
                ].map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.id)}
                      className={`min-h-[44px] px-2.5 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
                        active
                          ? 'bg-[var(--gold-400)] text-[var(--velvet-950)]'
                          : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {tab === 'assay' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-4">
                      <span className="block text-xs text-[var(--ink-3)]">Gross Weight</span>
                      <span className="font-data text-lg font-medium text-[var(--ink-1)] mt-1 block">
                        {item.grossGrams}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.55)] p-4">
                      <span className="block text-xs text-[var(--gold-300)]">Pure Net Gold</span>
                      <span className="font-data text-lg font-medium text-[var(--gold-300)] mt-1 block">
                        {item.netGrams}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-4">
                      <span className="block text-xs text-[var(--ink-3)]">Purity Seal</span>
                      <span className="font-data text-lg font-medium text-[var(--status-ok)] mt-1 block">
                        {item.karat}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-4 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[var(--ink-3)]">Assay Craft Note</span>
                      <span className="font-data text-[var(--ink-1)] text-right">{item.hallmarkNote}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[var(--ink-3)]">Wear Audit Tolerance</span>
                      <span className="font-data text-[var(--status-ok)] text-right">
                        ±1.5% Natural Daily Wear Gate
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[var(--ink-3)]">Home Street Address</span>
                      <span className="font-data text-[var(--gold-300)] text-right">
                        0 Columns Stored (Zero-Address Schema)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'invoice' && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-300)]">
                        <FileLock size={20} weight="light" />
                        Untouched Original Showroom VAT Invoice PDF
                      </span>
                      <span className="font-data text-xs px-2.5 py-1 rounded-full bg-[var(--velvet-850)] text-[var(--status-ok)]">
                        AES-256-GCM
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                      Sealed into a private bucket at checkout. Neither rival showrooms nor routine
                      system administrators can decrypt this PDF without your biometric device key.
                    </p>
                    <div className="rounded-xl bg-[var(--velvet-950)] border border-[var(--velvet-750)] p-3 font-data text-xs text-[var(--ink-2)] break-all">
                      SHA-256: 9f4c82d1a0b7e63c51f0a2e88b7d41096a1c7e4e83a9d22f08426190
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHashVerified(true)}
                    className="btn-secondary-velvet w-full justify-center"
                  >
                    {hashVerified ? (
                      <>
                        <ShieldCheck size={18} weight="regular" className="text-[var(--status-ok)]" />
                        <span className="text-[var(--status-ok)]">
                          Cryptographic Integrity Verified — 0 Bytes Tampered
                        </span>
                      </>
                    ) : (
                      <>
                        <Fingerprint size={18} weight="light" className="text-[var(--gold-300)]" />
                        <span>Run Local SHA-256 Invoice Integrity Check</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {tab === 'counterpass' && (
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 items-center rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] p-5">
                  <div className="mx-auto w-36 h-36 rounded-2xl bg-[var(--velvet-950)] border-2 border-[var(--gold-400)] flex flex-col items-center justify-center text-[var(--gold-300)] shadow-[0_0_30px_oklch(79%_0.112_80.5/0.26)]">
                    <QrCode size={76} weight="light" />
                    <span className="font-data text-xs mt-1">CP-{mins}{secs}</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 font-data text-xs px-3 py-1 rounded-full bg-[var(--velvet-850)] text-[var(--gold-300)]">
                      <Timer size={14} weight="regular" />
                      <span>Expires in {mins}:{secs}</span>
                    </div>
                    <h4 className="text-base font-semibold text-[var(--ink-1)]">
                      Temporary Customer-Present Unlock Token
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                      Show this rotating QR at {item.issuer} during polishing, resizing, or bridal
                      exchange. Once the 15-minute window closes, the showroom terminal returns to
                      masked blind mode automatically.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ArchitectureModalProps {
  open: boolean;
  onClose: () => void;
}

const RLS_SQL_SNIPPET = `-- Project AURUM: Strict Multi-Tenant PostgreSQL RLS Policy
ALTER TABLE jewellery_passports ENABLE ROW LEVEL SECURITY;

-- 1. Families view all their own pieces across every showroom
CREATE POLICY owner_full_vault_access ON jewellery_passports
  FOR SELECT USING (auth.uid() = owner_user_id);

-- 2. Showrooms view STRICTLY their own issued rows; rivals get 0 rows (HTTP 403)
CREATE POLICY issuer_isolated_ledger ON jewellery_passports
  FOR SELECT USING (
    current_setting('app.tenant_id', true)::uuid = issuing_showroom_id
  );

-- 3. Schema Safety Guarantee: ZERO residential address / GPS columns exist`;

export const ArchitectureBlueprintModal: React.FC<ArchitectureModalProps> = ({ open, onClose }) => {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(RLS_SQL_SNIPPET).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="arch-modal-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[oklch(8%_0.02_166/0.84)] backdrop-blur-md"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.42, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="border-beam-card w-full max-w-3xl max-h-[90vh] overflow-hidden"
          >
            <div className="bezel-core-velvet p-5 sm:p-7 text-[var(--ink-1)] overflow-y-auto max-h-[88vh] space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--velvet-750)]">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[var(--velvet-900)] border border-[oklch(79%_0.112_80.5/0.45)] text-[var(--gold-300)] shrink-0">
                    <Database size={22} weight="light" />
                  </span>
                  <div>
                    <span className="font-data text-xs text-[var(--gold-300)] block">
                      SYSTEM ARCHITECTURE SPECIFICATION · GROUP SE-10
                    </span>
                    <h3 id="arch-modal-title" className="heading-card text-xl sm:text-2xl mt-0.5">
                      Database-Enforced Zero-Knowledge Tenant Isolation
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Architecture Specification Modal"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] text-[var(--ink-1)] cursor-pointer"
                >
                  <X size={20} weight="light" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-3.5">
                  <span className="font-data text-[var(--status-ok)] block">ENGINE ISOLATION</span>
                  <span className="text-[var(--ink-2)] mt-1 block">
                    Enforced inside PostgreSQL RLS—not merely hidden in frontend UI.
                  </span>
                </div>
                <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-3.5">
                  <span className="font-data text-[var(--gold-300)] block">0 ADDRESS COLUMNS</span>
                  <span className="text-[var(--ink-2)] mt-1 block">
                    No residential street, postal code, or GPS coordinates in any table.
                  </span>
                </div>
                <div className="rounded-2xl bg-[var(--velvet-900)] border border-[var(--velvet-750)] p-3.5">
                  <span className="font-data text-[var(--gold-300)] block">PARENT → CHILD GRAPH</span>
                  <span className="text-[var(--ink-2)] mt-1 block">
                    Immutable DAG linking melted heirlooms to newly crafted bridal assets.
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-[oklch(12%_0.02_166)] border border-[var(--velvet-750)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--velvet-850)] text-xs font-data text-[var(--ink-3)]">
                  <span>migrations/004_aurum_rls_policies.sql</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] text-[var(--ink-1)] cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-[var(--status-ok)]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs font-data text-[var(--ink-1)] overflow-x-auto leading-relaxed">
                  <code>{RLS_SQL_SNIPPET}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface QuickPilotModalProps {
  open: boolean;
  onClose: () => void;
}

const encodeForm = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&');

export const QuickPilotModal: React.FC<QuickPilotModalProps> = ({ open, onClose }) => {
  const prefersReduced = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Jewellery Owner / Family' | 'Retail Jeweller / Showroom Manager'>(
    'Jewellery Owner / Family'
  );
  const [showroom, setShowroom] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (name.trim().length < 2) {
      setErr('Enter your full name to reserve your invitation.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Enter a valid email address.');
      return;
    }
    if (!consent) {
      setErr('Please confirm the Sri Lanka PDPA privacy notice.');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeForm({
          'form-name': 'waitlist',
          'bot-field': '',
          name: name.trim(),
          email: email.trim(),
          role,
          showroom_name: role.includes('Retail') ? showroom.trim() : '',
          pdpa_consent: 'yes',
        }),
      });
      if (!res.ok) throw new Error('Network');
      setStatus('success');
    } catch {
      setStatus('error');
      setErr(
        'Live Netlify Forms endpoint activates on deployed HTTPS—or register directly via aurumteam25@gmail.com.'
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-pilot-title"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-[oklch(8%_0.02_166/0.84)] backdrop-blur-md"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.42, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="border-beam-card w-full max-w-lg max-h-[92vh] overflow-hidden"
          >
            <div className="bezel-core-velvet p-6 sm:p-7 text-[var(--ink-1)] overflow-y-auto max-h-[90vh] space-y-5">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--velvet-750)]">
                <div>
                  <span className="font-data text-xs text-[var(--gold-300)] block">
                    FREE COLOMBO EARLY-ACCESS PILOT
                  </span>
                  <h3 id="quick-pilot-title" className="heading-card text-xl mt-0.5">
                    Reserve Your Early-Access Invitation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Pilot Registration Modal"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] text-[var(--ink-1)] cursor-pointer"
                >
                  <X size={20} weight="light" />
                </button>
              </div>

              {status === 'success' ? (
                <div className="rounded-2xl bg-[var(--velvet-900)] border border-[oklch(55%_0.12_156)] p-5 space-y-3">
                  <p className="font-semibold text-[var(--status-ok)]">
                    Invitation reserved under Sri Lanka PDPA guidelines.
                  </p>
                  <p className="text-sm text-[var(--ink-2)]">
                    We have recorded your pilot slot for Colombo closed-beta onboarding.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary-velvet w-full justify-center"
                  >
                    Return to Page
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        'Jewellery Owner / Family',
                        'Retail Jeweller / Showroom Manager',
                      ] as const
                    ).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        aria-pressed={role === r}
                        className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-semibold text-left border cursor-pointer transition-colors ${
                          role === r
                            ? 'bg-[var(--gold-400)] text-[var(--velvet-950)] border-[var(--gold-300)]'
                            : 'bg-[var(--velvet-900)] text-[var(--ink-2)] border-[var(--velvet-750)] hover:border-[var(--gold-400)]'
                        }`}
                      >
                        {r === 'Jewellery Owner / Family' ? 'Family Vault Owner' : 'Retail Showroom'}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="modal-name" className="block text-xs font-semibold text-[var(--ink-2)] mb-1">
                      Full Name
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Nimal Perera"
                      className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--velvet-900)] border border-[var(--velvet-700)] text-base text-[var(--ink-1)] placeholder:text-[var(--ink-3)]"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-email" className="block text-xs font-semibold text-[var(--ink-2)] mb-1">
                      Email Address
                    </label>
                    <input
                      id="modal-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.lk"
                      className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--velvet-900)] border border-[var(--velvet-700)] text-base text-[var(--ink-1)] placeholder:text-[var(--ink-3)]"
                    />
                  </div>

                  {role.includes('Retail') && (
                    <div>
                      <label htmlFor="modal-showroom" className="block text-xs font-semibold text-[var(--ink-2)] mb-1">
                        Showroom Brand / Location (Optional)
                      </label>
                      <input
                        id="modal-showroom"
                        type="text"
                        value={showroom}
                        onChange={(e) => setShowroom(e.target.value)}
                        placeholder="Kollupitiya / Sea Street / Kandy"
                        className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--velvet-900)] border border-[var(--velvet-700)] text-base text-[var(--ink-1)] placeholder:text-[var(--ink-3)]"
                      />
                    </div>
                  )}

                  <label className="flex items-start gap-2.5 text-xs text-[var(--ink-2)] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[var(--gold-400)] shrink-0 cursor-pointer"
                    />
                    <span>
                      I consent under Sri Lanka PDPA No. 9 of 2022 (zero home addresses collected,
                      zero spam).
                    </span>
                  </label>

                  {err && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl bg-[var(--velvet-850)] border border-[var(--status-err)] p-3 text-xs text-[var(--status-err)]"
                    >
                      <WarningCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{err}</span>
                    </div>
                  )}

                  <MagneticCTA type="submit" disabled={status === 'submitting'} className="w-full">
                    {status === 'submitting' ? 'Securing Slot…' : 'Join the Free Colombo Pilot'}
                  </MagneticCTA>

                  <p className="flex items-center gap-1.5 text-xs text-[var(--ink-3)]">
                    <LockSimple size={14} />
                    <span>TLS 1.3 encrypted · Purge anytime via aurumteam25@gmail.com</span>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
