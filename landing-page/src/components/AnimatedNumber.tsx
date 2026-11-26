'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, prefix = '' }) => {
  const [shown, setShown] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    if (from === value) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      prevRef.current = value;
      setShown(value);
      return;
    }

    let rafId = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 360);
      setShown(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        prevRef.current = value;
        setShown(value);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      prevRef.current = value;
    };
  }, [value]);

  return (
    <span>
      {prefix}
      {Math.round(shown).toLocaleString('en-LK')}
    </span>
  );
};
