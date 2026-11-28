'use client';

import React, { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, LockSimple, WarningCircle } from '@phosphor-icons/react';
import { MagneticCTA } from '../motion/Magnetic';

type PilotRole = 'Jewellery Owner / Family' | 'Retail Jeweller / Showroom Manager';

interface PilotWaitlistFormProps {
  variant?: 'embedded' | 'modal';
  onCloseModal?: () => void;
}

const INPUT_CLASS =
  'w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--paper-1)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]';

export const PilotWaitlistForm: React.FC<PilotWaitlistFormProps> = ({
  variant = 'embedded',
  onCloseModal,
}) => {
  const uid = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<PilotRole>('Jewellery Owner / Family');
  const [showroom, setShowroom] = useState('');
  const [consent, setConsent] = useState(false);
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isModal = variant === 'modal';
  const isShowroom = role === 'Retail Jeweller / Showroom Manager';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Enter your name so we can address your pilot invitation properly.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Enter a valid email address (for example, nimal@example.lk).');
      return;
    }
    if (!consent) {
      setErrorMessage('Confirm the Sri Lanka PDPA privacy notice before registering.');
      return;
    }

    setStatus('submitting');
    try {
      const body = new URLSearchParams({
        'form-name': 'waitlist',
        'bot-field': botField,
        name: trimmedName,
        email: trimmedEmail,
        role,
        showroom_name: isShowroom ? showroom.trim() : '',
        pdpa_consent: 'yes',
      }).toString();

      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus('success');
      setName('');
      setEmail('');
      setShowroom('');
      setConsent(false);
    } catch {
      setStatus('error');
      setErrorMessage(
        'Live form submission activates on our deployed Netlify HTTPS domain—use the direct email link below or submit on project-aurum.netlify.app.'
      );
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl bg-[#eef7f2] border border-[#b7dec9] p-6 space-y-3.5"
      >
        <div className="flex items-center gap-3">
          {/* Self-drawing SVG checkmark */}
          <svg viewBox="0 0 36 36" className="w-9 h-9 shrink-0" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="17" stroke="#0f6b45" strokeWidth="1.6" fill="white" />
            <motion.path
              d="M11 18.5 L15.8 23.2 L25.5 13.5"
              stroke="#0f6b45"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </svg>
          <p className="text-base font-semibold text-[var(--ok-light)]">
            Pilot invitation reserved.
          </p>
        </div>

        <p className="text-sm text-[var(--ink-light-2)]">
          Recorded under Sri Lanka PDPA guidelines. Questions? Email{' '}
          <a
            href="mailto:aurumteam25@gmail.com"
            className="underline font-medium text-[var(--ink-light-1)]"
          >
            aurumteam25@gmail.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => (isModal && onCloseModal ? onCloseModal() : setStatus('idle'))}
          className="btn-ghost-light text-xs"
        >
          {isModal ? 'Return to Page' : 'Register another participant'}
        </button>
      </div>
    );
  }

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify={!isModal ? 'true' : undefined}
      netlify-honeypot={!isModal ? 'bot-field' : undefined}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-3.5 sm:space-y-4"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${uid}-bot`}>
          Leave empty
          <input
            id={`${uid}-bot`}
            name="bot-field"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {isModal ? (
        <div className="grid grid-cols-2 gap-2">
          {(['Jewellery Owner / Family', 'Retail Jeweller / Showroom Manager'] as const).map(
            (r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className={`min-h-[44px] px-2.5 py-2 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                  role === r
                    ? 'bg-[#430a0e] text-white border-[#430a0e]'
                    : 'bg-[var(--paper-1)] text-[var(--ink-light-2)] border-[var(--hairline-light)] hover:border-[#430a0e]'
                }`}
              >
                {r === 'Jewellery Owner / Family' ? 'Family Vault' : 'Retail Showroom'}
              </button>
            )
          )}
        </div>
      ) : null}

      <div className={isModal ? 'space-y-3.5' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div>
          <label
            htmlFor={`${uid}-name`}
            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
          >
            Full Name
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Nimal Perera"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label
            htmlFor={`${uid}-email`}
            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
          >
            Email Address
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.lk"
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {!isModal && (
        <div>
          <label
            htmlFor={`${uid}-role`}
            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
          >
            Joining As
          </label>
          <select
            id={`${uid}-role`}
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value as PilotRole)}
            className={INPUT_CLASS}
          >
            <option value="Jewellery Owner / Family">Jewellery Owner / Family Vault</option>
            <option value="Retail Jeweller / Showroom Manager">
              Retail Jeweller / Showroom Manager
            </option>
          </select>
        </div>
      )}

      {isShowroom && (
        <div>
          <label
            htmlFor={`${uid}-showroom`}
            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
          >
            Showroom Brand / Location (Optional)
          </label>
          <input
            id={`${uid}-showroom`}
            name="showroom_name"
            type="text"
            autoComplete="organization"
            value={showroom}
            onChange={(e) => setShowroom(e.target.value)}
            placeholder="e.g., Kollupitiya / Sea Street / Kandy"
            className={INPUT_CLASS}
          />
        </div>
      )}

      <label
        htmlFor={`${uid}-pdpa`}
        className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--ink-light-2)] pt-1"
      >
        <input
          id={`${uid}-pdpa`}
          name="pdpa_consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#430a0e] shrink-0 cursor-pointer"
        />
        <span>
          I consent under the{' '}
          <a
            href="#privacy"
            onClick={onCloseModal}
            className="underline font-semibold text-[var(--ink-light-1)]"
          >
            Sri Lanka PDPA Privacy Notice
          </a>{' '}
          (zero home addresses collected, zero spam).
        </span>
      </label>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl bg-[var(--err-surface-light)] border border-[#f0c7c7] p-3.5 text-xs text-[var(--err-light)] space-y-2"
        >
          <div className="flex items-start gap-2">
            <WarningCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          {status === 'error' && (
            <a
              href={`mailto:aurumteam25@gmail.com?subject=${encodeURIComponent(
                'Project AURUM Colombo Pilot Registration'
              )}&body=${encodeURIComponent(
                `Name: ${name}\nRole: ${role}\nShowroom: ${showroom}`
              )}`}
              className="inline-flex items-center gap-1 underline font-semibold text-[var(--ink-light-1)]"
            >
              Email aurumteam25@gmail.com directly
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      )}

      <MagneticCTA
        type="submit"
        variant="dark"
        cursorLabel="Reserve"
        disabled={status === 'submitting'}
        className="w-full"
      >
        {status === 'submitting' ? 'Securing Your Pilot Slot…' : 'Join the Free Colombo Pilot'}
      </MagneticCTA>

      <p className="flex items-center gap-1.5 text-xs text-[var(--ink-light-3)]">
        <LockSimple size={14} className="shrink-0" aria-hidden="true" />
        <span>
          TLS 1.3 encrypted · Delete anytime via{' '}
          <a href="mailto:aurumteam25@gmail.com" className="underline text-[var(--ink-light-2)]">
            aurumteam25@gmail.com
          </a>
        </span>
      </p>
    </form>
  );
};
