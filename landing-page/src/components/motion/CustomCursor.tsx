'use client';

import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string>('');
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;
    let visible = false;
    let rafId = 0;

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) translate(-50%, -50%)`;
        ringRef.current.style.opacity = visible ? '1' : '0';
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      visible = true;
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor]') as HTMLElement | null;
      const nextLabel = target?.getAttribute('data-cursor') ?? '';
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const onLeave = () => {
      visible = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{ opacity: 0 }}
      className={`pointer-events-none fixed top-0 left-0 z-[110] rounded-full border border-[rgba(247,223,163,0.65)] bg-[rgba(36,5,7,0.68)] backdrop-blur-md flex items-center justify-center transition-[width,height,background-color] duration-200 ${
        label ? 'w-16 h-8 px-2.5' : 'w-5 h-5'
      }`}
    >
      {label ? (
        <span className="font-data text-xs text-[var(--gold-bright)] whitespace-nowrap">
          {label}
        </span>
      ) : null}
    </div>
  );
};
