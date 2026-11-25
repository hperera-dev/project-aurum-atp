'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 360,
  className = '',
}) => {
  const [shown, setShown] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (to - from) * eased);

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        prevRef.current = to;
        setShown(to);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      prevRef.current = value;
    };
  }, [value, durationMs]);

  const formatted =
    decimals > 0
      ? shown.toLocaleString('en-LK', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(shown).toLocaleString('en-LK');

  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
