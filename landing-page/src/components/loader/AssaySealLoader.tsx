'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsapSetup';

interface AssaySealLoaderProps {
  onRevealStart: () => void;
}

const LIFELINES = [
  { x: 200, label: 'Showroom POS' },
  { x: 400, label: 'Family Vault' },
  { x: 600, label: 'PostgreSQL RLS' },
  { x: 800, label: 'Lineage DAG' },
];

const PULSES = [
  { y: 195, x1: 200, x2: 400, text: '4.20g Net · PIN 8s' },
  { y: 245, x1: 400, x2: 600, text: 'AES-256 Sealed' },
  { y: 295, x1: 600, x2: 200, text: 'Rival → HTTP 403' },
  { y: 345, x1: 400, x2: 800, text: 'Parent → Child' },
];

export const AssaySealLoader: React.FC<AssaySealLoaderProps> = ({ onRevealStart }) => {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);
  const [wordmark, setWordmark] = useState('916 · 750 · AU');
  const rootRef = useRef<HTMLDivElement>(null);
  const holeRef = useRef<SVGCircleElement>(null);
  const sealRingRef = useRef<SVGGElement>(null);
  const bladesRef = useRef<SVGGElement>(null);
  const diagramRef = useRef<SVGGElement>(null);
  const footerHudRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef(false);
  const onRevealRef = useRef(onRevealStart);

  useEffect(() => {
    onRevealRef.current = onRevealStart;
  }, [onRevealStart]);

  const triggerIrisOpen = useCallback((immediate = false) => {
    try {
      sessionStorage.setItem('aurum_v3_loader_seen', '1');
    } catch {
      // Ignore storage errors in private browsing
    }

    if (immediate && openingRef.current) {
      onRevealRef.current();
      setDone(true);
      return;
    }
    if (openingRef.current) return;
    openingRef.current = true;

    onRevealRef.current();

    const maxDim = Math.hypot(window.innerWidth || 1440, window.innerHeight || 900) * 1.1;
    const failsafe = window.setTimeout(() => setDone(true), 950);

    const irisState = { r: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(failsafe);
        setDone(true);
      },
    });

    if (diagramRef.current) {
      tl.to(diagramRef.current, { opacity: 0, duration: 0.16 }, 0);
    }
    if (footerHudRef.current) {
      tl.to(footerHudRef.current, { opacity: 0, duration: 0.2 }, 0);
    }
    if (bladesRef.current) {
      tl.to(
        bladesRef.current,
        {
          rotation: 64,
          scale: 1.45,
          opacity: 0,
          svgOrigin: '500 255',
          duration: 0.52,
          ease: 'expo.inOut',
        },
        0
      );
    }
    if (sealRingRef.current) {
      tl.to(
        sealRingRef.current,
        {
          scale: 6.2,
          opacity: 0,
          svgOrigin: '500 255',
          duration: 0.78,
          ease: 'expo.inOut',
        },
        0.03
      );
    }
    tl.to(
      irisState,
      {
        r: maxDim,
        duration: 0.78,
        ease: 'expo.inOut',
        onUpdate: () => {
          holeRef.current?.setAttribute('r', irisState.r.toFixed(1));
        },
      },
      0.03
    );
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    openingRef.current = false;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onRevealRef.current();
      const t = window.setTimeout(() => setDone(true), 280);
      return () => window.clearTimeout(t);
    }

    let seenBefore = false;
    try {
      seenBefore = sessionStorage.getItem('aurum_v3_loader_seen') === '1';
    } catch {
      seenBefore = false;
    }

    const onSkipKey = () => triggerIrisOpen(true);
    window.addEventListener('keydown', onSkipKey);

    let decodeRaf = 0;
    const ctx = gsap.context(() => {
      if (seenBefore) {
        setPct(100);
        setWordmark('PROJECT AURUM');
        gsap.set(diagramRef.current, { opacity: 0 });
        gsap.fromTo(
          sealRingRef.current,
          { scale: 0.86, opacity: 0, svgOrigin: '500 255' },
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: 'expo.out',
            onComplete: () => triggerIrisOpen(false),
          }
        );
        return;
      }

      const counterObj = { v: 0 };
      gsap.to(counterObj, {
        v: 100,
        duration: 2.0,
        ease: 'power2.inOut',
        onUpdate: () => setPct(Math.round(counterObj.v)),
      });

      const tl = gsap.timeline();

      tl.fromTo(
        '.loader-horizon',
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: 0.3, ease: 'expo.out' },
        0
      );

      tl.fromTo(
        '.loader-lifeline',
        { scaleY: 0, transformOrigin: '50% 0%' },
        { scaleY: 1, duration: 0.4, stagger: 0.05, ease: 'expo.out' },
        0.22
      );
      tl.fromTo(
        '.loader-pill',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out' },
        0.24
      );

      tl.fromTo(
        '.loader-pulse-line',
        { strokeDashoffset: 420 },
        { strokeDashoffset: 0, duration: 0.42, stagger: 0.08, ease: 'power3.out' },
        0.58
      );
      tl.fromTo(
        '.loader-pulse-label',
        { opacity: 0 },
        { opacity: 1, duration: 0.22, stagger: 0.08 },
        0.68
      );

      tl.to(
        diagramRef.current,
        { scale: 0.24, opacity: 0, svgOrigin: '500 255', duration: 0.45, ease: 'expo.inOut' },
        1.32
      );
      tl.fromTo(
        sealRingRef.current,
        { scale: 0.5, opacity: 0, rotation: -35, svgOrigin: '500 255' },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'expo.out' },
        1.46
      );
      tl.fromTo(
        bladesRef.current,
        { rotation: -48, opacity: 0, svgOrigin: '500 255' },
        { rotation: 0, opacity: 1, duration: 0.46, ease: 'expo.out' },
        1.52
      );

      tl.call(
        () => {
          const target = 'PROJECT AURUM';
          const glyphs = '916750AU#·0842';
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - start) / 340);
            const lock = Math.floor(p * target.length);
            setWordmark(
              target
                .split('')
                .map((c, i) =>
                  c === ' ' || i < lock
                    ? c
                    : glyphs[(i * 5 + Math.floor(now / 30)) % glyphs.length]
                )
                .join('')
            );
            if (p < 1 && !openingRef.current) decodeRaf = requestAnimationFrame(step);
          };
          decodeRaf = requestAnimationFrame(step);
        },
        [],
        1.68
      );

      tl.call(() => triggerIrisOpen(false), [], 2.18);
    }, root);

    return () => {
      window.removeEventListener('keydown', onSkipKey);
      if (decodeRaf) cancelAnimationFrame(decodeRaf);
      ctx.revert();
    };
  }, [triggerIrisOpen]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      onClick={() => triggerIrisOpen(true)}
      role="status"
      aria-label="Loading Project AURUM"
      className="fixed inset-0 z-[120] cursor-pointer select-none overflow-hidden"
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="aurum-iris-cutout">
            <rect width="100%" height="100%" fill="white" />
            <circle ref={holeRef} cx="50%" cy="50%" r="0" fill="black" />
          </mask>
          <linearGradient id="loaderGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff6da" />
            <stop offset="50%" stopColor="#e5be6a" />
            <stop offset="100%" stopColor="#9c6c22" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="#120203" mask="url(#aurum-iris-cutout)" />
      </svg>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <svg
          viewBox="0 0 1000 520"
          className="w-full max-w-4xl h-auto overflow-visible"
          aria-hidden="true"
        >
          <g ref={diagramRef}>
            <line
              x1="120"
              y1="120"
              x2="880"
              y2="120"
              stroke="rgba(247,223,163,0.32)"
              strokeWidth="1"
              className="loader-horizon"
            />

            {LIFELINES.map((lf) => (
              <g key={lf.label}>
                <g className="loader-pill">
                  <rect
                    x={lf.x - 72}
                    y="82"
                    width="144"
                    height="28"
                    rx="14"
                    fill="#240406"
                    stroke="rgba(247,223,163,0.36)"
                    strokeWidth="1"
                  />
                  <text
                    x={lf.x}
                    y="100"
                    textAnchor="middle"
                    fill="#f7dfa3"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                  >
                    {lf.label}
                  </text>
                </g>
                <line
                  x1={lf.x}
                  y1="120"
                  x2={lf.x}
                  y2="395"
                  stroke="rgba(247,223,163,0.22)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  className="loader-lifeline"
                />
              </g>
            ))}

            {PULSES.map((p) => (
              <g key={p.text}>
                <line
                  x1={p.x1}
                  y1={p.y}
                  x2={p.x2}
                  y2={p.y}
                  stroke="url(#loaderGoldStroke)"
                  strokeWidth="1.6"
                  strokeDasharray="420"
                  className="loader-pulse-line"
                />
                <circle cx={p.x2} cy={p.y} r="3.5" fill="#f7dfa3" className="loader-pulse-label" />
                <text
                  x={(p.x1 + p.x2) / 2}
                  y={p.y - 8}
                  textAnchor="middle"
                  fill="#ebd7d8"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                  className="loader-pulse-label"
                >
                  {p.text}
                </text>
              </g>
            ))}
          </g>

          <g ref={sealRingRef} opacity="0">
            <circle
              cx="500"
              cy="255"
              r="96"
              fill="rgba(26,3,4,0.85)"
              stroke="url(#loaderGoldStroke)"
              strokeWidth="3"
            />
            <circle
              cx="500"
              cy="255"
              r="82"
              fill="none"
              stroke="rgba(247,223,163,0.45)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />

            <g ref={bladesRef}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <path
                  key={deg}
                  d="M500 255 L546 212 A66 66 0 0 1 566 255 Z"
                  fill="rgba(61,9,12,0.72)"
                  stroke="rgba(247,223,163,0.38)"
                  strokeWidth="0.9"
                  transform={`rotate(${deg} 500 255)`}
                />
              ))}
              <circle
                cx="500"
                cy="255"
                r="18"
                fill="#1a0304"
                stroke="#f7dfa3"
                strokeWidth="1.4"
              />
            </g>
          </g>
        </svg>

        <div ref={footerHudRef} className="mt-2 flex flex-col items-center gap-2 text-center">
          <p className="font-display text-xl sm:text-2xl tracking-[0.18em] text-[var(--gold-bright)]">
            {wordmark}
          </p>
          <div className="flex items-center gap-4 font-data text-xs text-[var(--ink-dark-3)]">
            <span>{String(pct).padStart(3, '0')}%</span>
            <span>·</span>
            <span className="underline decoration-[rgba(247,223,163,0.35)]">Click to skip</span>
          </div>
        </div>
      </div>
    </div>
  );
};
