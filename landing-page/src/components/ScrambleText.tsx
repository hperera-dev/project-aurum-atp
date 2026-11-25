'use client';

import React, { useEffect, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  durationMs?: number;
}

const CIPHER_CHARS = '0123456789ABCDEF916AURX#·';

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  durationMs = 420,
}) => {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const lockedCount = Math.floor(progress * text.length);

      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < lockedCount || ch === ' ' || ch === '·' || ch === '—') {
          out += ch;
        } else {
          out += CIPHER_CHARS[(i * 7 + Math.floor(now / 32)) % CIPHER_CHARS.length];
        }
      }
      setDisplay(out);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [text, durationMs]);

  return <span className={className}>{display}</span>;
};
