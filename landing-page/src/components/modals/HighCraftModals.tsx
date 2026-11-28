'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Copy,
  FileLock,
  Fingerprint,
  QrCode,
  ShieldCheck,
  Timer,
  X,
} from '@phosphor-icons/react';
import {
  HERO_VAULT_ITEMS,
  RLS_SQL_SNIPPET,
  VaultItem,
} from '../../content/aurumContent';
import { PilotWaitlistForm } from '../shared/PilotWaitlistForm';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  maxWidthClass?: string;
  coreClassName?: string;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  labelledBy,
  maxWidthClass = 'max-w-3xl',
  coreClassName = '',
  children,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-2.5 sm:p-6 bg-[rgba(14,1,2,0.84)] backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', duration: 0.32, bounce: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`modal-bezel-shell w-full ${maxWidthClass} max-h-[90svh]`}
          >
            <div
              data-lenis-prevent
              className={`modal-bezel-core max-h-[87svh] overflow-y-auto overscroll-contain ${coreClassName}`}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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
  const [selectedId, setSelectedId] = useState<string>(
    initialItem?.id ?? HERO_VAULT_ITEMS[0].id
  );
  const [tab, setTab] = useState<'assay' | 'invoice' | 'counterpass'>('assay');
  const [secondsLeft, setSecondsLeft] = useState(894);
  const [hashVerified, setHashVerified] = useState(false);
  const plaqueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialItem) setSelectedId(initialItem.id);
  }, [initialItem]);

  useEffect(() => {
    if (!open) return;
    setHashVerified(false);
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : 900));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  const item = HERO_VAULT_ITEMS.find((v) => v.id === selectedId) ?? HERO_VAULT_ITEMS[0];
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const onPlaqueMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = plaqueRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / (r.width || 1) - 0.5;
    const py = (e.clientY - r.top) / (r.height || 1) - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
  };

  const onPlaqueLeave = () => {
    if (plaqueRef.current) plaqueRef.current.style.transform = '';
  };

  const assayRows = [
    { label: 'Craft & Stone Separation', value: item.hallmarkNote, cls: 'font-medium text-[#1a0405]' },
    { label: 'Wear Audit Gate', value: '±1.5% Natural Daily Wear', cls: 'font-data text-xs font-medium text-[#0f6b45]' },
    { label: 'Original Invoice', value: item.invoiceStatus, cls: 'font-medium text-[#1a0405]' },
    { label: 'Home Address Columns', value: 'NULL (Never Collected)', cls: 'font-data text-xs font-medium text-[#8b141b]' },
  ];

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      labelledBy="v3-passport-title"
      coreClassName="grid grid-cols-1 md:grid-cols-12"
    >
      {/* Left: 3D-Tilting Ruby Velvet Holographic Passport Plaque */}
      <div
        ref={plaqueRef}
        onPointerMove={onPlaqueMove}
        onPointerLeave={onPlaqueLeave}
        className="md:col-span-5 surface-ruby p-5 sm:p-7 md:p-8 flex flex-col justify-between gap-5 transition-transform duration-200"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <span className="inline-block font-data text-xs text-[var(--gold-bright)]">
                {item.id}
              </span>
              <h3
                id="v3-passport-title"
                className="font-display text-xl sm:text-2xl text-white leading-snug"
              >
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-dark-2)]">
                {item.issuer} · {item.location}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Digital Passport Inspector"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/12 hover:bg-white/22 text-white cursor-pointer shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* 3-Specimen Selector Pills */}
          <div className="flex flex-wrap gap-1.5">
            {HERO_VAULT_ITEMS.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedId(v.id)}
                className={`px-2.5 py-1 rounded-full font-data text-xs cursor-pointer transition-colors ${
                  v.id === item.id
                    ? 'bg-[var(--gold-bullion)] text-[var(--ruby-0)] font-semibold'
                    : 'bg-white/10 text-[var(--ink-dark-2)] hover:bg-white/18'
                }`}
              >
                0{i + 1} · {v.karat.split('·')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="py-3.5 md:py-5 border-y border-[rgba(247,223,163,0.2)] flex md:block items-end justify-between gap-4 md:space-y-4">
          <div>
            <span className="text-xs text-[var(--ink-dark-3)] block">Verified Net Gold</span>
            <span className="font-display text-3xl sm:text-4xl gold-foil-sweep mt-0.5 block">
              {item.netGrams}
            </span>
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--ink-dark-3)] block">Gross</span>
              <span className="font-data text-sm text-white mt-0.5 block">{item.grossGrams}</span>
            </div>
            <div>
              <span className="text-[var(--ink-dark-3)] block">Purity</span>
              <span className="font-data text-sm text-[var(--ok-dark)] mt-0.5 block">
                {item.karat}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between text-xs text-[var(--ink-dark-2)]">
          <span>{item.badge}</span>
          <span className="font-data text-[var(--gold-bright)]">0 Addresses</span>
        </div>
      </div>

      {/* Right: Crisp Pure White Editorial Details */}
      <div className="md:col-span-7 bg-white p-5 sm:p-7 md:p-8 flex flex-col justify-between gap-5">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Passport inspection views"
              className="grid grid-cols-3 w-full md:w-auto p-1 rounded-full bg-[#f2ebe9]"
            >
              {(
                [
                  { id: 'assay', label: 'Assay' },
                  { id: 'invoice', label: 'Invoice' },
                  { id: 'counterpass', label: '15m Pass' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`min-h-[38px] px-3 sm:px-4 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    tab === t.id
                      ? 'bg-[#430a0e] text-white'
                      : 'text-[#4a2c2e] hover:text-[#1a0405]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Digital Passport Inspector"
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#fbf7f6] hover:bg-[#f2ebe9] text-[#1a0405] cursor-pointer transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {tab === 'assay' && (
            <dl className="divide-y divide-[#ece2e0] text-sm">
              {assayRows.map((r) => (
                <div
                  key={r.label}
                  className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4"
                >
                  <dt className="text-xs sm:text-sm text-[#6e4f51]">{r.label}</dt>
                  <dd className={`${r.cls} sm:text-right`}>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'invoice' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[#fbf7f6] border border-[#e6dbd9] p-4 sm:p-5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a0405]">
                    <FileLock size={18} className="text-[#8b141b] shrink-0" />
                    Original Showroom VAT Invoice
                  </span>
                  <span className="font-data text-xs text-[#0f6b45] font-medium">AES-256-GCM</span>
                </div>
                <p className="text-xs sm:text-sm text-[#4a2c2e] leading-relaxed">
                  Sealed in a private bucket at checkout. Only your biometric device key can decrypt
                  this PDF—never rival jewellers or routine admins.
                </p>
                <p className="pt-1 font-data text-xs text-[#6e4f51] break-all">
                  SHA-256: 9f4c82d1a0b7e63c51f0a2e88b7d41096a1c7e4e
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHashVerified(true)}
                className={`w-full min-h-[46px] px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  hashVerified
                    ? 'bg-[#eef7f2] text-[#0f6b45] border border-[#b7dec9]'
                    : 'bg-[#430a0e] hover:bg-[#5e0f15] text-white'
                }`}
              >
                {hashVerified ? (
                  <>
                    <ShieldCheck size={18} className="shrink-0" />
                    <span>Integrity Verified — 0 Bytes Tampered</span>
                  </>
                ) : (
                  <>
                    <Fingerprint size={18} className="shrink-0" />
                    <span>Verify SHA-256 Invoice Hash</span>
                  </>
                )}
              </button>
            </div>
          )}

          {tab === 'counterpass' && (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 rounded-2xl bg-[#fbf7f6] border border-[#e6dbd9] p-4 sm:p-5">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border border-[#e6dbd9] flex flex-col items-center justify-center text-[#1a0405] shrink-0 shadow-sm">
                <QrCode size={66} />
                <span className="font-data text-xs text-[#8b141b] mt-0.5">
                  CP-{mins}
                  {secs}
                </span>
              </div>
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 font-data text-xs font-medium text-[#8b141b]">
                  <Timer size={14} />
                  Expires in {mins}:{secs}
                </span>
                <h4 className="text-base font-semibold text-[#1a0405]">
                  Customer-Present Unlock Pass
                </h4>
                <p className="text-xs sm:text-sm text-[#4a2c2e] leading-relaxed">
                  Present this 15-minute QR at {item.issuer} for polishing or bridal exchange. The
                  terminal returns to blind mode once expired.
                </p>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-[#6e4f51] pt-3 border-t border-[#ece2e0]">
          Sample passport demonstrating Project AURUM’s zero-knowledge schema.
        </p>
      </div>
    </ModalShell>
  );
};

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
}

const ARCH_SPECS = [
  { label: 'Isolation Layer', value: 'PostgreSQL RLS Engine', cls: 'text-[#1a0405]' },
  { label: 'Location Privacy', value: '0 Address or GPS Columns', cls: 'text-[#8b141b]' },
  { label: 'Heirloom Melting', value: 'Immutable Parent → Child DAG', cls: 'text-[#1a0405]' },
];

export const ArchitectureBlueprintModal: React.FC<SimpleModalProps> = ({ open, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(RLS_SQL_SNIPPET).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="v3-arch-title">
      <div className="bg-white p-5 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <h3
              id="v3-arch-title"
              className="font-display text-xl sm:text-3xl text-[#1a0405] leading-snug"
            >
              Multi-Tenant Row-Level Security
            </h3>
            <p className="text-xs sm:text-base text-[#4a2c2e] max-w-xl leading-relaxed">
              Tenant isolation is enforced directly inside PostgreSQL before a single row reaches
              the API—making cross-showroom poaching mathematically impossible.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Architecture Specification Modal"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#fbf7f6] hover:bg-[#f2ebe9] text-[#1a0405] cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 pt-4 border-t border-[#e6dbd9]">
          {ARCH_SPECS.map((spec) => (
            <div key={spec.label}>
              <dt className="text-xs font-medium text-[#6e4f51]">{spec.label}</dt>
              <dd className={`text-sm font-semibold ${spec.cls} mt-0.5`}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="bg-[#161316] text-[#f5f2f4] p-5 sm:p-8 space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
          <span className="font-data text-xs text-[#b5a7ad] truncate min-w-0">
            migrations/004_aurum_rls_policies.sql
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white/20 text-xs font-medium text-white whitespace-nowrap shrink-0 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-[#74e3ad]" />
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

        <pre className="font-data text-xs sm:text-[13px] whitespace-pre-wrap break-words sm:whitespace-pre sm:overflow-x-auto leading-6 sm:leading-7">
          <code>{RLS_SQL_SNIPPET}</code>
        </pre>
      </div>
    </ModalShell>
  );
};

export const QuickPilotModal: React.FC<SimpleModalProps> = ({ open, onClose }) => (
  <ModalShell open={open} onClose={onClose} labelledBy="v3-pilot-title" maxWidthClass="max-w-lg">
    <div className="surface-ruby px-5 sm:px-7 py-5 sm:py-6 flex items-start justify-between gap-3">
      <div className="space-y-1 min-w-0">
        <span className="font-data text-xs text-[var(--gold-bright)] block">
          Colombo Closed-Beta · Free Registration
        </span>
        <h3 id="v3-pilot-title" className="font-display text-xl sm:text-2xl text-white">
          Reserve Your Early-Access Slot
        </h3>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Pilot Registration Modal"
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/12 hover:bg-white/22 text-white cursor-pointer shrink-0"
      >
        <X size={18} />
      </button>
    </div>

    <div className="bg-white p-5 sm:p-7">
      <PilotWaitlistForm variant="modal" onCloseModal={onClose} />
    </div>
  </ModalShell>
);
