'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowsOutSimple, CaretLeft, CaretRight, Check, X } from '@phosphor-icons/react';
import { PROTOTYPE_PLATES } from '../data/aurumData';

export const PrototypeShowcase: React.FC = () => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 id="prototype-heading" className="heading-section text-[var(--ink-light-1)] max-w-2xl">
            Three live <span className="text-[#7d1117]">Figma screens</span> built for counters and
            pockets.
          </h2>
          <p className="text-sm sm:text-base font-medium text-[var(--ink-light-2)] max-w-sm">
            Scroll through the stacked plates—click any device to inspect at full resolution.
          </p>
        </div>

        {/* Sticky Stacking Museum Sheets */}
        <div className="space-y-8 md:space-y-12">
          {PROTOTYPE_PLATES.map((plate, idx) => {
            const isDesktop = plate.layout === 'desktop';
            const topOffset = 88 + idx * 22;

            return (
              <article
                key={plate.id}
                style={{ top: `${topOffset}px` }}
                className="md:sticky studio-card rounded-[2rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center"
              >
                <div className="lg:col-span-5 p-7 sm:p-10 space-y-5">
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--hairline-light)]">
                    <span className="font-data text-xs font-medium text-[#8b141b]">
                      {plate.index}
                    </span>
                    <span className="text-xs font-semibold text-[var(--ink-light-2)]">
                      {plate.tag}
                    </span>
                  </div>

                  <h3 className="heading-card text-2xl sm:text-3xl text-[var(--ink-light-1)]">
                    {plate.headline}
                  </h3>

                  <ul className="space-y-2.5 text-sm font-medium text-[var(--ink-light-2)]">
                    {plate.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <Check
                          size={16}
                          weight="bold"
                          className="text-[#7d1117] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setLightboxIdx(idx)}
                      className="btn-ghost-light"
                    >
                      <ArrowsOutSimple size={15} weight="regular" />
                      <span>Inspect Full Screen</span>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={`Inspect ${plate.tag} full screen`}
                  className="group lg:col-span-7 bg-[#ece2dd] p-7 sm:p-10 h-full min-h-[380px] md:min-h-[460px] flex items-center justify-center cursor-pointer border-t lg:border-t-0 lg:border-l border-[var(--hairline-light)]"
                >
                  {isDesktop ? (
                    <div className="w-full rounded-2xl bg-[#220409] p-2 shadow-[0_28px_60px_-20px_rgba(34,4,9,0.4)] transition-transform duration-200 group-hover:scale-[1.015]">
                      <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                        <span className="w-2.5 h-2.5 rounded-full bg-white/25" />
                        <span className="font-data text-xs text-white/70 ml-2">
                          aurum.partner / scan-and-sell
                        </span>
                      </div>
                      <img
                        src={plate.imageSrc}
                        alt={plate.imageAlt}
                        width={plate.width}
                        height={plate.height}
                        loading="lazy"
                        className="w-full h-auto rounded-xl block"
                      />
                    </div>
                  ) : (
                    <div className="w-[225px] sm:w-[250px] rounded-[2.1rem] bg-[#220409] p-2 shadow-[0_30px_60px_-18px_rgba(34,4,9,0.42)] transition-transform duration-200 group-hover:scale-[1.02]">
                      <img
                        src={plate.imageSrc}
                        alt={plate.imageAlt}
                        width={plate.width}
                        height={plate.height}
                        loading="lazy"
                        className="w-full h-auto rounded-[1.6rem] block"
                      />
                    </div>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
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
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-[rgba(24,3,7,0.86)] backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl max-h-[92vh] rounded-3xl bg-white text-[var(--ink-light-1)] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--hairline-light)]">
                <div>
                  <span className="font-data text-xs text-[#8b141b] block">
                    {activePlate.index} · {activePlate.tag}
                  </span>
                  <h3 id="lightbox-title" className="text-base sm:text-lg font-semibold">
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

              <div
                data-lenis-prevent
                className="flex-1 overflow-auto overscroll-contain bg-[#f2ebe9] p-4 sm:p-6 flex items-center justify-center"
              >
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
