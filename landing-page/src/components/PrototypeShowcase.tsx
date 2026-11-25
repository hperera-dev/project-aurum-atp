'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowsOutSimple, CaretLeft, CaretRight, Check, X } from '@phosphor-icons/react';
import { PROTOTYPE_PLATES } from '../data/aurumData';

export const PrototypeShowcase: React.FC = () => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const mobilePlates = PROTOTYPE_PLATES.filter((p) => p.layout === 'mobile');
  const posPlate = PROTOTYPE_PLATES.find((p) => p.layout === 'desktop')!;

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') {
        setLightboxIdx((i) => (i === null ? null : (i + 1) % PROTOTYPE_PLATES.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((i) =>
          i === null ? null : (i - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx]);

  const activePlate = lightboxIdx !== null ? PROTOTYPE_PLATES[lightboxIdx] : null;

  return (
    <section
      id="prototype"
      aria-labelledby="prototype-heading"
      className="bg-[var(--paper-stone)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-14">
        {/* Clean Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-3">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--bronze-ink)]">
              Real Figma Interfaces · Group SE-10
            </p>
            <h2 id="prototype-heading" className="heading-section text-[var(--ink-light-1)]">
              Three real screens engineered for families and showroom counters.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base text-[var(--ink-light-2)]">
            Every screen below is our actual high-fidelity Figma prototype. Click any frame to
            inspect weights, CBSL benchmarks, and POS handover modes at full scale.
          </p>
        </div>

        {/* Row 1: Two Balanced Mobile Prototype Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mobilePlates.map((plate, idx) => (
            <article
              key={plate.id}
              className="studio-card rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              {/* Clean Pedestal Stage */}
              <button
                type="button"
                onClick={() => setLightboxIdx(idx)}
                aria-label={`Inspect ${plate.tag} full screen`}
                className="group relative w-full bg-[#e6e8e2] pt-8 pb-6 px-6 flex items-center justify-center cursor-pointer border-b border-[var(--hairline-light)]"
              >
                <div className="w-[235px] sm:w-[255px] rounded-[2rem] bg-[#0a1913] p-2 shadow-[0_24px_48px_-16px_rgba(9,23,17,0.34)] transition-transform duration-200 group-hover:-translate-y-1">
                  <img
                    src={plate.imageSrc}
                    alt={plate.imageAlt}
                    width={plate.width}
                    height={plate.height}
                    loading="lazy"
                    className="w-full h-auto rounded-[1.55rem] block"
                  />
                </div>
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[var(--ink-light-1)] border border-[var(--hairline-light)] text-xs font-medium shadow-sm">
                  <ArrowsOutSimple size={14} weight="regular" />
                  <span>Zoom</span>
                </span>
              </button>

              {/* Concise Copy */}
              <div className="p-6 sm:p-8 space-y-4">
                <p className="font-data text-xs text-[var(--bronze-ink)]">
                  {plate.index} · {plate.tag}
                </p>
                <h3 className="heading-card text-[var(--ink-light-1)]">{plate.headline}</h3>
                <ul className="space-y-2 pt-1 text-sm text-[var(--ink-light-2)]">
                  {plate.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <Check
                        size={16}
                        weight="regular"
                        className="text-[var(--ok-light)] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Row 2: Full-Width Architectural Stage for Plate 03 (Direct Grid — Zero Wrapper Bug!) */}
        <article className="studio-card rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-5">
            <p className="font-data text-xs text-[var(--bronze-ink)]">
              {posPlate.index} · {posPlate.tag}
            </p>
            <h3 className="heading-card text-xl sm:text-2xl text-[var(--ink-light-1)]">
              {posPlate.headline}
            </h3>
            <ul className="space-y-3 text-sm text-[var(--ink-light-2)]">
              {posPlate.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <Check
                    size={16}
                    weight="regular"
                    className="text-[var(--ok-light)] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLightboxIdx(2)}
                className="btn-ghost-light"
              >
                <ArrowsOutSimple size={15} weight="regular" />
                <span>Inspect Full POS Screen</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIdx(2)}
            aria-label="Inspect Partner Scan and Sell POS full screen"
            className="group lg:col-span-7 bg-[#e6e8e2] p-6 sm:p-8 lg:p-10 h-full flex items-center justify-center cursor-pointer border-t lg:border-t-0 lg:border-l border-[var(--hairline-light)]"
          >
            <div className="w-full rounded-2xl bg-[#0a1913] p-2 shadow-[0_24px_54px_-18px_rgba(9,23,17,0.32)] transition-transform duration-200 group-hover:-translate-y-1">
              <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                <span className="font-data text-xs text-white/60 ml-2">
                  aurum.partner / scan-and-sell
                </span>
              </div>
              <img
                src={posPlate.imageSrc}
                alt={posPlate.imageAlt}
                width={posPlate.width}
                height={posPlate.height}
                loading="lazy"
                className="w-full h-auto rounded-xl block"
              />
            </div>
          </button>
        </article>
      </div>

      {/* Clean Modern Lightbox Modal */}
      <AnimatePresence>
        {activePlate && lightboxIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-[rgba(7,23,17,0.82)] backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ type: 'spring', duration: 0.32, bounce: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white text-[var(--ink-light-1)] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--hairline-light)]">
                <div>
                  <span className="font-data text-xs text-[var(--bronze-ink)] block">
                    {activePlate.index} · {activePlate.tag}
                  </span>
                  <h3 id="lightbox-title" className="text-base sm:text-lg font-medium">
                    {activePlate.headline}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxIdx(null)}
                  aria-label="Close prototype lightbox"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--paper-mineral)] hover:bg-[var(--paper-stone)] text-[var(--ink-light-1)] cursor-pointer shrink-0"
                >
                  <X size={20} weight="regular" />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-[#eeefeb] p-6 flex items-center justify-center">
                <img
                  src={activePlate.imageSrc}
                  alt={activePlate.imageAlt}
                  width={activePlate.width}
                  height={activePlate.height}
                  className="max-h-[66vh] w-auto rounded-2xl shadow-xl"
                />
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-3.5 border-t border-[var(--hairline-light)] bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx(
                      (lightboxIdx - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length
                    )
                  }
                  className="btn-ghost-light text-xs"
                >
                  <CaretLeft size={16} />
                  <span>Previous</span>
                </button>

                <span className="font-data text-xs text-[var(--ink-light-3)]">
                  {lightboxIdx + 1} / {PROTOTYPE_PLATES.length}
                </span>

                <button
                  type="button"
                  onClick={() => setLightboxIdx((lightboxIdx + 1) % PROTOTYPE_PLATES.length)}
                  className="btn-ghost-light text-xs"
                >
                  <span>Next</span>
                  <CaretRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
