'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Copy,
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-[rgba(18,2,5,0.78)] backdrop-blur-md"
        >
          {/* Double-Bezel Two-Tone Asymmetric Luxury Modal (Bordeaux Plaque + Pure White Details) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: 'spring', duration: 0.34, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-bezel-shell w-full max-w-3xl max-h-[92vh]"
          >
            <div className="modal-bezel-core grid grid-cols-1 md:grid-cols-12 max-h-[89vh] overflow-y-auto">
              {/* Left Pane: Deep Royal Bordeaux Physical Passport Plaque */}
              <div className="md:col-span-5 surface-dark p-7 sm:p-8 flex flex-col justify-between gap-8">
                <div className="space-y-2">
                  <span className="inline-block font-data text-xs text-[var(--gold-bright)]">
                    {item.id}
                  </span>
                  <h3 id="passport-modal-title" className="font-display text-2xl text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-dark-2)]">
                    {item.issuer} · {item.location}
                  </p>
                </div>

                {/* Tactile Bullion Weight Specimen */}
                <div className="py-5 border-y border-[rgba(247,223,158,0.2)] space-y-4">
                  <div>
                    <span className="text-xs text-[var(--ink-dark-3)] block">Verified Net Gold</span>
                    <span className="font-display text-4xl text-[var(--gold-bright)] mt-1 block">
                      {item.netGrams}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[var(--ink-dark-3)] block">Gross Weight</span>
                      <span className="font-data text-sm text-white mt-0.5 block">
                        {item.grossGrams}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--ink-dark-3)] block">Purity Seal</span>
                      <span className="font-data text-sm text-[var(--ok-dark)] mt-0.5 block">
                        {item.karat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[var(--ink-dark-2)]">
                  <span>{item.badge}</span>
                  <span className="font-data text-[var(--gold-bright)]">0 Addresses</span>
                </div>
              </div>

              {/* Right Pane: Crisp Pure White Editorial Details */}
              <div className="md:col-span-7 bg-white p-7 sm:p-8 flex flex-col justify-between gap-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div
                      role="tablist"
                      aria-label="Passport inspection views"
                      className="inline-flex p-1 rounded-full bg-[#f1eae6]"
                    >
                      {[
                        { id: 'assay' as const, label: 'Assay' },
                        { id: 'invoice' as const, label: 'Invoice' },
                        { id: 'counterpass' as const, label: '15m Pass' },
                      ].map((t) => {
                        const active = tab === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => setTab(t.id)}
                            className={`min-h-[38px] px-4 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                              active
                                ? 'bg-[#3a0710] text-white'
                                : 'text-[#492d32] hover:text-[#1d0509]'
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close Digital Passport Inspector"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#faf6f4] hover:bg-[#f1eae6] text-[#1d0509] cursor-pointer transition-colors shrink-0"
                    >
                      <X size={18} weight="regular" />
                    </button>
                  </div>

                  {tab === 'assay' && (
                    <dl className="divide-y divide-[#ede3de] text-sm">
                      <div className="py-3.5 flex items-baseline justify-between gap-4">
                        <dt className="text-[#6c4f55]">Craft &amp; Stone Separation</dt>
                        <dd className="font-medium text-[#1d0509] text-right">{item.hallmarkNote}</dd>
                      </div>
                      <div className="py-3.5 flex items-baseline justify-between gap-4">
                        <dt className="text-[#6c4f55]">Wear Audit Gate</dt>
                        <dd className="font-data text-xs font-medium text-[#0f6b45] text-right">
                          ±1.5% Natural Daily Wear
                        </dd>
                      </div>
                      <div className="py-3.5 flex items-baseline justify-between gap-4">
                        <dt className="text-[#6c4f55]">Original Invoice</dt>
                        <dd className="font-medium text-[#1d0509] text-right">
                          {item.invoiceStatus}
                        </dd>
                      </div>
                      <div className="py-3.5 flex items-baseline justify-between gap-4">
                        <dt className="text-[#6c4f55]">Home Address Columns</dt>
                        <dd className="font-data text-xs font-medium text-[#7a1020] text-right">
                          NULL (Never Collected)
                        </dd>
                      </div>
                    </dl>
                  )}

                  {tab === 'invoice' && (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-[#faf6f4] border border-[#e5dad5] p-5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d0509]">
                            <FileLock size={18} className="text-[#7a1020]" />
                            Original Showroom VAT Invoice
                          </span>
                          <span className="font-data text-xs text-[#0f6b45] font-medium">
                            AES-256-GCM
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#492d32] leading-relaxed">
                          Sealed in a private bucket at checkout. Only your biometric device key can
                          decrypt this PDF—never rival jewellers or routine admins.
                        </p>
                        <p className="pt-1 font-data text-xs text-[#6c4f55] break-all">
                          SHA-256: 9f4c82d1a0b7e63c51f0a2e88b7d41096a1c7e4e
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setHashVerified(true)}
                        className={`w-full min-h-[46px] px-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          hashVerified
                            ? 'bg-[#eef7f2] text-[#0f6b45] border border-[#b7dec9]'
                            : 'bg-[#3a0710] hover:bg-[#540b18] text-white'
                        }`}
                      >
                        {hashVerified ? (
                          <>
                            <ShieldCheck size={18} />
                            <span>Integrity Verified — 0 Bytes Tampered</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint size={18} />
                            <span>Verify SHA-256 Invoice Hash</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {tab === 'counterpass' && (
                    <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-[#faf6f4] border border-[#e5dad5] p-5">
                      <div className="w-32 h-32 rounded-2xl bg-white border border-[#e5dad5] flex flex-col items-center justify-center text-[#1d0509] shrink-0 shadow-sm">
                        <QrCode size={72} weight="regular" />
                        <span className="font-data text-xs text-[#7a1020] mt-0.5">
                          CP-{mins}
                          {secs}
                        </span>
                      </div>
                      <div className="space-y-2 text-center sm:text-left">
                        <span className="inline-flex items-center gap-1.5 font-data text-xs font-medium text-[#7a1020]">
                          <Timer size={14} />
                          Expires in {mins}:{secs}
                        </span>
                        <h4 className="text-base font-semibold text-[#1d0509]">
                          Customer-Present Unlock Pass
                        </h4>
                        <p className="text-xs sm:text-sm text-[#492d32] leading-relaxed">
                          Present this 15-minute QR at {item.issuer} for polishing or bridal
                          exchange. The terminal returns to blind mode automatically once expired.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#6c4f55] pt-4 border-t border-[#ede3de]">
                  Sample passport record demonstrating Project AURUM’s zero-knowledge schema.
                </p>
              </div>
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

-- 3. Schema Guarantee: ZERO residential address or GPS columns exist`;

export const ArchitectureBlueprintModal: React.FC<ArchitectureModalProps> = ({ open, onClose }) => {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-[rgba(18,2,5,0.78)] backdrop-blur-md"
        >
          {/* Crisp Two-Tone Editorial Spec Sheet (Pure White Header + Syntax-Highlighted Slate Code) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: 'spring', duration: 0.34, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-bezel-shell w-full max-w-3xl max-h-[92vh]"
          >
            <div className="modal-bezel-core max-h-[89vh] overflow-y-auto">
              {/* Top Half: Clean Pure White Editorial Spec */}
              <div className="bg-white p-7 sm:p-9 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 id="arch-modal-title" className="font-display text-2xl sm:text-3xl text-[#1d0509]">
                      Multi-Tenant Row-Level Security
                    </h3>
                    <p className="text-sm sm:text-base text-[#492d32] max-w-xl">
                      Tenant isolation is enforced directly inside PostgreSQL before a single row
                      reaches the API—making cross-showroom poaching mathematically impossible.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close Architecture Specification Modal"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#faf6f4] hover:bg-[#f1eae6] text-[#1d0509] cursor-pointer shrink-0"
                  >
                    <X size={18} weight="regular" />
                  </button>
                </div>

                {/* Clean 3-Column Ruled Facts (Zero boxed AI tiles!) */}
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-[#e5dad5]">
                  <div>
                    <dt className="text-xs font-medium text-[#6c4f55]">Isolation Layer</dt>
                    <dd className="text-sm font-semibold text-[#1d0509] mt-1">
                      PostgreSQL RLS Engine
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6c4f55]">Location Privacy</dt>
                    <dd className="text-sm font-semibold text-[#7a1020] mt-1">
                      0 Address or GPS Columns
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-[#6c4f55]">Heirloom Melting</dt>
                    <dd className="text-sm font-semibold text-[#1d0509] mt-1">
                      Immutable Parent → Child DAG
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Bottom Half: High-Contrast Syntax-Colored Charcoal SQL Panel */}
              <div className="bg-[#161316] text-[#f5f2f4] p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <span className="font-data text-xs text-[#b5a7ad]">
                    migrations/004_aurum_rls_policies.sql
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/18 text-xs font-medium text-white cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-[#74e3ad]" />
                        <span>Copied SQL</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="font-data text-xs sm:text-[13px] overflow-x-auto leading-7">
                  <code>
                    <span className="text-[#9e8f96]">
                      -- Project AURUM: Strict Multi-Tenant PostgreSQL RLS Policy
                    </span>
                    {'\n'}
                    <span className="text-[#f7df9e]">ALTER TABLE</span> jewellery_passports{' '}
                    <span className="text-[#f7df9e]">ENABLE ROW LEVEL SECURITY</span>;{'\n\n'}
                    <span className="text-[#9e8f96]">
                      -- 1. Families view all their own pieces across every showroom
                    </span>
                    {'\n'}
                    <span className="text-[#f7df9e]">CREATE POLICY</span> owner_full_vault_access{' '}
                    <span className="text-[#f7df9e]">ON</span> jewellery_passports{'\n'}
                    {'  '}
                    <span className="text-[#f7df9e]">FOR SELECT USING</span> (auth.uid() =
                    owner_user_id);{'\n\n'}
                    <span className="text-[#9e8f96]">
                      -- 2. Showrooms view STRICTLY their own rows; rivals get 0 rows (HTTP 403)
                    </span>
                    {'\n'}
                    <span className="text-[#f7df9e]">CREATE POLICY</span> issuer_isolated_ledger{' '}
                    <span className="text-[#f7df9e]">ON</span> jewellery_passports{'\n'}
                    {'  '}
                    <span className="text-[#f7df9e]">FOR SELECT USING</span> ({'\n'}
                    {'    '}current_setting(
                    <span className="text-[#ff9fb0]">&apos;app.tenant_id&apos;</span>,{' '}
                    <span className="text-[#74e3ad]">true</span>)::uuid = issuing_showroom_id{'\n'}
                    {'  '});
                  </code>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-[rgba(18,2,5,0.78)] backdrop-blur-md"
        >
          {/* Two-Tone Double-Bezel Invitation Sheet (Bordeaux Header + Pure White Form) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: 'spring', duration: 0.34, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-bezel-shell w-full max-w-lg max-h-[92vh]"
          >
            <div className="modal-bezel-core max-h-[89vh] overflow-y-auto">
              {/* Royal Bordeaux Velvet Header Band */}
              <div className="surface-dark px-6 sm:px-7 py-6 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-data text-xs text-[var(--gold-bright)] block">
                    Colombo Closed-Beta · Free Registration
                  </span>
                  <h3 id="quick-pilot-title" className="font-display text-2xl text-white">
                    Reserve Your Early-Access Slot
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Pilot Registration Modal"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                >
                  <X size={18} weight="regular" />
                </button>
              </div>

              {/* Crisp Pure White Form Body */}
              <div className="bg-white p-6 sm:p-7">
                {status === 'success' ? (
                  <div className="rounded-2xl bg-[#eef7f2] border border-[#b7dec9] p-5 space-y-3">
                    <p className="font-semibold text-[var(--ok-light)]">
                      Invitation reserved under Sri Lanka PDPA guidelines.
                    </p>
                    <p className="text-sm text-[var(--ink-light-2)]">
                      We have recorded your pilot slot for Colombo closed-beta onboarding.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-ghost-light w-full justify-center"
                    >
                      Return to Page
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                          className={`min-h-[46px] px-3 py-2 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                            role === r
                              ? 'bg-[#3a0710] text-white border-[#3a0710]'
                              : 'bg-[#faf6f4] text-[#492d32] border-[#e5dad5] hover:border-[#3a0710]'
                          }`}
                        >
                          {r === 'Jewellery Owner / Family'
                            ? 'Family Vault Owner'
                            : 'Retail Showroom'}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label
                        htmlFor="modal-name"
                        className="block text-xs font-semibold text-[#1d0509] mb-1.5"
                      >
                        Full Name
                      </label>
                      <input
                        id="modal-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Nimal Perera"
                        className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#faf6f4] border border-[#cfbeb7] text-base text-[#1d0509] placeholder:text-[#6c4f55]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-email"
                        className="block text-xs font-semibold text-[#1d0509] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.lk"
                        className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#faf6f4] border border-[#cfbeb7] text-base text-[#1d0509] placeholder:text-[#6c4f55]"
                      />
                    </div>

                    {role.includes('Retail') && (
                      <div>
                        <label
                          htmlFor="modal-showroom"
                          className="block text-xs font-semibold text-[#1d0509] mb-1.5"
                        >
                          Showroom Brand / Location (Optional)
                        </label>
                        <input
                          id="modal-showroom"
                          type="text"
                          value={showroom}
                          onChange={(e) => setShowroom(e.target.value)}
                          placeholder="Kollupitiya / Sea Street / Kandy"
                          className="w-full min-h-[46px] px-3.5 rounded-xl bg-[#faf6f4] border border-[#cfbeb7] text-base text-[#1d0509] placeholder:text-[#6c4f55]"
                        />
                      </div>
                    )}

                    <label className="flex items-start gap-2.5 text-xs text-[#492d32] cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#3a0710] shrink-0 cursor-pointer"
                      />
                      <span>
                        I consent under Sri Lanka PDPA No. 9 of 2022 (zero home addresses collected,
                        zero spam).
                      </span>
                    </label>

                    {err && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl bg-[var(--err-surface-light)] border border-[#f0c7c7] p-3 text-xs text-[var(--err-light)]"
                      >
                        <WarningCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{err}</span>
                      </div>
                    )}

                    <MagneticCTA
                      type="submit"
                      variant="dark"
                      disabled={status === 'submitting'}
                      className="w-full"
                    >
                      {status === 'submitting' ? 'Securing Slot…' : 'Join the Free Colombo Pilot'}
                    </MagneticCTA>

                    <p className="flex items-center gap-1.5 text-xs text-[#6c4f55]">
                      <LockSimple size={14} />
                      <span>TLS 1.3 encrypted · Purge anytime via aurumteam25@gmail.com</span>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
