'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, List, X } from '@phosphor-icons/react';

const NAV_LINKS = [
  { href: '#problem', label: 'Blind Spot', sectionId: 'problem' },
  { href: '#how-it-works', label: 'Loop', sectionId: 'how-it-works' },
  { href: '#prototype', label: 'Screens', sectionId: 'prototype' },
  { href: '#solution', label: 'RLS Firewall', sectionId: 'solution' },
  { href: '#value', label: 'Audiences', sectionId: 'value' },
  { href: '#team', label: 'Team', sectionId: 'team' },
];

const TRACKED_IDS = [
  'top',
  'problem',
  'how-it-works',
  'prototype',
  'solution',
  'lineage',
  'value',
  'team',
  'waitlist',
  'contact',
];
const NAV_ID_SET = new Set(['top', ...NAV_LINKS.map((l) => l.sectionId)]);
const DARK_SECTIONS = new Set(['top', 'problem', 'how-it-works', 'solution', 'lineage', 'contact']);

interface FloatingGlassNavProps {
  onOpenPilot: () => void;
}

export const FloatingGlassNav: React.FC<FloatingGlassNavProps> = ({ onOpenPilot }) => {
  const [activeSection, setActiveSection] = useState('top');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [overDark, setOverDark] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let prevDark = true;
    let prevActive = 'top';
    let prevHidden = false;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      const nextHidden = y > 260 && delta > 6 ? true : delta < -5 || y <= 260 ? false : prevHidden;
      if (nextHidden !== prevHidden) {
        prevHidden = nextHidden;
        setHidden(nextHidden);
      }

      const probeY = 92;
      for (const id of TRACKED_IDS) {
        const node = document.getElementById(id);
        if (!node) continue;
        const r = node.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) {
          const nextDark = DARK_SECTIONS.has(id);
          if (nextDark !== prevDark) {
            prevDark = nextDark;
            setOverDark(nextDark);
          }
          if (NAV_ID_SET.has(id) && id !== prevActive) {
            prevActive = id;
            setActiveSection(id);
          }
          break;
        }
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
      <header
        className={`fixed top-4 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none transition-transform duration-300 ${
          hidden ? '-translate-y-24' : 'translate-y-0'
        }`}
      >
        <nav
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredNav(null)}
          className={`pointer-events-auto mx-auto max-w-5xl rounded-full px-3 py-1.5 flex items-center justify-between gap-2 transition-colors duration-200 aurum-glass ${
            overDark
              ? 'aurum-glass-dark text-[var(--ink-dark-1)]'
              : 'aurum-glass-light text-[var(--ink-light-1)]'
          }`}
        >
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full min-h-[44px]"
          >
            <img
              src="/images/theLogo.jpg"
              alt="Project AURUM official crest"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-[rgba(247,223,163,0.6)]"
            />
            <span className="font-display text-lg tracking-wide">AURUM</span>
          </a>

          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isHighlighted = highlightId === link.sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onMouseEnter={() => setHoveredNav(link.sectionId)}
                    className={`relative inline-flex items-center min-h-[42px] px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                      overDark
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
                        layoutId="v3-nav-pill"
                        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                        className={`absolute inset-0 -z-10 rounded-full ${
                          overDark ? 'bg-[#500c10]' : 'bg-[#f2ebe9]'
                        }`}
                      />
                    )}
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-cursor="Join"
              onClick={onOpenPilot}
              className={`hidden sm:inline-flex items-center gap-2 min-h-[42px] pl-4 pr-1.5 py-1 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-150 ${
                overDark
                  ? 'bg-[var(--gold-bullion)] hover:bg-[var(--gold-bright)] text-[var(--ruby-0)]'
                  : 'bg-[#430a0e] hover:bg-[#5e0f15] text-white'
              }`}
            >
              <span>Join Free Pilot</span>
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                  overDark
                    ? 'bg-[var(--ruby-0)] text-[var(--gold-bright)]'
                    : 'bg-[var(--gold-bullion)] text-[var(--ruby-0)]'
                }`}
                aria-hidden="true"
              >
                <ArrowUpRight size={15} />
              </span>
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={openMenu}
              aria-expanded={mobileOpen}
              aria-controls="v3-mobile-nav"
              aria-label="Open navigation menu"
              className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-colors ${
                overDark
                  ? 'bg-[#3d090c] text-[var(--ink-dark-1)] border border-[#6b1117]'
                  : 'bg-[#f2ebe9] text-[var(--ink-light-1)] border border-[#e6dbd9]'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </nav>
      </header>

      <dialog
        id="v3-mobile-nav"
        ref={dialogRef}
        onClose={() => setMobileOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu();
        }}
        aria-label="Site navigation"
        className="aurum-dialog m-0 p-4 w-full max-w-none bg-transparent border-0"
      >
        <div className="mx-auto max-w-md rounded-3xl bg-white border border-[#e6dbd9] p-5 text-[var(--ink-light-1)] shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#f2ebe9]">
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
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#fbf7f6] text-[var(--ink-light-1)] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <ul className="py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between min-h-[48px] px-4 rounded-2xl text-base font-medium text-[var(--ink-light-1)] hover:bg-[#fbf7f6]"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={16} className="text-[var(--bronze-ink)]" />
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-[#f2ebe9]">
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
                <ArrowUpRight size={17} />
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
