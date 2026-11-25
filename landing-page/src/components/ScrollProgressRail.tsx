'use client';

import React, { useEffect, useRef } from 'react';

export const ScrollProgressRail: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      rafId = 0;
      if (!barRef.current) return;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[70] h-[2px] pointer-events-none"
    >
      <div
        ref={barRef}
        style={{ transform: 'scaleX(0)' }}
        className="h-full w-full origin-left bg-[var(--gold-bullion)]"
      />
    </div>
  );
};
