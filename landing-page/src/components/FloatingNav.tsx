'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { List, X, ArrowUpRight, Database, Command, Coins } from '@phosphor-icons/react';

const NAV_LINKS = [
  { href: '#problem', label: 'The Blind Spot', sectionId: 'problem' },
  { href: '#value', label: 'Benefits', sectionId: 'value' },
  { href: '#prototype', label: 'Product Screens', sectionId: 'prototype' },
  { href: '#solution', label: 'RLS Firewall', sectionId: 'solution' },
  { href: '#team', label: 'Team', sectionId: 'team' },
];

interface FloatingNavProps {
  onOpenPilot: () => void;
  onOpenArchitecture: () => void;
  onOpenCommand: () => void;
  onOpenRates: () => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  onOpenPilot,
  onOpenArchitecture,
  onOpenCommand,
  onOpenRates,
}) => {
  const [activeSection, setActiveSection] = useState<string>('top');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateActive = () => {
      const trackedIds = ['top', 'problem', 'value', 'prototype', 'solution', 'team', 'waitlist'];
      for (const id of trackedIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 240 && rect.bottom >= 200) {
          setActiveSection(id);
          break;
        }
      }
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
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
      <header className="fixed top-3.5 inset-x-0 z-50 px-4 sm:px-6 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredNav(null)}
          className="pointer-events-auto mx-auto max-w-6xl rounded-full px-3 py-1.5 backdrop-blur-md bg-[oklch(15.5%_0.024_166/0.88)] text-[var(--ink-1)] border border-[oklch(40%_0.045_166/0.75)] shadow-[0_18px_46px_-12px_oklch(5%_0.02_166/0.9)] flex items-center justify-between gap-2"
        >
          {/* Official Brand Crest */}
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full min-h-[44px]"
          >
            <img
              src="/images/theLogo.jpg"
              alt="Project AURUM official crest"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-[oklch(85.5%_0.105_83.5/0.65)]"
            />
            <span className="font-display text-base font-medium tracking-tight">AURUM</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onOpenRates();
              }}
              className="hidden sm:inline-flex items-center gap-1 font-data text-xs px-2.5 py-1 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] text-[var(--gold-300)] border border-[oklch(78.5%_0.116_82/0.4)] cursor-pointer transition-colors"
            >
              <Coins size={12} />
              <span>916 · 36.6k/g</span>
            </button>
          </a>

          {/* Desktop Navigation with Silky Sliding Hover Pill */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isHighlighted = highlightId === link.sectionId;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onMouseEnter={() => setHoveredNav(link.sectionId)}
                    className={`relative inline-flex items-center min-h-[44px] px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      isHighlighted
                        ? 'text-[var(--gold-200)]'
                        : 'text-[var(--ink-2)] hover:text-[var(--ink-1)]'
                    }`}
                  >
                    {isHighlighted && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        className="absolute inset-0 -z-10 rounded-full bg-[var(--velvet-850)] border border-[oklch(78.5%_0.116_82/0.4)]"
                      />
                    )}
                    <span>{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Right Modern Action Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenCommand}
              aria-label="Open Command Palette (Ctrl+K)"
              className="hidden md:inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-full bg-[var(--velvet-900)] hover:bg-[var(--velvet-850)] border border-[var(--velvet-700)] hover:border-[var(--gold-300)] text-xs font-data text-[var(--ink-2)] hover:text-[var(--gold-200)] cursor-pointer transition-colors"
            >
              <Command size={14} />
              <span>Ctrl K</span>
            </button>

            <button
              type="button"
              onClick={onOpenArchitecture}
              className="hidden xl:inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-[var(--velvet-900)] hover:bg-[var(--velvet-850)] border border-[var(--velvet-700)] hover:border-[var(--gold-300)] text-xs font-medium text-[var(--ink-2)] hover:text-[var(--gold-200)] cursor-pointer transition-colors"
            >
              <Database size={15} weight="light" aria-hidden="true" />
              <span>RLS Spec</span>
            </button>

            <button
              type="button"
              onClick={onOpenPilot}
              className="hidden sm:inline-flex items-center gap-2 min-h-[44px] pl-4 pr-1.5 py-1 rounded-full bg-[var(--gold-400)] hover:bg-[var(--gold-300)] hover:-translate-y-0.5 text-[var(--velvet-950)] text-sm font-semibold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
            >
              <span>Join Free Pilot</span>
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--velvet-950)] text-[var(--gold-300)]"
                aria-hidden="true"
              >
                <ArrowUpRight size={15} weight="light" />
              </span>
            </button>

            <button
              ref={triggerRef}
              type="button"
              onClick={openMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-dialog"
              aria-label="Open navigation menu"
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] text-[var(--ink-1)] border border-[var(--velvet-700)] cursor-pointer"
            >
              <List size={20} weight="light" />
            </button>
          </div>
        </nav>
      </header>

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
        <div className="mx-auto max-w-md rounded-3xl bg-[var(--velvet-950)] border border-[var(--velvet-700)] p-5 text-[var(--ink-1)] shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--velvet-750)]">
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
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] text-[var(--ink-1)] cursor-pointer"
            >
              <X size={20} weight="light" />
            </button>
          </div>

          <ul className="py-4 space-y-1.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between min-h-[48px] px-4 rounded-2xl text-base font-medium text-[var(--ink-1)] hover:bg-[var(--velvet-850)]"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={16} weight="light" className="text-[var(--gold-300)]" />
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onOpenRates();
                }}
                className="w-full flex items-center justify-between min-h-[48px] px-4 rounded-2xl text-sm text-[var(--gold-300)] hover:bg-[var(--velvet-850)] cursor-pointer"
              >
                <span>Live CBSL 22K / 24K Gold Converter</span>
                <Coins size={16} weight="light" />
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onOpenArchitecture();
                }}
                className="w-full flex items-center justify-between min-h-[48px] px-4 rounded-2xl text-sm text-[var(--gold-300)] hover:bg-[var(--velvet-850)] cursor-pointer"
              >
                <span>Inspect SQL RLS Architecture</span>
                <Database size={16} weight="light" />
              </button>
            </li>
          </ul>

          <div className="pt-3 border-t border-[var(--velvet-750)]">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onOpenPilot();
              }}
              className="btn-bullion w-full justify-between"
            >
              <span>Join the Free Colombo Pilot</span>
              <span className="btn-bullion-badge" aria-hidden="true">
                <ArrowUpRight size={17} weight="light" />
              </span>
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
