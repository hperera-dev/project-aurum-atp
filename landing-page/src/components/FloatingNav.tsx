'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { List, X, ArrowUpRight } from '@phosphor-icons/react';

const NAV_LINKS = [
  { href: '#problem', label: 'The Blind Spot', sectionId: 'problem' },
  { href: '#value', label: 'Benefits', sectionId: 'value' },
  { href: '#prototype', label: 'Screens', sectionId: 'prototype' },
  { href: '#solution', label: 'Privacy RLS', sectionId: 'solution' },
  { href: '#team', label: 'Team', sectionId: 'team' },
];

const DARK_SECTIONS = new Set(['top', 'solution', 'contact']);

interface FloatingNavProps {
  onOpenPilot: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ onOpenPilot }) => {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [overDark, setOverDark] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const trackedIds = [
      'top',
      'problem',
      'value',
      'prototype',
      'solution',
      'how-it-works',
      'faq',
      'team',
      'waitlist',
      'contact',
    ];

    const updateNav = () => {
      const probeY = 90;
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          setOverDark(DARK_SECTIONS.has(id));
          if (NAV_LINKS.some((l) => l.sectionId === id) || id === 'top') {
            setActiveSection(id);
          }
          break;
        }
      }
    };

    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
    return () => window.removeEventListener('scroll', updateNav);
  }, []);

  const openMenu = () => {
    setMobileOpen(true);
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  };

  const closeMenu = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setMobileOpen(false);
    triggerRef.current?.focus();
  };

  const highlightId = hoveredNav ?? activeSection;

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredNav(null)}
          className={`pointer-events-auto mx-auto max-w-5xl rounded-full px-3 py-1.5 backdrop-blur-md flex items-center justify-between gap-2 transition-colors duration-200 ${overDark
              ? 'bg-[oklch(15.2%_0.024_166/0.86)] text-[var(--ink-dark-1)] border border-[oklch(34%_0.036_166/0.7)] shadow-[0_14px_38px_-12px_rgba(3,10,7,0.75)]'
              : 'bg-white/90 text-[var(--ink-light-1)] border border-[#dfe2dc] shadow-[0_12px_34px_-12px_rgba(9,23,17,0.14)]'
            }`}
        >
          {/* Brand Crest */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full min-h-[44px]"
          >
            <img
              src="/images/theLogo.jpg"
              alt="Project AURUM official crest"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-[oklch(82%_0.1_83/0.55)]"
            />
            <span className="font-display text-base font-medium tracking-tight">AURUM</span>
          </a>

          {/* Desktop Links with Zero-Bounce Sliding Pill */}
          <ul className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isHighlighted = highlightId === link.sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onMouseEnter={() => setHoveredNav(link.sectionId)}
                    className={`relative inline-flex items-center min-h-[44px] px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${overDark
                        ? isHighlighted
                          ? 'text-[var(--gold-bright)]'
                          : 'text-[var(--ink-dark-2)] hover:text-[var(--ink-dark-1)]'
                        : isHighlighted
                          ? 'text-[var(--ink-light-1)]'
                          : 'text-[var(--ink-light-2)] hover:text-[var(--ink-light-1)]'
                      }`}
                  >
                    {isHighlighted && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                        className={`absolute inset-0 -z-10 rounded-full ${overDark ? 'bg-[var(--obsidian-850)]' : 'bg-[#eeefeb]'
                          }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right CTA + Mobile Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPilot}
              className={`hidden sm:inline-flex items-center gap-2 min-h-[44px] pl-4 pr-1.5 py-1 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-150 ${overDark
                  ? 'bg-[var(--gold-bullion)] hover:bg-[var(--gold-bright)] text-[var(--obsidian-950)]'
                  : 'bg-[var(--ink-light-1)] hover:bg-[#132f23] text-white'
                }`}
            >
              <span>Join Free Pilot</span>
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${overDark
                    ? 'bg-[var(--obsidian-950)] text-[var(--gold-bright)]'
                    : 'bg-[var(--gold-bullion)] text-[var(--obsidian-950)]'
                  }`}
                aria-hidden="true"
              >
                <ArrowUpRight size={15} weight="regular" />
              </span>
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dialog"
              aria-label="Open navigation menu"
              className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-colors ${overDark
                  ? 'bg-[var(--obsidian-850)] text-[var(--ink-dark-1)] border border-[var(--obsidian-750)]'
                  : 'bg-[#eeefeb] text-[var(--ink-light-1)] border border-[#dfe2dc]'
                }`}
            >
              <List size={20} weight="regular" />
            </button>
          </div>
        </nav>
      </header>

      {/* Accessible Native Dialog Mobile Menu */}
      <dialog
        id="mobile-nav-dialog"
        ref={dialogRef}
        onClose={() => setMobileOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
        aria-label="Site navigation"
        className="aurum-dialog m-0 p-4 w-full max-w-none bg-transparent border-0"
      >
        <div className="mx-auto max-w-md rounded-3xl bg-white border border-[#dfe2dc] p-5 text-[var(--ink-light-1)] shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#eeefeb]">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/theLogo.jpg"
                alt="Project AURUM crest"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-display text-lg">Project AURUM</span>
            </div>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#f6f7f4] text-[var(--ink-light-1)] cursor-pointer"
            >
              <X size={20} weight="regular" />
            </button>
          </div>

          <ul className="py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between min-h-[48px] px-4 rounded-2xl text-base font-medium text-[var(--ink-light-1)] hover:bg-[#f6f7f4]"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={16} weight="regular" className="text-[var(--bronze-ink)]" />
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-[#eeefeb]">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onOpenPilot();
              }}
              className="btn-primary-dark w-full justify-between"
            >
              <span>Join the Free Colombo Pilot</span>
              <span className="btn-pill-badge-gold" aria-hidden="true">
                <ArrowUpRight size={17} weight="regular" />
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
