'use client';

import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'gold' | 'dark';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const MagneticCTA: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  variant = 'gold',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const isDark = variant === 'dark';
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
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
