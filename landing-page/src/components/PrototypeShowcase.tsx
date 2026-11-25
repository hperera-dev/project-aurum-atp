'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowsOutSimple,
  CaretLeft,
  CaretRight,
  Check,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  X,
} from '@phosphor-icons/react';
import { PROTOTYPE_PLATES } from '../data/aurumData';
import { TiltSpotlightCard } from './TiltSpotlightCard';

export const PrototypeShowcase: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const phoneParallaxA = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const phoneParallaxB = useTransform(scrollYProgress, [0, 1], [-12, 16]);

  useEffect(() => {
    if (modalIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalIndex(null);
        setZoomed(false);
      } else if (e.key === 'ArrowRight') {
        setModalIndex((i) => (i === null ? null : (i + 1) % PROTOTYPE_PLATES.length));
        setZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setModalIndex((i) =>
          i === null ? null : (i - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length
        );
        setZoomed(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalIndex]);

  const mobilePlates = PROTOTYPE_PLATES.filter((p) => p.layout === 'mobile');
  const desktopPlate = PROTOTYPE_PLATES.find((p) => p.layout === 'desktop')!;
  const activeModalPlate = modalIndex !== null ? PROTOTYPE_PLATES[modalIndex] : null;

  return (
    <section
      id="prototype"
      ref={sectionRef}
      className="royal-velvet relative text-[var(--ink-1)] py-20 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-[var(--velvet-850)] overflow-hidden"
    >
      <div aria-hidden="true" className="velvet-grid-mesh pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-3xl mb-14">
          <p className="font-data text-xs text-[var(--gold-300)] mb-2.5">
            HIGH-FIDELITY FIGMA PROTOTYPE SCREENS · INTERACTIVE HARDWARE STAGE
          </p>
          <h2 className="heading-section text-[var(--ink-1)]">
            Three purpose-built screens connecting private family vaults to live showroom counters.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {mobilePlates.map((plate, idx) => (
            <motion.article
              key={plate.id}
              style={
                prefersReduced
                  ? undefined
                  : { y: idx === 0 ? phoneParallaxA : phoneParallaxB }
              }
              className="lg:col-span-6"
            >
              <TiltSpotlightCard
                maxTilt={5}
                className="h-full"
                innerClassName="p-6 sm:p-8 flex flex-col justify-between gap-7"
              >
                <div className="space-y-3">
                  <span className="font-data text-xs font-medium text-[var(--gold-300)] block">
                    {plate.index} · {plate.tag}
                  </span>
                  <h3 className="heading-card text-[var(--ink-1)]">{plate.headline}</h3>
                  <p className="text-sm sm:text-base text-[var(--ink-2)]">{plate.description}</p>

                  <ul className="pt-1.5 space-y-1.5 text-xs sm:text-sm text-[var(--ink-2)]">
                    {plate.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          size={16}
                          weight="regular"
                          className="text-[var(--gold-300)] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative rounded-2xl bg-[oklch(12%_0.02_166)] p-6 flex flex-col items-center gap-4 border border-[var(--velvet-750)] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,oklch(50%_0.09_83/0.26),transparent_68%)]"
                  />
                  <div className="relative z-10 p-2 rounded-[2.25rem] bg-[linear-gradient(145deg,oklch(38%_0.04_166),oklch(16%_0.02_166))] border border-[oklch(85.5%_0.105_83.5/0.48)] shadow-[0_28px_60px_-14px_rgba(0,0,0,0.88)] transition-transform duration-300 group-hover:scale-[1.02]">
                    <div
                      aria-hidden="true"
                      className="mx-auto mb-1.5 w-14 h-1.5 rounded-full bg-[var(--velvet-700)]"
                    />
                    <img
                      src={plate.imageSrc}
                      alt={plate.imageAlt}
                      width={plate.width}
                      height={plate.height}
                      loading="lazy"
                      className="w-auto max-h-[400px] rounded-[1.6rem] object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setModalIndex(idx);
                      setZoomed(false);
                    }}
                    className="relative z-10 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] text-xs font-medium text-[var(--gold-200)] border border-[oklch(79%_0.112_80.5/0.55)] cursor-pointer transition-colors"
                  >
                    <ArrowsOutSimple size={15} weight="light" aria-hidden="true" />
                    <span>Inspect Interactive Hi-Res Modal</span>
                  </button>
                </div>
              </TiltSpotlightCard>
            </motion.article>
          ))}
        </div>

        <TiltSpotlightCard
          beam
          maxTilt={3}
          innerClassName="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
        >
          <div className="lg:col-span-5 space-y-4">
            <span className="font-data text-xs font-medium text-[var(--gold-300)] block">
              {desktopPlate.index} · {desktopPlate.tag}
            </span>
            <h3 className="heading-card text-[var(--ink-1)]">{desktopPlate.headline}</h3>
            <p className="text-sm sm:text-base text-[var(--ink-2)]">{desktopPlate.description}</p>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-[var(--ink-2)]">
              {desktopPlate.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    weight="regular"
                    className="text-[var(--gold-300)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalIndex(2);
                  setZoomed(false);
                }}
                className="btn-secondary-velvet text-xs sm:text-sm"
              >
                <ArrowsOutSimple size={16} weight="light" className="text-[var(--gold-300)]" />
                <span>Zoom Showroom POS Portal</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[oklch(12%_0.02_166)] p-3 sm:p-4 border border-[oklch(78.5%_0.116_82/0.45)] shadow-[0_30px_70px_-16px_rgba(0,0,0,0.88)]">
              <div
                aria-hidden="true"
                className="flex items-center justify-between px-3 pb-2.5 mb-2.5 border-b border-[var(--velvet-850)] text-xs font-data text-[var(--ink-3)]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--velvet-700)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--velvet-700)]" />
                  <span className="ml-1">pos.aurum.lk · Serendib Counter #02</span>
                </div>
                <span className="text-[var(--gold-300)]">Customer-Present Lock</span>
              </div>
              <img
                src={desktopPlate.imageSrc}
                alt={desktopPlate.imageAlt}
                width={desktopPlate.width}
                height={desktopPlate.height}
                loading="lazy"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        </TiltSpotlightCard>
      </div>

      <AnimatePresence>
        {activeModalPlate && modalIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeModalPlate.tag}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => {
              setModalIndex(null);
              setZoomed(false);
            }}
            className="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-6 bg-[oklch(8%_0.02_166/0.86)] backdrop-blur-lg"
          >
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="border-beam-card w-full max-w-5xl max-h-[92vh] overflow-hidden"
            >
              <div className="bezel-core-velvet p-4 sm:p-6 text-[var(--ink-1)] flex flex-col max-h-[90vh]">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--velvet-850)]">
                  <div>
                    <p className="font-data text-xs text-[var(--gold-300)]">
                      {activeModalPlate.index} ({modalIndex + 1} / {PROTOTYPE_PLATES.length}) ·{' '}
                      {activeModalPlate.tag}
                    </p>
                    <p className="text-sm sm:text-base font-medium mt-0.5">
                      {activeModalPlate.headline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setZoomed((z) => !z)}
                      aria-pressed={zoomed}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] text-xs font-medium text-[var(--gold-300)] cursor-pointer"
                    >
                      {zoomed ? <MagnifyingGlassMinus size={16} /> : <MagnifyingGlassPlus size={16} />}
                      <span>{zoomed ? '1× Fit' : '1.5× Zoom'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalIndex((modalIndex - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length);
                        setZoomed(false);
                      }}
                      aria-label="Previous prototype screen"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] cursor-pointer"
                    >
                      <CaretLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalIndex((modalIndex + 1) % PROTOTYPE_PLATES.length);
                        setZoomed(false);
                      }}
                      aria-label="Next prototype screen"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] cursor-pointer"
                    >
                      <CaretRight size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setModalIndex(null);
                        setZoomed(false);
                      }}
                      aria-label="Close prototype lightbox"
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--velvet-850)] hover:bg-[var(--velvet-750)] border border-[var(--velvet-700)] cursor-pointer"
                    >
                      <X size={20} weight="light" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex-1 overflow-auto flex justify-center items-start rounded-2xl bg-[oklch(12%_0.02_166)] p-4">
                  <img
                    src={activeModalPlate.imageSrc}
                    alt={activeModalPlate.imageAlt}
                    width={activeModalPlate.width}
                    height={activeModalPlate.height}
                    style={{
                      transform: zoomed ? 'scale(1.42)' : 'scale(1)',
                      transformOrigin: 'top center',
                    }}
                    className="max-h-[68vh] w-auto rounded-xl object-contain transition-transform duration-300"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
