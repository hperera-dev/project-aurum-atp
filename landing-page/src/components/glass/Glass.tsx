'use client';

import React, { useRef } from 'react';

type GlassVariant = 'panel' | 'pill' | 'card' | 'toolbar' | 'modal';

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
  tone?: 'dark' | 'light';
  refract?: boolean;
  interactive?: boolean;
}

const VARIANT_RADIUS: Record<GlassVariant, string> = {
  panel: 'rounded-[2rem]',
  pill: 'rounded-full',
  card: 'rounded-3xl',
  toolbar: 'rounded-full',
  modal: 'rounded-[1.85rem]',
};

export const Glass: React.FC<GlassProps> = ({
  variant = 'card',
  tone = 'dark',
  refract = false,
  interactive = true,
  className = '',
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType === 'touch') return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = ((clientX - r.left) / (r.width || 1)) * 100;
      const y = ((clientY - r.top) / (r.height || 1)) * 100;
      const deg = (Math.atan2(y - 50, x - 50) * 180) / Math.PI + 90;
      el.style.setProperty('--mx', `${x.toFixed(1)}%`);
      el.style.setProperty('--my', `${y.toFixed(1)}%`);
      el.style.setProperty('--rim-angle', `${deg.toFixed(1)}deg`);

      if (spotRef.current) {
        spotRef.current.style.opacity = '1';
        spotRef.current.style.background =
          tone === 'dark'
            ? `radial-gradient(280px circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(247,223,163,0.12), transparent 72%)`
            : `radial-gradient(280px circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(156,108,34,0.08), transparent 72%)`;
      }
    });
  };

  const handlePointerLeave = () => {
    if (spotRef.current) spotRef.current.style.opacity = '0';
  };

  const radius = VARIANT_RADIUS[variant];
  const toneClass = tone === 'dark' ? 'aurum-glass-dark' : 'aurum-glass-light';

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`aurum-glass ${toneClass} ${radius} ${className}`}
      {...rest}
    >
      {refract && (
        <span
          aria-hidden="true"
          style={{ filter: 'url(#aurum-edge-refraction)' }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[rgba(247,223,163,0.16)] opacity-55"
        />
      )}
      {interactive && (
        <div
          ref={spotRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      )}
      {children}
    </div>
  );
};
