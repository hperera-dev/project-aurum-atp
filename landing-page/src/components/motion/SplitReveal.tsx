'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsapSetup';

interface SplitRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  mode?: 'chars' | 'words';
  play?: boolean;
  scrollTrigger?: boolean;
  delay?: number;
  className?: string;
  id?: string;
}

export const SplitReveal: React.FC<SplitRevealProps> = ({
  text,
  as: Tag = 'span',
  mode = 'words',
  play = true,
  scrollTrigger = false,
  delay = 0,
  className = '',
  id,
}) => {
  const rootRef = useRef<HTMLElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || animatedRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!scrollTrigger && !play) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('.sr-unit');
      if (!targets.length) return;

      gsap.set(targets, {
        yPercent: 108,
        opacity: 0,
        filter: 'blur(8px)',
        rotateX: -28,
        transformOrigin: '50% 100%',
      });

      const vars: gsap.TweenVars = {
        yPercent: 0,
        opacity: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        duration: mode === 'chars' ? 0.82 : 0.72,
        stagger: mode === 'chars' ? 0.018 : 0.036,
        ease: 'expo.out',
        delay,
        onComplete: () => {
          animatedRef.current = true;
          gsap.set(targets, { clearProps: 'filter,transform' });
        },
      };

      if (scrollTrigger) {
        vars.scrollTrigger = {
          trigger: el,
          start: 'top 86%',
          once: true,
        };
      }

      gsap.to(targets, vars);
    }, el);

    return () => ctx.revert();
  }, [play, scrollTrigger, mode, delay]);

  const words = text.split(' ');

  return (
    // @ts-expect-error polymorphic intrinsic tag ref
    <Tag ref={rootRef} id={id} className={className} aria-label={text}>
      {words.map((word, wIdx) => (
        <span
          key={`${word}-${wIdx}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] mr-[0.26em] last:mr-0"
        >
          {mode === 'chars' ? (
            word.split('').map((ch, cIdx) => (
              <span key={cIdx} className="sr-unit inline-block will-change-transform">
                {ch}
              </span>
            ))
          ) : (
            <span className="sr-unit inline-block will-change-transform">{word}</span>
          )}
        </span>
      ))}
    </Tag>
  );
};
