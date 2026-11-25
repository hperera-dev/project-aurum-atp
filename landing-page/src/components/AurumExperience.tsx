'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollProgressRail } from './ScrollProgressRail';
import { AmbientVelvetLight } from './AmbientVelvetLight';
import { FloatingNav } from './FloatingNav';
import { HeroVaultStage } from './HeroVaultStage';
import { AssayVelocityRibbon } from './AssayVelocityRibbon';
import { ScissorsCutSection } from './ScissorsCutSection';
import { DualValueBento } from './DualValueBento';
import { PrototypeShowcase } from './PrototypeShowcase';
import { ZeroKnowledgeSimulator } from './ZeroKnowledgeSimulator';
import { HowItWorksSection } from './HowItWorksSection';
import { FaqAndLocksSection } from './FaqAndLocksSection';
import { TeamAndCloserSection } from './TeamAndCloserSection';
import {
  ArchitectureBlueprintModal,
  PassportInspectorModal,
  QuickPilotModal,
} from './HighTechModals';
import {
  AurumToast,
  AurumToastStack,
  CbslRatesModal,
  CommandAction,
  CommandPaletteModal,
} from './ModernCommandAndToast';
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';

gsap.registerPlugin(ScrollTrigger);

export const AurumExperience: React.FC = () => {
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [passportItem, setPassportItem] = useState<VaultItem>(HERO_VAULT_ITEMS[0]);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);
  const [toasts, setToasts] = useState<AurumToast[]>([]);

  const pushToast = useCallback((title: string, detail?: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev.slice(-2), { id, title, detail }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Frame-locked Lenis + GSAP ScrollTrigger sync for silky 60fps scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Global Ctrl+K / Cmd+K Command Palette Shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const openPassport = useCallback((item: VaultItem) => {
    setPassportItem(item);
    setPassportModalOpen(true);
  }, []);

  const jumpTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const commandActions = useMemo<CommandAction[]>(
    () => [
      {
        id: 'modal-passport',
        group: 'Interactive Modals',
        title: 'Open Live Digital Passport & 15m Counter Pass QR',
        subtitle: 'Inspect net weight, AES-256 invoice hash, and ticking Counter Pass QR',
        shortcut: 'Passport',
        onSelect: () => openPassport(HERO_VAULT_ITEMS[0]),
      },
      {
        id: 'modal-sql',
        group: 'Interactive Modals',
        title: 'Inspect PostgreSQL RLS SQL Policy & Schema',
        subtitle: 'View CREATE POLICY multi-tenant isolation & zero-address schema proof',
        shortcut: 'SQL RLS',
        onSelect: () => setArchModalOpen(true),
      },
      {
        id: 'modal-cbsl',
        group: 'Interactive Modals',
        title: 'Open Live CBSL 22K / 24K Gold & Sovereign Converter',
        subtitle: 'Daily Sri Lanka per-gram & 8g Pavan benchmarks',
        shortcut: 'CBSL Rate',
        onSelect: () => setRatesOpen(true),
      },
      {
        id: 'modal-pilot',
        group: 'Interactive Modals',
        title: 'Reserve Colombo Early-Access Pilot Invitation',
        subtitle: 'Free registration for Sri Lankan families & founding showrooms',
        shortcut: 'Waitlist',
        onSelect: () => setPilotModalOpen(true),
      },
      {
        id: 'nav-problem',
        group: 'Jump to Section',
        title: 'The Scissors Cut & LKR Cutting Calculator',
        subtitle: 'Compare traditional counters vs. 8-second AURUM handover',
        onSelect: () => jumpTo('problem'),
      },
      {
        id: 'nav-prototype',
        group: 'Jump to Section',
        title: 'High-Fidelity Figma Prototype Screens',
        subtitle: 'Customer Vault, CBSL Hub, and Partner Scan & Sell POS',
        onSelect: () => jumpTo('prototype'),
      },
      {
        id: 'nav-solution',
        group: 'Jump to Section',
        title: 'Interactive Zero-Knowledge RLS Simulator',
        subtitle: 'Test Owner vs. Issuing Jeweller vs. Rival Shop B (HTTP 403)',
        onSelect: () => jumpTo('solution'),
      },
      {
        id: 'nav-team',
        group: 'Jump to Section',
        title: 'Meet the 5-Member Engineering Team (Group SE-10)',
        subtitle: 'IIT Sri Lanka & University of Westminster specialists',
        onSelect: () => jumpTo('team'),
      },
    ],
    [jumpTo, openPassport]
  );

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AmbientVelvetLight />
      <ScrollProgressRail />
      <FloatingNav
        onOpenPilot={() => setPilotModalOpen(true)}
        onOpenArchitecture={() => setArchModalOpen(true)}
        onOpenCommand={() => setCommandOpen(true)}
        onOpenRates={() => setRatesOpen(true)}
      />

      <main id="main-content" className="relative z-10">
        <HeroVaultStage
          onOpenPassport={openPassport}
          onOpenPilot={() => setPilotModalOpen(true)}
          onNotify={pushToast}
        />
        <AssayVelocityRibbon />
        <ScissorsCutSection />
        <DualValueBento onOpenArchitecture={() => setArchModalOpen(true)} />
        <PrototypeShowcase />
        <ZeroKnowledgeSimulator onOpenArchitecture={() => setArchModalOpen(true)} />
        <HowItWorksSection onOpenPassport={openPassport} />
        <FaqAndLocksSection />
        <TeamAndCloserSection />
      </main>

      {/* Modern Glassmorphic Modal Ecosystem */}
      <PassportInspectorModal
        open={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        initialItem={passportItem}
      />
      <ArchitectureBlueprintModal
        open={archModalOpen}
        onClose={() => setArchModalOpen(false)}
      />
      <QuickPilotModal open={pilotModalOpen} onClose={() => setPilotModalOpen(false)} />
      <CommandPaletteModal
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        actions={commandActions}
      />
      <CbslRatesModal open={ratesOpen} onClose={() => setRatesOpen(false)} />
      <AurumToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};
