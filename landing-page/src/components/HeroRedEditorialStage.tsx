'use client';

import React, { useEffect, useRef } from 'react';

const JEWEL_GLINTS = [
  { x: 0.322, y: 0.44, size: 0.95, ruby: true, phase: 0.4, speed: 1.55 },
  { x: 0.355, y: 0.682, size: 0.78, ruby: false, phase: 1.8, speed: 1.75 },
  { x: 0.512, y: 0.764, size: 1.25, ruby: true, phase: 0.0, speed: 1.35 },
  { x: 0.495, y: 0.728, size: 0.85, ruby: false, phase: 2.6, speed: 1.9 },
  { x: 0.648, y: 0.668, size: 0.82, ruby: false, phase: 4.1, speed: 1.65 },
] as const;

const IMG_RATIO = 1200 / 1607;

export const HeroRedEditorialStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const glintCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const portraitWrap = portraitWrapRef.current;
    const canvas = glintCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!stage || !portraitWrap || !canvas || !ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    let prefersReduced = reducedMotionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
    };
    reducedMotionQuery.addEventListener('change', onMotionChange);

    let pW = 720;
    let pH = 860;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      pW = portraitWrap.clientWidth || 720;
      pH = portraitWrap.clientHeight || 860;
      canvas.width = Math.round(pW * dpr);
      canvas.height = Math.round(pH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pointer = { active: false, x: 0, y: 0, nx: 0, ny: 0, sx: 0, sy: 0 };

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReduced) return;
      const r = stage.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      pointer.active = inside;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = inside ? Math.max(-1, Math.min(1, ((e.clientX - r.left) / (r.width || 1) - 0.5) * 2)) : 0;
      pointer.ny = inside ? Math.max(-1, Math.min(1, ((e.clientY - r.top) / (r.height || 1) - 0.5) * 2)) : 0;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.nx = 0;
      pointer.ny = 0;
    };

    if (hasFinePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }
    window.addEventListener('resize', resize);

    let isVisible = true;
    let isTabVisible = !document.hidden;
    let rafId = 0;
    let t = 0;
    let lastTs = performance.now();

    const drawFrame = (now: number) => {
      if (!isVisible || !isTabVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(drawFrame);

      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      ctx.clearRect(0, 0, pW, pH);

      if (prefersReduced) {
        portraitWrap.style.transform = 'none';
        return;
      }

      t += dt;
      if (hasFinePointer) {
        pointer.sx += (pointer.nx - pointer.sx) * 0.05;
        pointer.sy += (pointer.ny - pointer.sy) * 0.05;
        portraitWrap.style.transform = `translate3d(${(-pointer.sx * 7).toFixed(2)}px, ${(-pointer.sy * 4).toFixed(2)}px, 0) scale(1.02)`;
      }

      const wide = pW / (pH || 1) > IMG_RATIO;
      const rW = wide ? pW : pH * IMG_RATIO;
      const rH = wide ? pW / IMG_RATIO : pH;
      const oX = wide ? 0 : (pW - rW) * 0.5;
      const oY = wide ? (pH - rH) * 0.18 : 0;

      const pRect = hasFinePointer && pointer.active ? portraitWrap.getBoundingClientRect() : null;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const gem of JEWEL_GLINTS) {
        const gx = oX + gem.x * rW;
        const gy = oY + gem.y * rH;
        const wave = Math.pow((Math.sin(t * gem.speed + gem.phase) + 1) * 0.5, 2.4);
        const boost = pRect
          ? Math.max(0, 1 - Math.hypot(pointer.x - pRect.left - gx, pointer.y - pRect.top - gy) / 150) * 0.68
          : 0;
        const intensity = Math.min(1, 0.14 + wave * 0.48 + boost);
        if (intensity <= 0.05) continue;

        const rad = rW * 0.032 * gem.size * (0.78 + 0.34 * intensity);
        const spin = 0.25 + Math.sin(t * 0.35 + gem.phase) * 0.14;

        const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad * 1.1);
        bloom.addColorStop(0, `rgba(255,248,234,${(0.9 * intensity).toFixed(3)})`);
        bloom.addColorStop(
          0.32,
          gem.ruby
            ? `rgba(244,114,126,${(0.42 * intensity).toFixed(3)})`
            : `rgba(247,223,163,${(0.46 * intensity).toFixed(3)})`
        );
        bloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(gx, gy, rad * 1.1, 0, Math.PI * 2);
        ctx.fill();

        for (const [rot, len, thick, a] of [
          [spin, rad, 0.95, 0.85 * intensity],
          [spin + Math.PI / 2, rad * 0.82, 0.85, 0.72 * intensity],
        ]) {
          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(rot);
          const sg = ctx.createLinearGradient(-len, 0, len, 0);
          sg.addColorStop(0, 'rgba(255,245,220,0)');
          sg.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`);
          sg.addColorStop(1, 'rgba(255,245,220,0)');
          ctx.fillStyle = sg;
          ctx.beginPath();
          ctx.ellipse(0, 0, len, thick, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      ctx.restore();
    };

    const wake = () => {
      if (isVisible && isTabVisible && !rafId) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) wake();
      },
      { rootMargin: '80px' }
    );
    observer.observe(stage);

    const onVis = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) wake();
    };
    document.addEventListener('visibilitychange', onVis);
    wake();

    return () => {
      reducedMotionQuery.removeEventListener('change', onMotionChange);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (hasFinePointer) {
        window.removeEventListener('pointermove', onPointerMove);
        stage.removeEventListener('pointerleave', onPointerLeave);
      }
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 68% 72% at 72% 38%, #470a0f 0%, #2d0609 48%, #180304 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[56svh] min-h-[360px] max-h-[500px] md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[min(58vw,780px)] lg:w-[min(54vw,820px)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_98%)] md:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.58)_14%,black_30%,black_100%)]">
        <div
          ref={portraitWrapRef}
          className="relative w-full h-full will-change-transform"
          style={{ transform: 'scale(1.02)' }}
        >
          <img
            src="/images/hero-red-editorial.jpg"
            alt="Editorial haute-joaillerie portrait wearing a 22K gold and ruby necklace and matching ruby drop earrings against deep crimson velvet"
            width={1200}
            height={1607}
            fetchPriority="high"
            className="w-full h-full object-cover object-[50%_18%] select-none"
          />
          <canvas
            ref={glintCanvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(24,3,4,0.28) 0%, rgba(24,3,4,0) 14%, rgba(24,3,4,0) 34%, rgba(24,3,4,0.72) 48%, rgba(24,3,4,0.96) 58%, rgba(24,3,4,1) 100%)',
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 82% at 18% 64%, rgba(24,3,4,0.92) 0%, rgba(36,6,8,0.68) 46%, rgba(36,6,8,0) 80%), linear-gradient(180deg, rgba(24,3,4,0.34) 0%, rgba(24,3,4,0) 18%, rgba(24,3,4,0) 76%, rgba(22,3,4,0.9) 100%)',
        }}
      />
    </div>
  );
};
