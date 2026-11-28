'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowsOutSimple, CaretLeft, CaretRight, Check, X } from '@phosphor-icons/react';
import { PROTOTYPE_PLATES, PrototypePlate } from '../../content/aurumContent';
import { gsap } from '../../lib/gsapSetup';
import { SplitReveal } from '../motion/SplitReveal';

interface PrototypeGallerySectionProps {
  onLightboxToggle?: (open: boolean) => void;
}

interface PlateCardProps {
  plate: PrototypePlate;
  idx: number;
  onInspect: () => void;
}

const InteractivePlateCard: React.FC<PlateCardProps> = ({ plate, idx, onInspect }) => {
  const deviceTiltRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isDesktop = plate.layout === 'desktop';

  const onStageMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tilt = deviceTiltRef.current;
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / (r.width || 1);
    const py = (e.clientY - r.top) / (r.height || 1);
    const rx = (0.5 - py) * 10;
    const ry = (px - 0.5) * 12;
    tilt.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px) scale(1.02)`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '1';
      glareRef.current.style.background = `radial-gradient(260px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,250,235,0.28), transparent 70%)`;
    }
  };

  const onStageLeave = () => {
    if (deviceTiltRef.current) deviceTiltRef.current.style.transform = '';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      style={{ top: `${88 + idx * 24}px`, zIndex: 10 + idx }}
      className="proto-stack-wrapper md:sticky"
    >
      {/* 100% Solid Opaque Card Surface (prevents underlying stacked cards from bleeding through!) */}
      <article className="proto-card-inner relative rounded-[2rem] bg-white border border-[#dfd2cf] shadow-[0_-8px_30px_-14px_rgba(26,4,5,0.08),0_28px_64px_-22px_rgba(48,8,12,0.18)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center origin-top will-change-transform">
        {/* GPU-composited depth scrim (starts at opacity 0, gently shades to 0.12 as next card covers it) */}
        <div
          aria-hidden="true"
          className="proto-depth-scrim pointer-events-none absolute inset-0 z-30 bg-[#1a0304] opacity-0"
        />
        <div className="lg:col-span-5 bg-white p-7 sm:p-10 space-y-5">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--hairline-light)]">
            <span className="font-data text-xs font-semibold text-[#8b141b]">{plate.index}</span>
            <span className="text-xs font-semibold text-[var(--ink-light-2)]">{plate.tag}</span>
          </div>

          <h3 className="proto-copy-rise heading-card text-2xl sm:text-3xl text-[var(--ink-light-1)]">
            {plate.headline}
          </h3>

          <ul className="space-y-2.5 text-sm font-medium text-[var(--ink-light-2)]">
            {plate.highlights.map((h) => (
              <li key={h} className="proto-bullet flex items-start gap-2.5">
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

          <div className="proto-copy-rise pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-cursor="Zoom"
              onClick={onInspect}
              className="btn-ghost-light"
            >
              <ArrowsOutSimple size={15} />
              <span>Inspect Full Screen</span>
            </button>
            <span className="font-data text-xs text-[var(--ink-light-3)]">{plate.callout}</span>
          </div>
        </div>

        <button
          type="button"
          data-cursor="Zoom"
          onClick={onInspect}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
          aria-label={`Inspect ${plate.tag} full screen`}
          className="group relative lg:col-span-7 bg-[#eae0dc] p-7 sm:p-10 h-full min-h-[380px] md:min-h-[470px] flex items-center justify-center cursor-pointer border-t lg:border-t-0 lg:border-l border-[var(--hairline-light)] overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute w-[360px] h-[360px] rounded-full border border-[#7d1117]/10 scale-95 group-hover:scale-105 transition-transform duration-500"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(125,17,23,0.1)_0%,transparent_70%)]"
          />

          <div
            ref={deviceTiltRef}
            className="proto-device-frame relative z-10 w-full flex items-center justify-center transition-transform duration-300 ease-out will-change-transform"
          >
            {isDesktop ? (
              <div className="relative w-full rounded-2xl bg-[#1f0407] p-2 shadow-[0_32px_68px_-20px_rgba(34,4,8,0.48)] border border-[rgba(247,223,163,0.25)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-2.5 pb-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f7dfa3]/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#74e3ad]/70" />
                  <span className="font-data text-xs text-white/75 ml-2">
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
                <div
                  ref={glareRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                />
              </div>
            ) : (
              <div className="relative w-[225px] sm:w-[252px] rounded-[2.15rem] bg-[#1f0407] p-2 shadow-[0_34px_68px_-18px_rgba(34,4,8,0.5)] border border-[rgba(247,223,163,0.28)] overflow-hidden">
                <img
                  src={plate.imageSrc}
                  alt={plate.imageAlt}
                  width={plate.width}
                  height={plate.height}
                  loading="lazy"
                  className="w-full h-auto rounded-[1.65rem] block"
                />
                <div
                  ref={glareRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
                />
              </div>
            )}
          </div>
        </button>
      </article>
    </div>
  );
};

export const PrototypeGallerySection: React.FC<PrototypeGallerySectionProps> = ({
  onLightboxToggle,
}) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const setIdx = (next: number | null) => {
    setLightboxIdx(next);
    onLightboxToggle?.(next !== null);
  };

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIdx(null);
      if (e.key === 'ArrowRight') setIdx((lightboxIdx + 1) % PROTOTYPE_PLATES.length);
      if (e.key === 'ArrowLeft') {
        setIdx((lightboxIdx - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const wrappers = gsap.utils.toArray<HTMLElement>('.proto-stack-wrapper');

      wrappers.forEach((wrap, i) => {
        const inner = wrap.querySelector<HTMLElement>('.proto-card-inner');
        const device = wrap.querySelector<HTMLElement>('.proto-device-frame');
        const bullets = wrap.querySelectorAll<HTMLElement>('.proto-bullet');
        const copyNodes = wrap.querySelectorAll<HTMLElement>('.proto-copy-rise');

        // 1. Child content entrance (never touches card opacity, keeping card 100% opaque)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top 86%',
            once: true,
          },
        });

        if (device) {
          tl.fromTo(
            device,
            { y: 40, scale: 0.93, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'expo.out', clearProps: 'transform' },
            0
          );
        }
        if (copyNodes.length) {
          tl.fromTo(
            copyNodes,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
            0.06
          );
        }
        if (bullets.length) {
          tl.fromTo(
            bullets,
            { x: -14, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' },
            0.14
          );
        }

        // 2. Opaque Sticky Stack Recess: scales card from 1 -> 0.94 & shades scrim from 0 -> 0.12
        const nextWrap = wrappers[i + 1];
        const scrim = wrap.querySelector<HTMLElement>('.proto-depth-scrim');
        if (nextWrap && inner) {
          const mm = gsap.matchMedia();
          mm.add('(min-width: 768px)', () => {
            const stackTl = gsap.timeline({
              scrollTrigger: {
                trigger: nextWrap,
                start: 'top 72%',
                end: 'top 18%',
                scrub: 0.5,
              },
            });
            stackTl.fromTo(
              inner,
              { scale: 1 },
              { scale: i === 0 ? 0.94 : 0.965, ease: 'none' },
              0
            );
            if (scrim) {
              stackTl.fromTo(scrim, { opacity: 0 }, { opacity: 0.12, ease: 'none' }, 0);
            }
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const activePlate = lightboxIdx !== null ? PROTOTYPE_PLATES[lightboxIdx] : null;

  return (
    <section
      ref={sectionRef}
      id="prototype"
      aria-labelledby="prototype-heading"
      className="surface-light bg-[var(--paper-2)] text-[var(--ink-light-1)] py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t border-[var(--hairline-light)]"
    >
      <div className="mx-auto max-w-6xl space-y-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="font-data text-xs text-[#8b141b] uppercase tracking-[0.1em]">
              03 · High-Fidelity Figma Prototype
            </p>
            <SplitReveal
              as="h2"
              id="prototype-heading"
              scrollTrigger
              text="Three live Figma screens built for counters and pockets."
              className="heading-section text-[var(--ink-light-1)]"
            />
          </div>
          <p className="text-sm sm:text-base font-medium text-[var(--ink-light-2)] max-w-sm">
            Scroll through the stacked museum plates—hover to tilt, or click any device to inspect
            at full resolution.
          </p>
        </div>

        <div className="space-y-8 md:space-y-14">
          {PROTOTYPE_PLATES.map((plate, idx) => (
            <InteractivePlateCard
              key={plate.id}
              plate={plate}
              idx={idx}
              onInspect={() => setIdx(idx)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activePlate && lightboxIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="v3-lightbox-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIdx(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 bg-[rgba(18,2,3,0.86)] backdrop-blur-md"
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
                  <h3 id="v3-lightbox-title" className="text-base sm:text-lg font-semibold">
                    {activePlate.headline}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIdx(null)}
                  aria-label="Close prototype lightbox"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--paper-1)] hover:bg-[var(--paper-2)] text-[var(--ink-light-1)] cursor-pointer shrink-0"
                >
                  <X size={20} />
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
                    setIdx((lightboxIdx - 1 + PROTOTYPE_PLATES.length) % PROTOTYPE_PLATES.length)
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
                  onClick={() => setIdx((lightboxIdx + 1) % PROTOTYPE_PLATES.length)}
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
