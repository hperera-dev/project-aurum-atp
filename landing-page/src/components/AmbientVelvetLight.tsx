'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const AmbientVelvetLight: React.FC = () => {
  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);

  const smoothX = useSpring(mouseX, { stiffness: 75, damping: 24, mass: 0.7 });
  const smoothY = useSpring(mouseY, { stiffness: 75, damping: 24, mass: 0.7 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX - 240);
      mouseY.set(e.clientY - 240);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: smoothX, y: smoothY }}
      className="pointer-events-none fixed top-0 left-0 z-[5] w-[480px] h-[480px] rounded-full opacity-35 hidden lg:block bg-[radial-gradient(circle,oklch(78.5%_0.116_82/0.16)_0%,oklch(44%_0.08_162/0.14)_38%,transparent_70%)]"
    />
  );
};
