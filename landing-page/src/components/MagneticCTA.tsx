'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from '@phosphor-icons/react';

interface MagneticCTAProps {
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const MagneticCTA: React.FC<MagneticCTAProps> = ({
  href,
  type = 'button',
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 24, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 24, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || e.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - (rect.left + rect.width / 2);
    const offsetY = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-5, Math.min(5, offsetX * 0.12)));
    y.set(Math.max(-4, Math.min(4, offsetY * 0.12)));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const innerContent = (
    <>
      <span>{children}</span>
      <span className="btn-bullion-badge" aria-hidden="true">
        <ArrowUpRight size={17} weight="light" className="btn-bullion-icon" />
      </span>
    </>
  );

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {href ? (
        <a href={href} onClick={onClick} className={`btn-bullion ${className}`}>
          {innerContent}
        </a>
      ) : (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`btn-bullion disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        >
          {innerContent}
        </button>
      )}
    </motion.div>
  );
};
