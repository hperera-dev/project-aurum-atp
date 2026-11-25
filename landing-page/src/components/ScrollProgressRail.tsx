'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgressRail: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 190,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[60] h-[2.5px] bg-transparent pointer-events-none"
    >
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="h-full w-full bg-[linear-gradient(90deg,oklch(68%_0.11_80),oklch(85.5%_0.105_83.5),oklch(78.5%_0.142_156))]"
      />
    </div>
  );
};
