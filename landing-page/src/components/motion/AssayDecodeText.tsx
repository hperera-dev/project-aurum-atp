'use client';

import React, { useEffect, useRef, useState } from 'react';

const GLYPHS = '916750AU#·012489XK';

interface AssayDecodeTextProps {
  text: string;
  play?: boolean;
  durationMs?: number;
  className?: string;
}

export const AssayDecodeText: React.FC<AssayDecodeTextProps> = ({
  text,
  play = true,
  durationMs = 640,
  className = '',
}) => {
  const [display, setDisplay] = useState(text);
  const spanRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!play || doneRef.current) return;
    const el = spanRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    const runDecode = () => {
      doneRef.current = true;
      const start = performance.now();
      const len = text.length;

      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs);
        const locked = Math.floor(p * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          const ch = text[i];
          if (ch === ' ' || i < locked) {
            out += ch;
          } else {
            out += GLYPHS[(i * 7 + Math.floor(now / 38)) % GLYPHS.length];
          }
        }
        setDisplay(out);
        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          runDecode();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [text, play, durationMs]);

  return (
    <span ref={spanRef} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
};
