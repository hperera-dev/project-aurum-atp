'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  EnvelopeSimple,
  GithubLogo,
  LockSimple,
  WarningCircle,
} from '@phosphor-icons/react';
import { MagneticCTA } from './MagneticCTA';
import { TeamShowcaseSection } from './TeamShowcaseSection';

const encodeFormData = (data: Record<string, string>) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export const TeamAndCloserSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Jewellery Owner / Family' | 'Retail Jeweller / Showroom Manager'>(
    'Jewellery Owner / Family'
  );
  const [showroomName, setShowroomName] = useState('');
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [botField, setBotField] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isShowroom = role === 'Retail Jeweller / Showroom Manager';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setErrorMessage('Enter your name so we can address your pilot invitation properly.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Enter a valid email address (for example, nimal@example.lk).');
      return;
    }
    if (!pdpaConsent) {
      setErrorMessage('Confirm the Sri Lanka PDPA privacy notice before registering.');
      return;
    }

    setStatus('submitting');

    try {
      const payload: Record<string, string> = {
        'form-name': 'waitlist',
        'bot-field': botField,
        name: trimmedName,
        email: trimmedEmail,
        role,
        showroom_name: isShowroom ? showroomName.trim() : '',
        pdpa_consent: pdpaConsent ? 'yes' : 'no',
      };

      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormData(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus('success');
      setFullName('');
      setEmail('');
      setShowroomName('');
      setPdpaConsent(false);
    } catch {
      setStatus('error');
      setErrorMessage(
        'Live form submission activates on our deployed Netlify HTTPS domain—use the direct email link below or submit on project-aurum.netlify.app.'
      );
    }
  };

  return (
    <>
      <TeamShowcaseSection />

      <section
        id="waitlist"
        aria-labelledby="waitlist-heading"
        className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <h2 id="waitlist-heading" className="heading-section text-[var(--ink-light-1)]">
                Join the free <span className="text-[#6e0d1c]">Colombo</span> pilot.
              </h2>

              <p className="text-base font-medium text-[var(--ink-light-2)] max-w-[44ch] leading-relaxed">
                Log existing home heirlooms on day one as a family—or book a 1-on-1 zero-disruption
                POS walkthrough for your showroom.
              </p>

              <ul className="space-y-2.5 text-sm font-medium text-[var(--ink-light-2)] pt-2">
                <li className="flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-[#6e0d1c] shrink-0" aria-hidden="true" />
                  <span>Free early-access registration for families and partner showrooms</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-[#6e0d1c] shrink-0" aria-hidden="true" />
                  <span>Zero home addresses collected · Zero promotional spam</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-[#6e0d1c] shrink-0" aria-hidden="true" />
                  <span>Sri Lanka PDPA No. 9 of 2022 Section 14 instant erasure rights</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="bezel-light-outer">
                <div className="bezel-light-inner p-6 sm:p-8">
                  <h3 className="heading-card text-[var(--ink-light-1)] mb-1">
                    Reserve Your Early-Access Invitation
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-light-2)] mb-6">
                    Takes 20 seconds. Purge your record anytime.
                  </p>

                  {status === 'success' ? (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-2xl bg-[#eef7f2] border border-[#b7dec9] p-6 space-y-3"
                    >
                      <p className="text-base font-semibold text-[var(--ok-light)]">
                        Pilot invitation reserved.
                      </p>
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
                        onClick={() => setStatus('idle')}
                        className="btn-ghost-light text-xs"
                      >
                        Register another participant
                      </button>
                    </div>
                  ) : (
                    <form
                      name="waitlist"
                      method="POST"
                      data-netlify="true"
                      netlify-honeypot="bot-field"
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      <input type="hidden" name="form-name" value="waitlist" />
                      <div className="hidden" aria-hidden="true">
                        <label htmlFor="bot-field-input">
                          Leave this field empty
                          <input
                            id="bot-field-input"
                            name="bot-field"
                            value={botField}
                            onChange={(e) => setBotField(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="waitlist-name"
                            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
                          >
                            Full Name
                          </label>
                          <input
                            id="waitlist-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g., Nimal Perera"
                            className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="waitlist-email"
                            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
                          >
                            Email Address
                          </label>
                          <input
                            id="waitlist-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.lk"
                            className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="waitlist-role"
                          className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
                        >
                          Joining As
                        </label>
                        <select
                          id="waitlist-role"
                          name="role"
                          value={role}
                          onChange={(e) =>
                            setRole(
                              e.target.value as
                                | 'Jewellery Owner / Family'
                                | 'Retail Jeweller / Showroom Manager'
                            )
                          }
                          className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)]"
                        >
                          <option value="Jewellery Owner / Family">
                            Jewellery Owner / Family Vault
                          </option>
                          <option value="Retail Jeweller / Showroom Manager">
                            Retail Jeweller / Showroom Manager
                          </option>
                        </select>
                      </div>

                      {isShowroom && (
                        <div>
                          <label
                            htmlFor="waitlist-showroom"
                            className="block text-xs font-semibold text-[var(--ink-light-1)] mb-1.5"
                          >
                            Showroom Brand / Location (Optional)
                          </label>
                          <input
                            id="waitlist-showroom"
                            name="showroom_name"
                            type="text"
                            autoComplete="organization"
                            value={showroomName}
                            onChange={(e) => setShowroomName(e.target.value)}
                            placeholder="e.g., Kollupitiya / Sea Street / Kandy"
                            className="w-full min-h-[46px] px-3.5 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                          />
                        </div>
                      )}

                      <label
                        htmlFor="waitlist-pdpa"
                        className="flex items-start gap-3 cursor-pointer text-xs text-[var(--ink-light-2)] pt-1"
                      >
                        <input
                          id="waitlist-pdpa"
                          name="pdpa_consent"
                          type="checkbox"
                          required
                          checked={pdpaConsent}
                          onChange={(e) => setPdpaConsent(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded accent-[#3a0710] shrink-0 cursor-pointer"
                        />
                        <span>
                          I consent under the{' '}
                          <a
                            href="#privacy"
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
                            <WarningCircle
                              size={16}
                              weight="regular"
                              className="shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{errorMessage}</span>
                          </div>
                          {status === 'error' && (
                            <a
                              href={`mailto:aurumteam25@gmail.com?subject=${encodeURIComponent(
                                'Project AURUM Colombo Pilot Registration'
                              )}&body=${encodeURIComponent(
                                `Name: ${fullName}\nRole: ${role}\nShowroom: ${showroomName}`
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
                        disabled={status === 'submitting'}
                        className="w-full"
                      >
                        {status === 'submitting'
                          ? 'Securing Your Pilot Slot…'
                          : 'Join the Free Colombo Pilot'}
                      </MagneticCTA>

                      <p className="flex items-center gap-1.5 text-xs text-[var(--ink-light-3)]">
                        <LockSimple size={14} aria-hidden="true" />
                        <span>
                          TLS 1.3 encrypted · Delete anytime via{' '}
                          <a
                            href="mailto:aurumteam25@gmail.com"
                            className="underline text-[var(--ink-light-2)]"
                          >
                            aurumteam25@gmail.com
                          </a>
                        </span>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside
            id="privacy"
            aria-labelledby="pdpa-heading"
            className="rounded-2xl bg-[var(--paper-pure)] border border-[var(--hairline-light)] p-5 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--hairline-light)]">
              <h3 id="pdpa-heading" className="text-sm font-semibold text-[var(--ink-light-1)]">
                Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022 — Privacy Notice
              </h3>
              <span className="font-data text-xs text-[#7a1020]">
                Controller: Project AURUM (SE-10)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-[var(--ink-light-2)]">
              <p>
                <strong className="text-[var(--ink-light-1)]">Data:</strong> Strictly name, email,
                pilot role, and optional showroom submitted above.
              </p>
              <p>
                <strong className="text-[var(--ink-light-1)]">Zero Tracking:</strong> No home
                addresses, NIC numbers, GPS, or ad cookies collected.
              </p>
              <p>
                <strong className="text-[var(--ink-light-1)]">Purpose:</strong> Closed-beta
                onboarding over TLS 1.3 only—never shared with rivals.
              </p>
              <p>
                <strong className="text-[var(--ink-light-1)]">Section 14 Erasure:</strong> Request
                instant deletion anytime via{' '}
                <a
                  href="mailto:aurumteam25@gmail.com"
                  className="underline font-semibold text-[var(--ink-light-1)]"
                >
                  aurumteam25@gmail.com
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Monumental Royal Bordeaux Footer */}
      <footer id="contact" className="surface-dark pt-16 md:pt-20 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#4a0b16]">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/theLogo.jpg"
                  alt="Project AURUM official emblem"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-[rgba(247,223,158,0.55)]"
                />
                <div>
                  <p className="font-display text-lg text-[var(--ink-dark-1)]">Project AURUM</p>
                  <p className="font-data text-xs text-[var(--gold-bright)]">
                    Colombo, Sri Lanka · Group SE-10
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="mailto:aurumteam25@gmail.com"
                  className="btn-ghost-dark text-xs min-h-[42px] py-1.5"
                >
                  <EnvelopeSimple size={15} className="text-[var(--gold-bright)]" />
                  <span>aurumteam25@gmail.com</span>
                </a>
                <a
                  href="https://github.com/hperera-dev/project-aurum-atp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark text-xs min-h-[42px] py-1.5"
                >
                  <GithubLogo size={15} className="text-[var(--gold-bright)]" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-sm text-[var(--ink-dark-2)]">
              <p className="font-data text-xs text-[var(--gold-bright)]">SECTIONS</p>
              <ul className="space-y-1.5">
                <li>
                  <a href="#problem" className="hover:text-[var(--gold-bright)]">
                    The Scissors Cut
                  </a>
                </li>
                <li>
                  <a href="#prototype" className="hover:text-[var(--gold-bright)]">
                    Figma Screens
                  </a>
                </li>
                <li>
                  <a href="#solution" className="hover:text-[var(--gold-bright)]">
                    RLS Firewall
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-[var(--gold-bright)]">
                    PDPA Privacy
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-sm text-[var(--ink-dark-2)]">
              <p className="font-data text-xs text-[var(--gold-bright)]">
                STANDARDS &amp; ACADEMIC
              </p>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="https://ngja.gov.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--gold-bright)]"
                  >
                    <span>NGJA Sri Lanka</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cbsl.gov.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--gold-bright)]"
                  >
                    <span>Central Bank of Sri Lanka (CBSL)</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.iit.ac.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--gold-bright)]"
                  >
                    <span>IIT Sri Lanka</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.westminster.ac.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--gold-bright)]"
                  >
                    <span>University of Westminster</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--ink-dark-3)]">
            <p>© {new Date().getFullYear()} Project AURUM (Group SE-10). All rights reserved.</p>
            <p>Never lose a gram of proof.</p>
          </div>
        </div>

        {/* Flush Bottom-Anchored Monumental Gambarino Wordmark */}
        <div
          aria-hidden="true"
          className="select-none pointer-events-none text-center leading-[0.76] pt-2 overflow-hidden"
        >
          <span
            style={{ fontSize: 'var(--text-monument)' }}
            className="font-display tracking-[-0.03em] text-[#3a0710] block translate-y-[9%]"
          >
            AURUM
          </span>
        </div>
      </footer>
    </>
  );
};
