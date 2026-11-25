'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

interface TiltSpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
  beam?: boolean;
  onClick?: () => void;
}

export const TiltSpotlightCard: React.FC<TiltSpotlightCardProps> = ({
  children,
  className = '',
  innerClassName = '',
  maxTilt = 5.5,
  beam = false,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Zero-rerender MotionValues (0 React setState calls on pointermove!)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const spotX = useMotionValue(-300);
  const spotY = useMotionValue(-300);
  const glowOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(normY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 220,
    damping: 24,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(normX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 220,
    damping: 24,
    mass: 0.6,
  });
  const smoothGlow = useSpring(glowOpacity, { stiffness: 180, damping: 24 });

  const borderGlowBg = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, oklch(88% 0.115 83 / 0.92), oklch(78% 0.14 156 / 0.5) 45%, transparent 72%)`;
  const surfaceGlowBg = useMotionTemplate`radial-gradient(360px circle at ${spotX}px ${spotY}px, oklch(84% 0.11 83 / 0.16), oklch(78% 0.14 156 / 0.08) 45%, transparent 72%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    spotX.set(x);
    spotY.set(y);
    normX.set(x / r.width - 0.5);
    normY.set(y / r.height - 0.5);
    glowOpacity.set(1);
  };

  const handlePointerLeave = () => {
    normX.set(0);
    normY.set(0);
    glowOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      }}
      className={`${beam ? 'border-beam-card' : 'bezel-shell-velvet'} group relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Layer 1: GPU-Tracked Illuminated Gold & Emerald Border Edge */}
      <motion.div
        aria-hidden="true"
        style={{
          opacity: smoothGlow,
          background: borderGlowBg,
        }}
        className="pointer-events-none absolute inset-0 z-[1]"
      />

      {/* Inner Layered Core */}
      <div className={`bezel-core-velvet relative z-[2] h-full overflow-hidden ${innerClassName}`}>
        {/* Layer 2: Soft Interior Specular Gold Wash */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: smoothGlow,
            background: surfaceGlowBg,
          }}
          className="pointer-events-none absolute inset-0 z-0"
        />
        <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
      </div>
    </motion.div>
  );
};
