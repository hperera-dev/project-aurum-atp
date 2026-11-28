'use client';

import React, { useEffect, useRef } from 'react';
import { scrollVelocityState } from '../../lib/gsapSetup';

const PHRASE = 'Seal it. Hold it. Prove it.';
const SUB_PHRASE = 'Never lose a gram of proof.';

export const VelocityMarquee: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let xPct = 0;
    let smoothSkew = 0;
    let isVisible = false;
    let rafId = 0;
    let last = performance.now();

    const loop = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(loop);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const vel = scrollVelocityState.velocity;
      const speedBoost = Math.min(1.8, Math.abs(vel) * 0.04);
      const dir = vel < -0.5 ? -1 : 1;

      // Calm, luxurious ~4x slower drift
      xPct -= (1.05 + speedBoost) * dt * dir;
      if (xPct <= -50) xPct += 50;
      if (xPct > 0) xPct -= 50;

      const targetSkew = Math.max(-2.0, Math.min(2.0, -vel * 0.05));
      smoothSkew += (targetSkew - smoothSkew) * 0.1;

      track.style.transform = `translate3d(${xPct.toFixed(3)}%, 0, 0) skewX(${smoothSkew.toFixed(2)}deg)`;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          last = performance.now();
          rafId = requestAnimationFrame(loop);
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="surface-ruby py-8 sm:py-11 border-y border-[#4a0b10] overflow-hidden select-none"
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex items-center gap-7 pr-7">
                <span className="font-display text-4xl sm:text-6xl md:text-7xl tracking-[-0.02em] gold-foil-sweep">
                  {PHRASE}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold-bullion)] opacity-75" />
                <span className="font-display italic text-3xl sm:text-5xl md:text-6xl text-[var(--ink-dark-2)] opacity-85">
                  {SUB_PHRASE}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8b141b]" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
