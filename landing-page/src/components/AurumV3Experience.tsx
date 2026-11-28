'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { HERO_VAULT_ITEMS, VaultItem } from '../content/aurumContent';
import { gsap, ScrollTrigger, scrollVelocityState } from '../lib/gsapSetup';
import { GlassFilter } from './glass/GlassFilter';
import { AssaySealLoader } from './loader/AssaySealLoader';
import {
  ArchitectureBlueprintModal,
  PassportInspectorModal,
  QuickPilotModal,
} from './modals/HighCraftModals';
import { CustomCursor } from './motion/CustomCursor';
import { DualAudienceAndFaqSection } from './sections/DualAudienceAndFaqSection';
import { HeroEditorialStage } from './sections/HeroEditorialStage';
import { LineageDagSection } from './sections/LineageDagSection';
import { PrototypeGallerySection } from './sections/PrototypeGallerySection';
import { ProvenanceLoopTrack } from './sections/ProvenanceLoopTrack';
import { RlsFirewallSection } from './sections/RlsFirewallSection';
import { ScissorsCutSection } from './sections/ScissorsCutSection';
import { TeamPedestalSection } from './sections/TeamPedestalSection';
import { WaitlistAndFooterSection } from './sections/WaitlistAndFooterSection';
import { FloatingGlassNav } from './shared/FloatingGlassNav';

export const AurumV3Experience: React.FC = () => {
  const [heroReady, setHeroReady] = useState(false);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [passportItem, setPassportItem] = useState<VaultItem>(HERO_VAULT_ITEMS[0]);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [pilotModalOpen, setPilotModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const anyModalOpen = passportModalOpen || archModalOpen || pilotModalOpen || lightboxOpen;

  // Sync Lenis Smooth Scroll directly to GSAP Ticker & ScrollTrigger
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setHeroReady(true);
      return;
    }

    const lenis = new Lenis({
      duration: 1.08,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ velocity, progress }: { velocity: number; progress: number }) => {
      scrollVelocityState.velocity = velocity;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      }
      ScrollTrigger.update();
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      scrollVelocityState.velocity = 0;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (anyModalOpen) lenisRef.current.stop();
    else lenisRef.current.start();
  }, [anyModalOpen]);

  const openPassport = useCallback((item: VaultItem) => {
    setPassportItem(item);
    setPassportModalOpen(true);
  }, []);

  const handleRevealStart = useCallback(() => setHeroReady(true), []);
  const openPilot = useCallback(() => setPilotModalOpen(true), []);
  const openArch = useCallback(() => setArchModalOpen(true), []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <GlassFilter />
      <AssaySealLoader onRevealStart={handleRevealStart} />
      <CustomCursor />

      {/* Top 22K Gold Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 z-[75] h-[2px] pointer-events-none"
      >
        <div
          ref={progressRef}
          style={{ transform: 'scaleX(0)' }}
          className="h-full w-full origin-left bg-gradient-to-r from-[#c7983e] via-[#f7dfa3] to-[#fff8e6]"
        />
      </div>

      <FloatingGlassNav onOpenPilot={openPilot} />

      <main id="main-content" className="relative">
        <HeroEditorialStage
          heroReady={heroReady}
          onOpenPassport={openPassport}
          onOpenPilot={openPilot}
        />
        <ScissorsCutSection />
        <ProvenanceLoopTrack />
        <PrototypeGallerySection onLightboxToggle={setLightboxOpen} />
        <RlsFirewallSection onOpenArchitecture={openArch} />
        <LineageDagSection />
        <DualAudienceAndFaqSection onOpenArchitecture={openArch} />
        <TeamPedestalSection />
        <WaitlistAndFooterSection />
      </main>

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
