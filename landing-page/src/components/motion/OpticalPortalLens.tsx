'use client';

import React, { useEffect, useRef } from 'react';

export interface PortalState {
  progress: number; // 0 (rest) -> 1 (full screen dive complete)
  portalRadius: number;
  cx: number;
  cy: number;
}

interface OpticalPortalLensProps {
  portalStateRef: React.MutableRefObject<PortalState>;
}

/**
 * High-contrast multi-ring concentric optical bezel + watchmaker vernier ticks +
 * subtle chromatic dispersion (modeled on precision camera / assay loupe optics).
 * Never squashes into a 3D oval and never fills the center with milky haze.
 */
export const OpticalPortalLens: React.FC<OpticalPortalLensProps> = ({ portalStateRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let w = window.innerWidth || 1440;
    let h = window.innerHeight || 900;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth || window.innerWidth || 1440;
      h = canvas.clientHeight || window.innerHeight || 900;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const pointer = { nx: 0, ny: 0, sx: 0, sy: 0 };
    const hasFine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (e: PointerEvent) => {
      pointer.nx = (e.clientX / (w || 1) - 0.5) * 2;
      pointer.ny = (e.clientY / (h || 1) - 0.5) * 2;
    };
    if (hasFine) window.addEventListener('pointermove', onMove, { passive: true });

    let isVisible = true;
    let rafId = 0;
    let t = 0;
    let last = performance.now();

    const drawSpecularRing = (
      cx: number,
      cy: number,
      radius: number,
      lineWidth: number,
      rotAngle: number,
      peakAlpha: number,
      tint: 'gold' | 'white' | 'cyan' | 'ruby'
    ) => {
      if (radius <= 2 || peakAlpha <= 0.01) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotAngle);

      const grad = ctx.createLinearGradient(-radius, -radius * 0.4, radius, radius * 0.4);
      if (tint === 'white') {
        grad.addColorStop(0, `rgba(255, 252, 244, ${(peakAlpha * 0.95).toFixed(3)})`);
        grad.addColorStop(0.26, `rgba(247, 223, 163, ${(peakAlpha * 0.35).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(20, 2, 3, ${(peakAlpha * 0.08).toFixed(3)})`);
        grad.addColorStop(0.78, `rgba(247, 223, 163, ${(peakAlpha * 0.52).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 250, 238, ${(peakAlpha * 0.9).toFixed(3)})`);
      } else if (tint === 'gold') {
        grad.addColorStop(0, `rgba(247, 223, 163, ${(peakAlpha * 0.9).toFixed(3)})`);
        grad.addColorStop(0.3, `rgba(199, 152, 62, ${(peakAlpha * 0.22).toFixed(3)})`);
        grad.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(0.82, `rgba(229, 190, 106, ${(peakAlpha * 0.68).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 246, 218, ${(peakAlpha * 0.88).toFixed(3)})`);
      } else if (tint === 'cyan') {
        grad.addColorStop(0, `rgba(165, 228, 255, ${(peakAlpha * 0.38).toFixed(3)})`);
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, `rgba(255, 190, 150, ${(peakAlpha * 0.34).toFixed(3)})`);
      } else {
        grad.addColorStop(0, `rgba(225, 48, 68, ${(peakAlpha * 0.45).toFixed(3)})`);
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, `rgba(247, 223, 163, ${(peakAlpha * 0.38).toFixed(3)})`);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const render = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(render);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      pointer.sx += (pointer.nx - pointer.sx) * 0.06;
      pointer.sy += (pointer.ny - pointer.sy) * 0.06;

      ctx.clearRect(0, 0, w, h);

      const p = portalStateRef.current.progress;
      const maxDiag = Math.hypot(w, h) * 0.72;

      // At rest (p=0): subtle precision optical instrument framed behind left headline (x=28%), completely clear of the portrait on the right!
      // On scroll (p: 0 -> 1): glides smoothly to dead-center (50%, 50%) and expands across the entire screen around the portal cutout!
      const restCx = w >= 1024 ? w * 0.28 : w * 0.5;
      const restCy = h * 0.52;
      const moveBlend = Math.min(1, p * 2.6);
      const easeMove = 1 - Math.pow(1 - moveBlend, 3);

      const cx = restCx + (w * 0.5 - restCx) * easeMove + pointer.sx * 12 * (1 - p);
      const cy = restCy + (h * 0.5 - restCy) * easeMove + pointer.sy * 10 * (1 - p);

      const baseR = Math.min(w, h) * 0.31;
      const outerR = baseR + Math.pow(p, 1.55) * (maxDiag * 1.35);

      // Inner portal hole starts opening cleanly as soon as scroll > 0.03
      const portalP = Math.max(0, (p - 0.03) / 0.97);
      const portalR = Math.pow(portalP, 1.45) * (maxDiag * 1.12);

      portalStateRef.current.cx = cx;
      portalStateRef.current.cy = cy;
      portalStateRef.current.portalRadius = portalR;

      // Master visibility: refined atmospheric presence at rest (0.46), full razor-sharp brilliance while zooming, fading gently only past screen edge
      const activeBoost = Math.min(1, p * 4.5);
      const edgeFade = p > 0.88 ? Math.max(0, 1 - (p - 0.88) / 0.12) : 1;
      const masterAlpha = (0.44 + activeBoost * 0.56) * edgeFade;
      if (masterAlpha <= 0.01) return;

      const pointerAngle = Math.atan2(pointer.sy, pointer.sx);

      // 1. Dark High-Contrast Barrel Channel (creates the luxury Leica/Cartier dark-gap separation between bright specular rings)
      if (p > 0.01) {
        ctx.save();
        ctx.strokeStyle = `rgba(12, 1, 2, ${(0.72 * activeBoost * edgeFade).toFixed(3)})`;
        ctx.lineWidth = Math.max(18, outerR * 0.095);
        ctx.beginPath();
        ctx.arc(cx, cy, outerR * 0.93, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Outer Watchmaker / Assay Vernier Degree Ticks (120 precision radial ticks)
      const tickR = outerR * 1.055;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.035 + p * 0.45);
      for (let i = 0; i < 120; i++) {
        const ang = (i / 120) * Math.PI * 2;
        const isMajor = i % 10 === 0;
        const isMid = i % 5 === 0;
        const len = isMajor ? 11 : isMid ? 7 : 4;
        const a = (isMajor ? 0.52 : isMid ? 0.3 : 0.16) * masterAlpha;
        ctx.strokeStyle = `rgba(247, 223, 163, ${a.toFixed(3)})`;
        ctx.lineWidth = isMajor ? 1.2 : 0.8;
        const cos = Math.cos(ang);
        const sin = Math.sin(ang);
        ctx.beginPath();
        ctx.moveTo(cos * tickR, sin * tickR);
        ctx.lineTo(cos * (tickR + len), sin * (tickR + len));
        ctx.stroke();
      }
      ctx.restore();

      // 3. Concentric Multi-Ring Specular Stack + Subtle Chromatic Dispersion Fringe
      drawSpecularRing(cx, cy, outerR * 1.0, 2.2, t * 0.16 + pointerAngle * 0.25, 0.95 * masterAlpha, 'white');
      drawSpecularRing(cx, cy, outerR * 0.972, 1.2, -t * 0.22, 0.72 * masterAlpha, 'gold');
      drawSpecularRing(cx, cy, outerR * 0.942, 3.2, t * 0.11 + 1.1, 0.88 * masterAlpha, 'gold');
      drawSpecularRing(cx, cy, outerR * 0.916, 1.4, -t * 0.18 + 2.1, 0.85 * masterAlpha, 'cyan');
      drawSpecularRing(cx, cy, outerR * 0.912, 1.4, t * 0.18 + 0.5, 0.8 * masterAlpha, 'ruby');
      drawSpecularRing(cx, cy, outerR * 0.885, 2.0, -t * 0.14 + 0.8, 0.92 * masterAlpha, 'white');
      drawSpecularRing(cx, cy, outerR * 0.848, 1.0, t * 0.26 + 2.6, 0.62 * masterAlpha, 'gold');

      // 4. Inner Portal Lip Rim (tracks the exact expanding clip-path portal edge!)
      if (portalR > 4) {
        drawSpecularRing(cx, cy, portalR + 2, 2.4, -t * 0.3 + p * 2.0, 0.96 * edgeFade, 'white');
        drawSpecularRing(cx, cy, portalR + 6, 1.2, t * 0.25, 0.78 * edgeFade, 'gold');
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          last = performance.now();
          rafId = requestAnimationFrame(render);
        }
      },
      { rootMargin: '100px' }
    );
    io.observe(canvas);
    rafId = requestAnimationFrame(render);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      if (hasFine) window.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [portalStateRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full block"
    />
  );
};
