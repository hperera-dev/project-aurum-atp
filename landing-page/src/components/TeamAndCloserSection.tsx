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
import { TEAM_MEMBERS } from '../data/aurumData';
import { MagneticCTA } from './MagneticCTA';

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
      {/* Beat 7A: Pure White Team Masthead */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="bg-[var(--paper-pure)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7 space-y-3">
              <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
                Engineered in Colombo · Group SE-10
              </p>
              <h2 id="team-heading" className="heading-section text-[var(--ink-light-1)]">
                Five specialists across security architecture, UI craft, and data ethics.
              </h2>
            </div>
            <p className="lg:col-span-5 text-sm sm:text-base text-[var(--ink-light-2)]">
              Developed at the Informatics Institute of Technology (IIT Sri Lanka) in academic
              collaboration with the University of Westminster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <article
                key={member.id}
                className={`studio-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5 ${
                  idx < 2 ? 'md:col-span-3' : 'md:col-span-2'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--ink-light-1)] text-[var(--gold-bright)] font-display text-sm font-medium shrink-0"
                    >
                      {member.initials}
                    </span>
                    <span className="font-data text-xs text-[var(--bronze-ink)] text-right">
                      {member.focusTag}
                    </span>
                  </div>

                  <div>
                    <h3 className="heading-card text-[var(--ink-light-1)]">{member.name}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--bronze-ink)] mt-1">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-sm text-[var(--ink-light-2)] leading-relaxed">
                    {member.responsibility}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Beat 7B: Lit Mineral Waitlist Closer + PDPA Notice */}
      <section
        id="waitlist"
        aria-labelledby="waitlist-heading"
        className="bg-[var(--paper-mineral)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
      >
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-6">
              <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
                Colombo Early-Access Pilot · Free Registration
              </p>

              <h2 id="waitlist-heading" className="heading-section text-[var(--ink-light-1)]">
                Protect the gold your family owns, or bring 8-second digital proof to your
                showroom.
              </h2>

              <p className="text-base text-[var(--ink-light-2)] max-w-[48ch] leading-relaxed">
                Join our free Colombo closed-beta cohort. Log existing home heirlooms on day one as
                an owner, or book a guided, zero-disruption POS walkthrough for your jewellery
                counter.
              </p>

              <ol className="divide-y divide-[var(--hairline-light)] border-y border-[var(--hairline-light)] text-sm text-[var(--ink-light-2)]">
                <li className="py-3.5 flex items-baseline gap-4">
                  <span className="font-data text-xs text-[var(--bronze-ink)]">01</span>
                  <span>Your email is queued for our Colombo closed-beta rollout.</span>
                </li>
                <li className="py-3.5 flex items-baseline gap-4">
                  <span className="font-data text-xs text-[var(--bronze-ink)]">02</span>
                  <span>Owners receive private vault access; showrooms receive a 1-on-1 POS demo.</span>
                </li>
                <li className="py-3.5 flex items-baseline gap-4">
                  <span className="font-data text-xs text-[var(--bronze-ink)]">03</span>
                  <span>Zero promotional spam—never sold or disclosed to competing jewellers.</span>
                </li>
              </ol>

              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-[var(--ink-light-2)]">
                <li className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-[var(--ok-light)]" aria-hidden="true" />
                  Free for pilot participants
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-[var(--ok-light)]" aria-hidden="true" />
                  Zero home addresses collected
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check size={16} className="text-[var(--ok-light)]" aria-hidden="true" />
                  Sri Lanka PDPA No. 9 of 2022 aligned
                </li>
              </ul>
            </div>

            {/* Clean White Double-Bezel Netlify Waitlist Form */}
            <div className="lg:col-span-6">
              <div className="bezel-light-outer">
                <div className="bezel-light-inner p-6 sm:p-8">
                  <h3 className="heading-card text-[var(--ink-light-1)] mb-1">
                    Reserve Your Early-Access Invitation
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--ink-light-2)] mb-6">
                    Takes 20 seconds. Unsubscribe or purge your record anytime.
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
                        Your invitation request has been recorded under Sri Lanka PDPA guidelines.
                        Questions? Reach our engineering team at{' '}
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

                      <div>
                        <label
                          htmlFor="waitlist-name"
                          className="block text-xs sm:text-sm font-medium text-[var(--ink-light-1)] mb-1.5"
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
                          className="w-full min-h-[48px] px-4 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="waitlist-email"
                          className="block text-xs sm:text-sm font-medium text-[var(--ink-light-1)] mb-1.5"
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
                          className="w-full min-h-[48px] px-4 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="waitlist-role"
                          className="block text-xs sm:text-sm font-medium text-[var(--ink-light-1)] mb-1.5"
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
                          className="w-full min-h-[48px] px-4 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)]"
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
                            className="block text-xs sm:text-sm font-medium text-[var(--ink-light-1)] mb-1.5"
                          >
                            Jewellery Brand or Showroom Location (Optional)
                          </label>
                          <input
                            id="waitlist-showroom"
                            name="showroom_name"
                            type="text"
                            autoComplete="organization"
                            value={showroomName}
                            onChange={(e) => setShowroomName(e.target.value)}
                            placeholder="e.g., Kollupitiya / Sea Street / Kandy"
                            className="w-full min-h-[48px] px-4 rounded-xl bg-[var(--paper-mineral)] border border-[var(--hairline-strong)] text-base text-[var(--ink-light-1)] placeholder:text-[var(--ink-light-3)]"
                          />
                        </div>
                      )}

                      <div className="pt-1">
                        <label
                          htmlFor="waitlist-pdpa"
                          className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-[var(--ink-light-2)]"
                        >
                          <input
                            id="waitlist-pdpa"
                            name="pdpa_consent"
                            type="checkbox"
                            required
                            checked={pdpaConsent}
                            onChange={(e) => setPdpaConsent(e.target.checked)}
                            className="mt-1 w-5 h-5 rounded accent-[#091711] shrink-0 cursor-pointer"
                          />
                          <span>
                            I consent to Project AURUM storing my name and email solely for pilot
                            onboarding in accordance with the{' '}
                            <a
                              href="#privacy"
                              className="underline font-medium text-[var(--ink-light-1)]"
                            >
                              Sri Lanka PDPA Privacy Notice
                            </a>
                            .
                          </span>
                        </label>
                      </div>

                      {errorMessage && (
                        <div
                          role="alert"
                          className="rounded-xl bg-[var(--err-surface-light)] border border-[#f0c7c7] p-3.5 text-xs sm:text-sm text-[var(--err-light)] space-y-2"
                        >
                          <div className="flex items-start gap-2">
                            <WarningCircle
                              size={18}
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
                              className="inline-flex items-center gap-1.5 underline font-semibold text-[var(--ink-light-1)]"
                            >
                              Send pilot request directly to aurumteam25@gmail.com
                              <ArrowUpRight size={14} weight="regular" />
                            </a>
                          )}
                        </div>
                      )}

                      <div className="pt-2">
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
                      </div>

                      <p className="flex items-center gap-1.5 text-xs text-[var(--ink-light-3)] pt-1">
                        <LockSimple size={14} weight="regular" aria-hidden="true" />
                        <span>
                          TLS 1.3 encrypted · Request instant deletion anytime at{' '}
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

          {/* Compact Statutory PDPA Notice */}
          <aside
            id="privacy"
            aria-labelledby="pdpa-heading"
            className="rounded-3xl bg-[var(--paper-pure)] border border-[var(--hairline-light)] p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-[var(--hairline-light)]">
              <h3 id="pdpa-heading" className="heading-card text-lg text-[var(--ink-light-1)]">
                Statutory Privacy Notice — Sri Lanka Personal Data Protection Act (PDPA) No. 9 of
                2022
              </h3>
              <span className="font-data text-xs text-[var(--bronze-ink)]">
                Data Controller: Project AURUM (SE-10)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm text-[var(--ink-light-2)]">
              <div>
                <p className="font-semibold text-[var(--ink-light-1)] mb-1">
                  1. Personal Data Collected
                </p>
                <p>
                  Limited strictly to your name, email address, selected pilot role, and optional
                  showroom name submitted voluntarily via the waitlist form above.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--ink-light-1)] mb-1">
                  2. Zero Location Tracking
                </p>
                <p>
                  We never request or store residential street addresses, NIC numbers, GPS
                  coordinates, or third-party advertising cookies on this website.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--ink-light-1)] mb-1">
                  3. Purpose &amp; Security
                </p>
                <p>
                  Transmitted over HTTPS (TLS 1.3) solely to notify you of Colombo closed-beta
                  onboarding. Never sold or disclosed to competing jewellers.
                </p>
              </div>
              <div>
                <p className="font-semibold text-[var(--ink-light-1)] mb-1">
                  4. Section 14 Erasure Rights
                </p>
                <p>
                  You may inspect, rectify, or permanently purge your waitlist record at any time by
                  emailing{' '}
                  <a
                    href="mailto:aurumteam25@gmail.com"
                    className="underline font-medium text-[var(--ink-light-1)]"
                  >
                    aurumteam25@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Beat 8: Dark Obsidian Architectural Bookend Footer */}
      <footer
        id="contact"
        className="surface-dark pt-16 md:pt-20 overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[oklch(26%_0.026_166)]">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/theLogo.jpg"
                  alt="Project AURUM official emblem"
                  width={42}
                  height={42}
                  className="w-10 h-10 rounded-full object-cover border border-[oklch(82%_0.1_83/0.5)]"
                />
                <div>
                  <p className="font-display text-lg font-medium text-[var(--ink-dark-1)]">
                    Project AURUM
                  </p>
                  <p className="font-data text-xs text-[var(--gold-bright)]">
                    Private Jewellery Ownership &amp; Showroom Registry
                  </p>
                </div>
              </div>

              <p className="text-sm text-[var(--ink-dark-2)] max-w-sm">
                Engineered in Colombo by Group SE-10 at the Informatics Institute of Technology (IIT
                Sri Lanka) in academic collaboration with the University of Westminster.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="mailto:aurumteam25@gmail.com"
                  className="btn-ghost-dark text-xs sm:text-sm min-h-[44px] py-2"
                >
                  <EnvelopeSimple size={16} weight="regular" className="text-[var(--gold-bright)]" />
                  <span>aurumteam25@gmail.com</span>
                </a>
                <a
                  href="https://github.com/hperera-dev/project-aurum-atp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark text-xs sm:text-sm min-h-[44px] py-2"
                >
                  <GithubLogo size={16} weight="regular" className="text-[var(--gold-bright)]" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="font-data text-xs text-[var(--gold-bright)]">PAGE INDEX</p>
              <ul className="space-y-2 text-sm text-[var(--ink-dark-2)]">
                <li>
                  <a href="#problem" className="hover:text-[var(--gold-bright)] inline-block py-1">
                    The Scissors-Cut Blind Spot
                  </a>
                </li>
                <li>
                  <a href="#value" className="hover:text-[var(--gold-bright)] inline-block py-1">
                    Buyer &amp; Showroom Benefits
                  </a>
                </li>
                <li>
                  <a href="#prototype" className="hover:text-[var(--gold-bright)] inline-block py-1">
                    Figma Prototype Screens
                  </a>
                </li>
                <li>
                  <a href="#solution" className="hover:text-[var(--gold-bright)] inline-block py-1">
                    Zero-Knowledge RLS Simulator
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-[var(--gold-bright)] inline-block py-1">
                    Sri Lanka PDPA Privacy Notice
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3">
              <p className="font-data text-xs text-[var(--gold-bright)]">
                STANDARDS &amp; INSTITUTIONS
              </p>
              <ul className="space-y-2 text-sm text-[var(--ink-dark-2)]">
                <li>
                  <a
                    href="https://ngja.gov.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-bright)] py-1"
                  >
                    <span>National Gem &amp; Jewellery Authority (NGJA)</span>
                    <ArrowUpRight size={13} weight="regular" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.cbsl.gov.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-bright)] py-1"
                  >
                    <span>Central Bank of Sri Lanka (CBSL)</span>
                    <ArrowUpRight size={13} weight="regular" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.iit.ac.lk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-bright)] py-1"
                  >
                    <span>Informatics Institute of Technology (IIT)</span>
                    <ArrowUpRight size={13} weight="regular" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.westminster.ac.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[var(--gold-bright)] py-1"
                  >
                    <span>University of Westminster</span>
                    <ArrowUpRight size={13} weight="regular" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--ink-dark-3)]">
            <p>© {new Date().getFullYear()} Project AURUM (Group SE-10). All rights reserved.</p>
            <p>Colombo, Sri Lanka · Built for families and partner showrooms.</p>
          </div>
        </div>

        {/* Flush Bottom-Anchored Monumental Wordmark */}
        <div
          aria-hidden="true"
          className="select-none pointer-events-none text-center leading-[0.78] pt-2 overflow-hidden"
        >
          <span
            style={{ fontSize: 'var(--text-monument)' }}
            className="font-display font-medium tracking-[-0.04em] text-[oklch(21%_0.03_166)] block translate-y-[8%]"
          >
            AURUM
          </span>
        </div>
      </footer>
    </>
  );
};
