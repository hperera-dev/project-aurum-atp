'use client';

import React, { useEffect, useRef } from 'react';
import { Check, Eye } from '@phosphor-icons/react';
import { HERO_VAULT_ITEMS, VaultItem } from '../../content/aurumContent';
import { gsap } from '../../lib/gsapSetup';
import { Glass } from '../glass/Glass';
import { AssayDecodeText } from '../motion/AssayDecodeText';
import { GoldSweepText } from '../motion/GoldSweepText';
import { MagneticCTA } from '../motion/Magnetic';
import { OpticalPortalLens, PortalState } from '../motion/OpticalPortalLens';

interface HeroEditorialStageProps {
  heroReady: boolean;
  onOpenPassport: (item: VaultItem) => void;
  onOpenPilot: () => void;
}

const JEWEL_GLINTS = [
  { x: 0.322, y: 0.44, size: 0.95, ruby: true, phase: 0.4, speed: 1.55 },
  { x: 0.355, y: 0.682, size: 0.78, ruby: false, phase: 1.8, speed: 1.75 },
  { x: 0.512, y: 0.764, size: 1.25, ruby: true, phase: 0.0, speed: 1.35 },
  { x: 0.495, y: 0.728, size: 0.85, ruby: false, phase: 2.6, speed: 1.9 },
  { x: 0.648, y: 0.668, size: 0.82, ruby: false, phase: 4.1, speed: 1.65 },
] as const;

const IMG_RATIO = 1200 / 1607;
const TRUST_ITEMS = ['PostgreSQL RLS isolated', 'AES-256 VAT invoices', 'Free Colombo pilot'];

const PORTAL_TELEMETRY_LEFT = [
  'vault_schema:',
  '  engine: postgresql_16',
  '  rls_isolation: strict_tenant',
  '  address_columns: 0',
  '  gps_tracking: disabled',
  '',
  'passport_record:',
  '  id: AUR-0842-6190',
  '  purity: 18K_750 / 22K_916',
  '  gross_mass: 4.800g',
  '  net_gold: 4.200g',
];

const PORTAL_TELEMETRY_RIGHT = [
  'handover_protocol:',
  '  latency: < 8000ms',
  '  modes: [pin_4d, sim_gift, batch, sms]',
  '  invoice_cipher: aes_256_gcm',
  '',
  'rival_query_probe:',
  '  status: HTTP_403_FORBIDDEN',
  '  bytes_leaked: 0',
  '  lineage_dag: immutable',
];

export const HeroEditorialStage: React.FC<HeroEditorialStageProps> = ({
  heroReady,
  onOpenPassport,
  onOpenPilot,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const copyColRef = useRef<HTMLDivElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const glintCanvasRef = useRef<HTMLCanvasElement>(null);
  const portalRevealRef = useRef<HTMLDivElement>(null);
  const lensLayerRef = useRef<HTMLDivElement>(null);
  const portalStateRef = useRef<PortalState>({
    progress: 0,
    portalRadius: 0,
    cx: 480,
    cy: 450,
  });

  // 1. Mount-once Desktop Scrubbed Optical Portal Dive (ArchiLens-style clip-path circle reveal!)
  useEffect(() => {
    const section = sectionRef.current;
    const portalEl = portalRevealRef.current;
    const lensLayer = lensLayerRef.current;
    if (!section || !portalEl || !lensLayer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=115%',
            pin: true,
            scrub: 0.75,
            onUpdate: (self) => {
              const p = self.progress;
              portalStateRef.current.progress = p;

              // Elevate optical lens above hero text once portal starts opening
              lensLayer.style.zIndex = p > 0.02 ? '30' : '4';

              const w = section.clientWidth || window.innerWidth || 1440;
              const h = section.clientHeight || window.innerHeight || 900;
              const maxDiag = Math.hypot(w, h) * 0.72;
              const restCx = w * 0.28;
              const moveBlend = Math.min(1, p * 2.6);
              const easeMove = 1 - Math.pow(1 - moveBlend, 3);
              const cx = restCx + (w * 0.5 - restCx) * easeMove;
              const cy = h * 0.52 + (h * 0.5 - h * 0.52) * easeMove;

              const portalP = Math.max(0, (p - 0.03) / 0.97);
              const r = Math.pow(portalP, 1.45) * (maxDiag * 1.12);

              portalEl.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
              portalEl.style.visibility = r > 1 ? 'visible' : 'hidden';
            },
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // 2. Kinetic Headline & CTA Entrance Synced With Preloader Reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !heroReady) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-rise-line',
        { yPercent: 105, opacity: 0, filter: 'blur(10px)' },
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.92,
          stagger: 0.08,
          ease: 'expo.out',
          clearProps: 'filter',
        }
      );
      gsap.fromTo(
        '.hero-cta-group',
        { scale: 0.94, opacity: 0, filter: 'blur(6px)' },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.75,
          delay: 0.24,
          ease: 'expo.out',
          clearProps: 'filter,transform',
        }
      );
    }, section);

    return () => ctx.revert();
  }, [heroReady]);

  // 3. Subtle Starlight Glints Locked on Her Real 22K Gold & Ruby Necklace
  useEffect(() => {
    const section = sectionRef.current;
    const portraitWrap = portraitWrapRef.current;
    const canvas = glintCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!section || !portraitWrap || !canvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    window.addEventListener('resize', resize);

    let isVisible = true;
    let rafId = 0;
    let t = 0;
    let last = performance.now();

    const draw = (now: number) => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      ctx.clearRect(0, 0, pW, pH);
      const wide = pW / (pH || 1) > IMG_RATIO;
      const rW = wide ? pW : pH * IMG_RATIO;
      const rH = wide ? pW / IMG_RATIO : pH;
      const oX = wide ? 0 : (pW - rW) * 0.5;
      const oY = wide ? (pH - rH) * 0.18 : 0;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const gem of JEWEL_GLINTS) {
        const gx = oX + gem.x * rW;
        const gy = oY + gem.y * rH;
        const intensity =
          0.16 + Math.pow((Math.sin(t * gem.speed + gem.phase) + 1) * 0.5, 2.4) * 0.54;
        if (intensity <= 0.06) continue;

        const rad = rW * 0.032 * gem.size * (0.8 + 0.32 * intensity);
        const spin = 0.25 + Math.sin(t * 0.35 + gem.phase) * 0.14;
        const bloom = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad * 1.1);
        bloom.addColorStop(0, `rgba(255,248,234,${(0.88 * intensity).toFixed(3)})`);
        bloom.addColorStop(
          0.34,
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
          [spin, rad, 0.95, 0.84 * intensity],
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

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          last = performance.now();
          rafId = requestAnimationFrame(draw);
        }
      },
      { rootMargin: '80px' }
    );
    io.observe(section);
    rafId = requestAnimationFrame(draw);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="surface-ruby relative min-h-[100svh] flex flex-col justify-end pt-[22rem] sm:pt-[25rem] md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 68% 72% at 72% 38%, #470a0f 0%, #2b0608 48%, #120203 100%)',
      }}
    >
      {/* LAYER 1: Posh Crimson Portrait — 100% Clean & Unobstructed */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[56svh] min-h-[360px] max-h-[500px] md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-[min(58vw,780px)] lg:w-[min(54vw,820px)] overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_98%)] md:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.58)_14%,black_30%,black_100%)]">
        <div ref={portraitWrapRef} className="relative w-full h-full will-change-transform">
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

      {/* LAYER 2: Legibility Scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] md:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(18,2,3,0.28) 0%, rgba(18,2,3,0) 14%, rgba(18,2,3,0) 34%, rgba(18,2,3,0.74) 48%, rgba(18,2,3,0.96) 58%, rgba(18,2,3,1) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute inset-0 z-[3]"
        style={{
          background:
            'radial-gradient(ellipse 68% 82% at 18% 64%, rgba(18,2,3,0.92) 0%, rgba(34,5,7,0.68) 46%, rgba(34,5,7,0) 80%), linear-gradient(180deg, rgba(18,2,3,0.34) 0%, rgba(18,2,3,0) 18%, rgba(18,2,3,0) 76%, rgba(18,2,3,0.92) 100%)',
        }}
      />

      {/* LAYER 3: Concentric Multi-Ring 22K Optical Bezel (Behind Copy at Rest -> Elevates Around Portal on Scroll) */}
      <div
        ref={lensLayerRef}
        style={{ zIndex: 4 }}
        className="pointer-events-none hidden lg:block absolute inset-0"
      >
        <OpticalPortalLens portalStateRef={portalStateRef} />
      </div>

      {/* LAYER 4: Hero Editorial Typography & CTAs */}
      <div ref={copyColRef} className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="lg:col-span-7 space-y-5 md:space-y-6">
            <Glass
              variant="pill"
              interactive={false}
              className="inline-flex items-center gap-2 px-4 py-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
                aria-hidden="true"
              />
              <AssayDecodeText
                text="DIGITAL JEWELLERY PASSPORT · SRI LANKA"
                play={heroReady}
                className="font-data text-xs text-[var(--gold-bright)] tracking-[0.06em]"
              />
            </Glass>

            <h1
              id="hero-title"
              className="heading-hero text-[var(--ink-dark-1)] max-w-[15.5ch] [text-shadow:0_2px_22px_rgba(18,2,3,0.85)]"
            >
              <span className="block overflow-hidden pb-1">
                <span className="hero-rise-line inline-block">
                  Never lose a <GoldSweepText>gram of proof</GoldSweepText>—
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-rise-line inline-block">
                  from the showroom counter to the next generation.
                </span>
              </span>
            </h1>

            <p className="hero-rise-line text-sm sm:text-base md:text-lg font-medium text-[var(--ink-dark-2)] max-w-[44ch] leading-relaxed">
              Sri Lanka’s private digital gold vault. Exact 22K &amp; 18K net gold weight sealed in
              8 seconds at checkout—zero faded receipts, zero home addresses, zero rival visibility.
            </p>

            <div className="hero-cta-group flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <MagneticCTA
                onClick={onOpenPilot}
                variant="gold"
                cursorLabel="Join"
                className="w-full sm:w-auto"
              >
                Join the Free Colombo Pilot
              </MagneticCTA>

              <button
                type="button"
                data-cursor="Inspect"
                onClick={() => onOpenPassport(HERO_VAULT_ITEMS[0])}
                className="btn-ghost-dark w-full sm:w-auto"
              >
                <Eye size={18} className="text-[var(--gold-bright)]" />
                <span>Inspect Live Passport</span>
              </button>
            </div>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-[var(--ink-dark-2)]">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check
                    size={14}
                    weight="bold"
                    className="text-[var(--gold-bright)] shrink-0"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0">
            <div className="text-left lg:text-right space-y-0.5">
              <p className="font-data text-xs text-[var(--gold-bright)]">AUR · 0842 · 6190</p>
              <p className="text-xs font-medium text-[var(--ink-dark-2)]">
                0 home addresses · PostgreSQL RLS isolated
              </p>
            </div>

            <a
              href="#problem"
              aria-label="Scroll to dive through the optical assay lens"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-3.5 py-2 bg-[#2b0608]/80 border border-[rgba(247,223,163,0.3)] font-data text-xs text-[var(--gold-bright)] hover:border-[var(--gold-bright)] transition-colors"
            >
              <span>Scroll</span>
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)]"
              />
            </a>
          </div>
        </div>
      </div>

      {/* LAYER 5 (z-20): ArchiLens-Style Expanding Circular Portal Window Revealing the Next World Inside the Lens! */}
      <div
        ref={portalRevealRef}
        aria-hidden="true"
        style={{ clipPath: 'circle(0px at 28% 52%)', visibility: 'hidden' }}
        className="pointer-events-none hidden lg:flex absolute inset-0 z-20 bg-[#100102] assay-grid-dark items-center justify-center px-10 overflow-hidden"
      >
        {/* Subtle Background Schema Telemetry Columns (Like ArchiLens's YAML Backdrop) */}
        <pre className="absolute left-10 top-24 font-data text-xs leading-6 text-[rgba(247,223,163,0.16)] select-none">
          {PORTAL_TELEMETRY_LEFT.join('\n')}
        </pre>
        <pre className="absolute right-10 bottom-20 font-data text-xs leading-6 text-[rgba(247,223,163,0.16)] select-none text-right">
          {PORTAL_TELEMETRY_RIGHT.join('\n')}
        </pre>

        <div className="relative z-10 max-w-4xl text-center space-y-5">
          <p className="font-data text-xs text-[var(--gold-bright)] uppercase tracking-[0.16em]">
            INSIDE THE VAULT · ZERO PUBLIC LEAKAGE
          </p>
          <p className="heading-manifesto text-[var(--ink-dark-1)]">
            One private vault across <span className="italic gold-foil-sweep">every trusted showroom</span>—built so rival jewellers and strangers see <span className="text-[var(--gold-bright)]">zero bytes</span>.
          </p>
        </div>
      </div>
    </section>
  );
};
