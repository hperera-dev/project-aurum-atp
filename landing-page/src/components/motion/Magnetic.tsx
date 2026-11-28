'use client';

import React, { useRef } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

interface MagneticButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'gold' | 'dark';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  cursorLabel?: string;
}

export const MagneticCTA: React.FC<MagneticButtonProps> = ({
  onClick,
  children,
  variant = 'gold',
  className = '',
  type = 'button',
  disabled = false,
  cursorLabel,
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || e.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
    el.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
  };

  const onLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = '';
  };

  const isDark = variant === 'dark';

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor={cursorLabel}
      className={`${isDark ? 'btn-primary-dark' : 'btn-primary-gold'} ${
        disabled ? 'opacity-60 pointer-events-none' : ''
      } ${className}`}
    >
      <span>{children}</span>
      <span className={isDark ? 'btn-pill-badge-gold' : 'btn-pill-badge-dark'} aria-hidden="true">
        <ArrowUpRight size={17} className="btn-pill-icon" />
      </span>
    </button>
  );
};
