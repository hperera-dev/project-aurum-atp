'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const scrollVelocityState = {
  velocity: 0,
};

export { gsap, ScrollTrigger };
