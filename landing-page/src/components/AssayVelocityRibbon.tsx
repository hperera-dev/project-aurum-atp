'use client';

import React, { useEffect, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

const ASSAY_CLAUSES = [
  '916 & 999 MILLIGRAM PROOF',
  'POSTGRESQL ROW-LEVEL SECURITY',
  'ZERO STREET-ADDRESS COLUMNS',
  'AES-256 SEALED VAT INVOICES',
  'DAILY CBSL SOVEREIGN RATES',
  'PARENT → CHILD MELTING LINEAGE',
];

export const AssayVelocityRibbon: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 320 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 2.2], { clamp: false });
  const directionRef = useRef<number>(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '80px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!visibleRef.current || document.hidden) return;
    const vf = velocityFactor.get();
    if (vf < -0.05) directionRef.current = 1;
    else if (vf > 0.05) directionRef.current = -1;

    let moveBy = directionRef.current * 1.5 * (delta / 1000);
    moveBy += directionRef.current * Math.abs(moveBy) * Math.min(Math.abs(vf), 2.8);

    let next = baseX.get() + moveBy;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    baseX.set(next);
  });

  const xPercent = useTransform(baseX, (v) => `${v}%`);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="bg-[var(--velvet-900)] border-y border-[var(--velvet-750)] py-3.5 overflow-hidden select-none"
    >
      <motion.div style={{ x: xPercent }} className="flex w-max items-center">
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex items-center gap-8 pr-8">
            {ASSAY_CLAUSES.map((clause) => (
              <span
                key={`${copyIdx}-${clause}`}
                className="inline-flex items-center gap-3 font-data text-xs tracking-wider text-[var(--ink-3)] whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-400)]" />
                {clause}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
