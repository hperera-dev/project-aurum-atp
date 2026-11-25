'use client';

import React, { useEffect, useRef } from 'react';

interface HeirloomPortraitCinemaProps {
  paused: boolean;
}

// Exact ruler-verified binocular socket centers on the 1254x1256 native 2K cutout
const EYE_PATCH = { x: 0.3349, y: 0.2229, w: 0.1754, h: 0.0717 };

const LEFT_EYE = {
  cx: 0.376,
  cy: 0.256,
  scleraRx: 0.0175,
  scleraRy: 0.0085,
  spriteSize: 26 / 1254,
  maxShiftX: 0.0066,
  maxShiftY: 0.002,
};

const RIGHT_EYE = {
  cx: 0.4486,
  cy: 0.2556,
  scleraRx: 0.022,
  scleraRy: 0.0088,
  spriteSize: 26 / 1254,
  maxShiftX: 0.009,
  maxShiftY: 0.002,
};

// Exact normalized coordinates of 12 real jewels & 22K gold pieces on her cutout
const JEWEL_GLINTS: {
  x: number;
  y: number;
  size: number;
  tone: 'ruby' | 'diamond' | 'gold';
  phase: number;
  speed: number;
}[] = [
  { x: 0.442, y: 0.088, size: 1.25, tone: 'ruby', phase: 0.2, speed: 1.5 }, // Tiara center ruby
  { x: 0.386, y: 0.114, size: 0.8, tone: 'diamond', phase: 1.6, speed: 1.9 }, // Tiara left
  { x: 0.532, y: 0.146, size: 0.82, tone: 'diamond', phase: 3.1, speed: 1.7 }, // Tiara right
  { x: 0.532, y: 0.344, size: 0.92, tone: 'diamond', phase: 2.3, speed: 2.1 }, // Drop earring
  { x: 0.451, y: 0.468, size: 0.78, tone: 'gold', phase: 0.9, speed: 1.6 }, // Choker clasp
  { x: 0.431, y: 0.538, size: 1.38, tone: 'ruby', phase: 0.0, speed: 1.35 }, // Hero ruby necklace pendant
  { x: 0.396, y: 0.642, size: 1.22, tone: 'ruby', phase: 2.8, speed: 1.45 }, // Upper bodice ruby brooch
  { x: 0.292, y: 0.498, size: 0.85, tone: 'gold', phase: 4.1, speed: 2.0 }, // Upper hand ring 1
  { x: 0.312, y: 0.544, size: 0.98, tone: 'diamond', phase: 1.1, speed: 1.85 }, // Upper hand ruby/diamond ring 2
  { x: 0.203, y: 0.692, size: 0.88, tone: 'gold', phase: 3.6, speed: 1.7 }, // Left wrist gold bangles
  { x: 0.776, y: 0.782, size: 0.86, tone: 'ruby', phase: 5.0, speed: 1.6 }, // Sleeve ruby armband
  { x: 0.602, y: 0.942, size: 0.82, tone: 'gold', phase: 2.0, speed: 1.8 }, // Lower wrist bangles
];

export const HeirloomPortraitCinema: React.FC<HeirloomPortraitCinemaProps> = ({ paused }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const mountainLayerRef = useRef<HTMLDivElement>(null);
  const bgEffectsCanvasRef = useRef<HTMLCanvasElement>(null);
  const outlineLayerRef = useRef<HTMLImageElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitOverlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const stage = stageRef.current;
    const bgCanvas = bgEffectsCanvasRef.current;
    const portraitWrap = portraitWrapRef.current;
    const fgCanvas = portraitOverlayCanvasRef.current;
    if (!stage || !bgCanvas || !portraitWrap || !fgCanvas) return;

    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    if (!bgCtx || !fgCtx) return;

    const loadImg = (src: string) => {
      const im = new Image();
      im.src = src;
      return im;
    };
    const leftIrisImg = loadImg('/images/iris-left.png');
    const rightIrisImg = loadImg('/images/iris-right.png');
    const eyelidsImg = loadImg('/images/eye-lids-overlay.png');

    let stageW = stage.clientWidth || 1280;
    let stageH = stage.clientHeight || 760;
    let pW = portraitWrap.clientWidth || 627;
    let pH = portraitWrap.clientHeight || 628;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      stageW = stage.clientWidth || 1280;
      stageH = stage.clientHeight || 760;
      bgCanvas.width = Math.round(stageW * dpr);
      bgCanvas.height = Math.round(stageH * dpr);
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pW = portraitWrap.clientWidth || 627;
      pH = portraitWrap.clientHeight || 628;
      fgCanvas.width = Math.round(pW * dpr);
      fgCanvas.height = Math.round(pH * dpr);
      fgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Subtle floating gold dust motes in the mountain air behind her silhouette
    const motes = Array.from({ length: 34 }, (_, i) => ({
      xFrac: 0.1 + ((i * 0.6180339887) % 0.85),
      yFrac: 0.08 + ((i * 0.381966) % 0.72),
      speed: 0.14 + (i % 5) * 0.04,
      size: 0.9 + (i % 4) * 0.45,
      phase: i * 1.13,
    }));

    // Refined hover cursor shimmer trail behind her silhouette (no loud glow around her head!)
    const trail: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];

    const pointer = {
      active: false,
      hoverAmount: 0,
      clientX: stageW * 0.65,
      clientY: stageH * 0.4,
      stageX: stageW * 0.65,
      stageY: stageH * 0.4,
      normX: 0,
      normY: 0,
      smoothNormX: 0,
      smoothNormY: 0,
      gazeX: 0,
      gazeY: 0,
      gazeBlend: 0,
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      pointer.clientX = e.clientX;
      pointer.clientY = e.clientY;
      pointer.stageX = e.clientX - rect.left;
      pointer.stageY = e.clientY - rect.top;
      pointer.normX = Math.max(-1, Math.min(1, (pointer.stageX / (rect.width || 1) - 0.5) * 2));
      pointer.normY = Math.max(-1, Math.min(1, (pointer.stageY / (rect.height || 1) - 0.5) * 2));
      pointer.active = inside;

      if (inside && !pausedRef.current && trail.length < 32) {
        trail.push({
          x: pointer.stageX + (Math.random() - 0.5) * 16,
          y: pointer.stageY + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 12,
          vy: -10 - Math.random() * 18,
          life: 1,
          size: 1.1 + Math.random() * 1.8,
        });
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.normX = 0;
      pointer.normY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', resize);

    let isVisible = true;
    let isTabVisible = !document.hidden;
    let rafId = 0;
    let t = 0;
    let lastTs = performance.now();

    const drawStarGlint = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      angle: number,
      intensity: number,
      tone: 'ruby' | 'diamond' | 'gold'
    ) => {
      if (intensity <= 0.04) return;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const bloomR = radius * 1.15;
      const bg = ctx.createRadialGradient(x, y, 0, x, y, bloomR);
      if (tone === 'ruby') {
        bg.addColorStop(0, `rgba(255, 246, 232, ${(0.9 * intensity).toFixed(3)})`);
        bg.addColorStop(0.28, `rgba(255, 118, 146, ${(0.48 * intensity).toFixed(3)})`);
        bg.addColorStop(0.65, `rgba(186, 20, 48, ${(0.18 * intensity).toFixed(3)})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
      } else if (tone === 'gold') {
        bg.addColorStop(0, `rgba(255, 250, 232, ${(0.9 * intensity).toFixed(3)})`);
        bg.addColorStop(0.32, `rgba(247, 212, 130, ${(0.5 * intensity).toFixed(3)})`);
        bg.addColorStop(0.7, `rgba(196, 138, 42, ${(0.14 * intensity).toFixed(3)})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        bg.addColorStop(0, `rgba(255, 255, 255, ${(0.95 * intensity).toFixed(3)})`);
        bg.addColorStop(0.32, `rgba(255, 238, 205, ${(0.48 * intensity).toFixed(3)})`);
        bg.addColorStop(1, 'rgba(0,0,0,0)');
      }
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x, y, bloomR, 0, Math.PI * 2);
      ctx.fill();

      const drawSpike = (rot: number, len: number, thick: number, a: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        const sg = ctx.createLinearGradient(-len, 0, len, 0);
        sg.addColorStop(0, 'rgba(255,245,220,0)');
        sg.addColorStop(0.45, `rgba(255,245,220,${(a * 0.52).toFixed(3)})`);
        sg.addColorStop(0.5, `rgba(255,255,255,${a.toFixed(3)})`);
        sg.addColorStop(0.55, `rgba(255,245,220,${(a * 0.52).toFixed(3)})`);
        sg.addColorStop(1, 'rgba(255,245,220,0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(0, 0, len, thick, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      drawSpike(angle, radius * 1.08, 1.05, 0.92 * intensity);
      drawSpike(angle + Math.PI / 2, radius * 0.88, 0.95, 0.8 * intensity);
      drawSpike(angle + Math.PI / 4, radius * 0.44, 0.7, 0.46 * intensity);
      ctx.restore();
    };

    const drawFrame = (now: number) => {
      if (!isVisible || !isTabVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(drawFrame);

      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      if (!pausedRef.current) t += dt;

      const targetHover = pointer.active ? 1 : 0;
      pointer.hoverAmount += (targetHover - pointer.hoverAmount) * 0.06;
      pointer.smoothNormX += (pointer.normX - pointer.smoothNormX) * 0.06;
      pointer.smoothNormY += (pointer.normY - pointer.smoothNormY) * 0.06;

      // Subtle depth parallax on the painted Renaissance mountain horizon
      if (mountainLayerRef.current) {
        const mx = -pointer.smoothNormX * 15;
        const my = -pointer.smoothNormY * 7;
        mountainLayerRef.current.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0) scale(1.06)`;
      }

      // Subtle sculptural micro-offset on her curvy gold outline + dynamic cool directional shadow on hover
      if (outlineLayerRef.current) {
        const ox = -pointer.smoothNormX * 6;
        const oy = -pointer.smoothNormY * 4;
        outlineLayerRef.current.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0)`;
        outlineLayerRef.current.style.opacity = (0.58 + 0.24 * pointer.hoverAmount).toFixed(3);
      }

      if (portraitImgRef.current) {
        const sx = (-14 - pointer.smoothNormX * 14).toFixed(1);
        const sy = (20 - pointer.smoothNormY * 8).toFixed(1);
        const blur = (24 + pointer.hoverAmount * 14).toFixed(1);
        portraitImgRef.current.style.filter = `drop-shadow(${sx}px ${sy}px ${blur}px rgba(10, 1, 4, 0.92)) drop-shadow(0px 38px 54px rgba(8, 0, 2, 0.78))`;
      }

      // ------------------------------------------------------------------
      // LAYER 2: CLEAN SUBTLE SHIMMER SPARKS BEHIND HER (ZERO HEAD GLOW!)
      // ------------------------------------------------------------------
      bgCtx.clearRect(0, 0, stageW, stageH);

      bgCtx.save();
      bgCtx.globalCompositeOperation = 'screen';

      for (const m of motes) {
        const mx = m.xFrac * stageW + Math.sin(t * m.speed + m.phase) * 26;
        const my = m.yFrac * stageH + Math.cos(t * m.speed * 0.8 + m.phase) * 18;
        const twinkle = 0.25 + 0.75 * ((Math.sin(t * 2.0 + m.phase) + 1) * 0.5);
        const alpha = twinkle * (0.18 + 0.45 * pointer.hoverAmount);
        bgCtx.fillStyle = `rgba(255, 240, 195, ${alpha.toFixed(3)})`;
        bgCtx.beginPath();
        bgCtx.arc(mx, my, m.size, 0, Math.PI * 2);
        bgCtx.fill();
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const sp = trail[i];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.life -= dt * 1.25;
        if (sp.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        bgCtx.fillStyle = `rgba(255, 238, 188, ${(sp.life * 0.72).toFixed(3)})`;
        bgCtx.beginPath();
        bgCtx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
        bgCtx.fill();
      }
      bgCtx.restore();

      // ------------------------------------------------------------------
      // LAYER 3 OVERLAY: SYNCHRONIZED BINOCULAR EYES + 12 JEWEL GLINTS
      // ------------------------------------------------------------------
      fgCtx.clearRect(0, 0, pW, pH);

      const pRect = portraitWrap.getBoundingClientRect();
      // Midpoint between her two eyes on screen
      const faceScreenX = pRect.left + pRect.width * 0.412;
      const faceScreenY = pRect.top + pRect.height * 0.256;

      // Smoothly map cursor position to normalized (-1..1) gaze vector so BOTH eyes track corner-to-corner together!
      const rawDx = (pointer.clientX - faceScreenX) / Math.max(240, stageW * 0.34);
      const rawDy = (pointer.clientY - faceScreenY) / Math.max(180, stageH * 0.36);
      const clampedX = Math.max(-1, Math.min(1, rawDx));
      const clampedY = Math.max(-1, Math.min(1, rawDy));

      const targetGazeX = pointer.active && !pausedRef.current ? clampedX : 0;
      const targetGazeY = pointer.active && !pausedRef.current ? clampedY : 0;

      pointer.gazeX += (targetGazeX - pointer.gazeX) * 0.14;
      pointer.gazeY += (targetGazeY - pointer.gazeY) * 0.14;
      const targetGazeBlend = pointer.active && !pausedRef.current ? 1 : 0;
      pointer.gazeBlend += (targetGazeBlend - pointer.gazeBlend) * 0.12;

      const spritesReady =
        leftIrisImg.complete &&
        leftIrisImg.naturalWidth > 0 &&
        rightIrisImg.complete &&
        rightIrisImg.naturalWidth > 0 &&
        eyelidsImg.complete &&
        eyelidsImg.naturalWidth > 0;

      if (pointer.gazeBlend > 0.02 && spritesReady) {
        fgCtx.save();
        fgCtx.globalAlpha = pointer.gazeBlend;

        // 1. Warm oil-painted sclera completely covering resting irises inside both eye sockets
        fgCtx.fillStyle = '#d3bca8';
        fgCtx.beginPath();
        fgCtx.ellipse(
          LEFT_EYE.cx * pW,
          (LEFT_EYE.cy + 0.001) * pH,
          LEFT_EYE.scleraRx * pW,
          LEFT_EYE.scleraRy * pH,
          0,
          0,
          Math.PI * 2
        );
        fgCtx.fill();

        fgCtx.fillStyle = '#d9c3b3';
        fgCtx.beginPath();
        fgCtx.ellipse(
          RIGHT_EYE.cx * pW,
          (RIGHT_EYE.cy + 0.001) * pH,
          RIGHT_EYE.scleraRx * pW,
          RIGHT_EYE.scleraRy * pH,
          0,
          0,
          Math.PI * 2
        );
        fgCtx.fill();

        // 2. Draw BOTH real oil-painted irises in synchronized binocular lock!
        const lSize = LEFT_EYE.spriteSize * pW;
        const lIx = (LEFT_EYE.cx + pointer.gazeX * LEFT_EYE.maxShiftX) * pW - lSize / 2;
        const lIy = (LEFT_EYE.cy + pointer.gazeY * LEFT_EYE.maxShiftY) * pH - lSize / 2;
        fgCtx.drawImage(leftIrisImg, lIx, lIy, lSize, lSize);

        const rSize = RIGHT_EYE.spriteSize * pW;
        const rIx = (RIGHT_EYE.cx + pointer.gazeX * RIGHT_EYE.maxShiftX) * pW - rSize / 2;
        const rIy = (RIGHT_EYE.cy + pointer.gazeY * RIGHT_EYE.maxShiftY) * pH - rSize / 2;
        fgCtx.drawImage(rightIrisImg, rIx, rIy, rSize, rSize);

        // 3. Place her real original eyelids & lashes right back on top!
        fgCtx.drawImage(
          eyelidsImg,
          EYE_PATCH.x * pW,
          EYE_PATCH.y * pH,
          EYE_PATCH.w * pW,
          EYE_PATCH.h * pH
        );

        fgCtx.restore();
      }

      // 3B. Multi-Gem Jewellery Glitter (12 Real Ruby, Diamond & 22K Gold Facets)
      const cursorInPortraitX = pointer.clientX - pRect.left;
      const cursorInPortraitY = pointer.clientY - pRect.top;

      for (const gem of JEWEL_GLINTS) {
        const gx = gem.x * pW;
        const gy = gem.y * pH;
        const wave = Math.pow((Math.sin(t * gem.speed + gem.phase) + 1) * 0.5, 2.2);
        const proxDist = Math.hypot(cursorInPortraitX - gx, cursorInPortraitY - gy);
        const proxBoost = pointer.active ? Math.max(0, 1 - proxDist / 160) * 0.88 : 0;
        const intensity = Math.min(1.18, 0.24 + wave * 0.64 + proxBoost);

        const radius = pW * 0.042 * gem.size * (0.78 + 0.38 * intensity);
        const spin = 0.24 + Math.sin(t * 0.4 + gem.phase) * 0.16;
        drawStarGlint(fgCtx, gx, gy, radius, spin, intensity, gem.tone);
      }
    };

    const wake = () => {
      if (isVisible && isTabVisible && rafId === 0) {
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
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={stageRef} className="absolute inset-0 overflow-hidden bg-[#1e0308]">
      {/* LAYER 1: Clearly Visible Blended Renaissance Painted Mountains Panorama */}
      <div
        ref={mountainLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[84%] will-change-transform origin-center"
        style={{ transform: 'scale(1.06)' }}
      >
        <img
          src="/images/hero-mountains.jpg"
          alt=""
          width={1920}
          height={732}
          className="w-full h-full object-cover object-[50%_28%] opacity-90"
          style={{ filter: 'brightness(0.84) contrast(1.14) saturate(1.08)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(46,7,14,0.34) 0%, rgba(78,12,24,0.22) 32%, rgba(44,6,13,0.48) 68%, rgba(30,3,8,0.96) 94%, rgba(30,3,8,1) 100%)',
          }}
        />
      </div>

      {/* LAYER 2: Subtle Shimmer Dust & Hover Sparks Behind Her Silhouette (Zero Head Glow!) */}
      <canvas
        ref={bgEffectsCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* LAYER 3: Untouched Native 2K Renaissance Queen + Curvy Gold Body Outline + Deep Grounded Shadows */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:justify-end">
        <div
          ref={portraitWrapRef}
          className="relative w-[min(96vw,580px)] md:w-[min(58vw,740px)] lg:w-[min(54vw,790px)] aspect-[627/628] translate-y-[10%] md:translate-y-[8%] md:mr-[-2%] lg:mr-[1%]"
        >
          {/* Curvy Champagne-Gold Couture Silhouette Outline with Soft Depth Shadow */}
          <img
            ref={outlineLayerRef}
            src="/images/renaissance-curvy-outline.png"
            alt=""
            aria-hidden="true"
            width={1254}
            height={1256}
            className="pointer-events-none absolute inset-0 w-full h-full object-contain will-change-transform select-none"
            style={{
              opacity: 0.72,
              filter: 'drop-shadow(0 16px 26px rgba(12, 1, 4, 0.85))',
            }}
          />

          {/* Untouched Native 2K Cutout with Deep Sculptural Cursor-Reactive Shadows Underneath Her Body */}
          <img
            ref={portraitImgRef}
            src="/images/renaissance-woman-cutout.png"
            alt="Renaissance royal portrait wearing a ruby tiara, layered gold necklaces, pearl bodice brooch, rings, and 22K gold bangles"
            width={1254}
            height={1256}
            fetchPriority="high"
            className="relative z-10 w-full h-full object-contain select-none"
            style={{
              filter:
                'drop-shadow(-14px 20px 24px rgba(10, 1, 4, 0.92)) drop-shadow(0px 38px 54px rgba(8, 0, 2, 0.78))',
            }}
          />

          {/* 1:1 Pixel-Locked Binocular Eye Tracking + Glittering Jewellery Canvas */}
          <canvas
            ref={portraitOverlayCanvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 w-full h-full"
          />
        </div>
      </div>

      {/* Bottom-Left Directional Legibility Scrim ONLY Behind the Text Column */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 68% 72% at 14% 88%, rgba(24,2,6,0.92) 0%, rgba(28,3,8,0.72) 48%, rgba(28,3,8,0) 82%), linear-gradient(180deg, rgba(24,2,6,0.28) 0%, rgba(24,2,6,0) 18%, rgba(24,2,6,0) 76%, rgba(24,2,6,0.88) 100%)',
        }}
      />
    </div>
  );
};
