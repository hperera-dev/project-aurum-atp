'use client';

import React from 'react';
import { ArrowUpRight, Check, EnvelopeSimple, GithubLogo } from '@phosphor-icons/react';
import { PilotWaitlistForm } from './PilotWaitlistForm';
import { TeamShowcaseSection } from './TeamShowcaseSection';

const PILOT_BULLETS = [
  'Free early-access registration for families and partner showrooms',
  'Zero home addresses collected · Zero promotional spam',
  'Sri Lanka PDPA No. 9 of 2022 Section 14 instant erasure rights',
];

const FOOTER_SECTIONS = [
  { href: '#problem', label: 'The Scissors Cut' },
  { href: '#prototype', label: 'Figma Screens' },
  { href: '#solution', label: 'RLS Firewall' },
  { href: '#privacy', label: 'PDPA Privacy' },
];

const EXTERNAL_LINKS = [
  { href: 'https://ngja.gov.lk/', label: 'NGJA Sri Lanka' },
  { href: 'https://www.cbsl.gov.lk/', label: 'Central Bank of Sri Lanka (CBSL)' },
  { href: 'https://www.iit.ac.lk/', label: 'IIT Sri Lanka' },
  { href: 'https://www.westminster.ac.uk/', label: 'University of Westminster' },
];

export const TeamAndCloserSection: React.FC = () => (
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
              Join the free <span className="text-[#7d1117]">Colombo</span> pilot.
            </h2>

            <p className="text-base font-medium text-[var(--ink-light-2)] max-w-[44ch] leading-relaxed">
              Log existing home heirlooms on day one as a family—or book a 1-on-1 zero-disruption
              POS walkthrough for your showroom.
            </p>

            <ul className="space-y-2.5 text-sm font-medium text-[var(--ink-light-2)] pt-2">
              {PILOT_BULLETS.map((text) => (
                <li key={text} className="flex items-center gap-2">
                  <Check size={16} weight="bold" className="text-[#7d1117] shrink-0" aria-hidden="true" />
                  <span>{text}</span>
                </li>
              ))}
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

                <PilotWaitlistForm variant="embedded" />
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
            <span className="font-data text-xs text-[#8b141b]">Controller: Project AURUM (SE-10)</span>
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
              <strong className="text-[var(--ink-light-1)]">Purpose:</strong> Closed-beta onboarding
              over TLS 1.3 only—never shared with rivals.
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

    <footer id="contact" className="surface-dark pt-16 md:pt-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#590e13]">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/theLogo.jpg"
                alt="Project AURUM official emblem"
                width={40}
                height={40}
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover border border-[rgba(247,223,163,0.55)]"
              />
              <div>
                <p className="font-display text-lg text-[var(--ink-dark-1)]">Project AURUM</p>
                <p className="font-data text-xs text-[var(--gold-bright)]">
                  Colombo, Sri Lanka · Group SE-10
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a href="mailto:aurumteam25@gmail.com" className="btn-ghost-dark text-xs min-h-[42px] py-1.5">
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
              {FOOTER_SECTIONS.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="hover:text-[var(--gold-bright)]">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5 text-sm text-[var(--ink-dark-2)]">
            <p className="font-data text-xs text-[var(--gold-bright)]">STANDARDS &amp; ACADEMIC</p>
            <ul className="space-y-1.5">
              {EXTERNAL_LINKS.map((ext) => (
                <li key={ext.href}>
                  <a
                    href={ext.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--gold-bright)]"
                  >
                    <span>{ext.label}</span>
                    <ArrowUpRight size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[var(--ink-dark-3)]">
          <p>© {new Date().getFullYear()} Project AURUM (Group SE-10). All rights reserved.</p>
          <p>Never lose a gram of proof.</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="select-none pointer-events-none text-center leading-[0.76] pt-2 overflow-hidden"
      >
        <span
          style={{ fontSize: 'var(--text-monument)' }}
          className="font-display tracking-[-0.03em] text-[#430a0e] block translate-y-[9%]"
        >
          AURUM
        </span>
      </div>
    </footer>
  </>
);
