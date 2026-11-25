'use client';

import React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

interface PrimaryButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'gold' | 'dark';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const MagneticCTA: React.FC<PrimaryButtonProps> = ({
  href,
  onClick,
  children,
  variant = 'gold',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  const isDarkBtn = variant === 'dark';
  const baseClass = isDarkBtn ? 'btn-primary-dark' : 'btn-primary-gold';
  const badgeClass = isDarkBtn ? 'btn-pill-badge-gold' : 'btn-pill-badge-dark';

  const content = (
    <>
      <span>{children}</span>
      <span className={badgeClass} aria-hidden="true">
        <ArrowUpRight size={17} weight="regular" className="btn-pill-icon" />
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseClass} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`}
    >
      {content}
    </button>
  );
};
