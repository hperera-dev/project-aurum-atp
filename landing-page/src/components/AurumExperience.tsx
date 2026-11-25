'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { ScrollProgressRail } from './ScrollProgressRail';
import { FloatingNav } from './FloatingNav';
import { HeroVaultStage } from './HeroVaultStage';
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
import { HERO_VAULT_ITEMS, VaultItem } from '../data/aurumData';

export const AurumExperience: React.FC = () => {
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [passportItem, setPassportItem] = useState<VaultItem>(HERO_VAULT_ITEMS[0]);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  const anyModalOpen = passportModalOpen || archModalOpen || pilotModalOpen;

  // Lightweight Lenis smooth scroll on desktop wheel (automatically skipped under reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause smooth scroll while a modal is open (WCAG / Awwwards quality gate §2.3)
  useEffect(() => {
    if (!lenisRef.current) return;
    if (anyModalOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [anyModalOpen]);

  const openPassport = useCallback((item: VaultItem) => {
    setPassportItem(item);
    setPassportModalOpen(true);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollProgressRail />
      <FloatingNav onOpenPilot={() => setPilotModalOpen(true)} />

      <main id="main-content" className="relative">
        <HeroVaultStage
          onOpenPassport={openPassport}
          onOpenPilot={() => setPilotModalOpen(true)}
        />
        <ScissorsCutSection />
        <DualValueBento onOpenArchitecture={() => setArchModalOpen(true)} />
        <PrototypeShowcase />
        <ZeroKnowledgeSimulator onOpenArchitecture={() => setArchModalOpen(true)} />
        <HowItWorksSection onOpenPassport={openPassport} />
        <FaqAndLocksSection />
        <TeamAndCloserSection />
      </main>

      {/* 3 Focused Modern Glassmorphic Modals */}
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
    </>
  );
};
