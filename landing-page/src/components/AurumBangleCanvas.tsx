'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AurumBangleCanvasProps {
  activePieceIndex: number;
  scanPulseCount: number;
  paused: boolean;
}

function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const baseGrad = ctx.createLinearGradient(0, 0, 0, 256);
  baseGrad.addColorStop(0, '#092218');
  baseGrad.addColorStop(0.45, '#05110c');
  baseGrad.addColorStop(0.75, '#132e23');
  baseGrad.addColorStop(1, '#040c08');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 256);

  const strips = [
    { x: 50, y: 24, w: 155, h: 52, c1: 'rgba(255, 246, 224, 0.98)', c2: 'rgba(235, 190, 102, 0.0)' },
    { x: 270, y: 40, w: 180, h: 62, c1: 'rgba(252, 228, 168, 0.94)', c2: 'rgba(205, 155, 72, 0.0)' },
    { x: 150, y: 150, w: 220, h: 60, c1: 'rgba(232, 182, 92, 0.72)', c2: 'rgba(10, 42, 30, 0.0)' },
    { x: 400, y: 108, w: 95, h: 88, c1: 'rgba(84, 218, 158, 0.48)', c2: 'rgba(6, 20, 14, 0.0)' },
  ];

  for (const s of strips) {
    const rg = ctx.createRadialGradient(
      s.x + s.w / 2,
      s.y + s.h / 2,
      5,
      s.x + s.w / 2,
      s.y + s.h / 2,
      Math.max(s.w, s.h) * 0.62
    );
    rg.addColorStop(0, s.c1);
    rg.addColorStop(1, s.c2);
    ctx.fillStyle = rg;
    ctx.fillRect(s.x - 20, s.y - 20, s.w + 40, s.h + 40);
  }

  const eqTex = new THREE.CanvasTexture(canvas);
  eqTex.mapping = THREE.EquirectangularReflectionMapping;
  eqTex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envRT = pmrem.fromEquirectangular(eqTex);
  eqTex.dispose();
  pmrem.dispose();
  return envRT.texture;
}

function createBrushedGoldBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y += 2) {
    const shade = 122 + Math.floor(Math.sin(y * 0.5) * 8 + (Math.random() - 0.5) * 8);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 256, 1.5);
  }
  ctx.strokeStyle = 'rgba(220,220,220,0.45)';
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 256; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 90);
    ctx.lineTo(x + 12, 128);
    ctx.lineTo(x, 166);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  return tex;
}

function createOrbitTextRing(
  text: string,
  radius: number,
  height: number,
  color: string,
  opacity: number
): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.font = '500 32px "Azeret Mono", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${text}   •   ${text}   •   ${text}   •   `, 16, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;

  const geo = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity,
    side: THREE.FrontSide,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 3;
  return mesh;
}

export const AurumBangleCanvas: React.FC<AurumBangleCanvasProps> = ({
  activePieceIndex,
  scanPulseCount,
  paused,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(true);
  const stateRef = useRef({
    activePieceIndex,
    paused,
    scanProgress: 1.5,
  });

  useEffect(() => {
    stateRef.current.activePieceIndex = activePieceIndex;
  }, [activePieceIndex]);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

  useEffect(() => {
    if (scanPulseCount > 0) {
      stateRef.current.scanProgress = -1.25;
    }
  }, [scanPulseCount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'default',
      });
    } catch {
      setWebglReady(false);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 420;
    // Cap DPR to 1.5 to slash GPU pixel-fill cost by ~45% on Retina screens while staying razor-sharp
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.44;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 60);
    camera.position.set(0, 0.12, 6.0);

    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;

    // Efficient 3-light studio rig
    scene.add(new THREE.AmbientLight('#ffecc4', 0.65));

    const keyLight = new THREE.DirectionalLight('#fff6e0', 3.1);
    keyLight.position.set(4.5, 5.5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#5de8aa', 2.8, 18);
    rimLight.position.set(-4.2, -2.0, 3.6);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Sculpted 22K Solid Gold Bridal Bangle (64 segments = silky smooth, low vertex cost)
    const bumpTex = createBrushedGoldBumpTexture();
    const bangleProfile: THREE.Vector2[] = [
      new THREE.Vector2(1.42, -0.34),
      new THREE.Vector2(1.58, -0.36),
      new THREE.Vector2(1.74, -0.26),
      new THREE.Vector2(1.82, -0.10),
      new THREE.Vector2(1.82, 0.10),
      new THREE.Vector2(1.74, 0.26),
      new THREE.Vector2(1.58, 0.36),
      new THREE.Vector2(1.42, 0.34),
      new THREE.Vector2(1.37, 0.20),
      new THREE.Vector2(1.37, -0.20),
      new THREE.Vector2(1.42, -0.34),
    ];

    const bangleGeo = new THREE.LatheGeometry(bangleProfile, 64);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f2cb74'),
      metalness: 0.94,
      roughness: 0.13,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      bumpMap: bumpTex,
      bumpScale: 0.01,
      envMapIntensity: 2.0,
    });
    const bangleMesh = new THREE.Mesh(bangleGeo, goldMat);
    bangleMesh.rotation.set(0.46, 0.25, -0.32);
    rootGroup.add(bangleMesh);

    // 2. Faceted Ceylon Emerald Crystal Core (Single-pass iridescence — ZERO costly transmission re-render!)
    const coreGeo = new THREE.OctahedronGeometry(0.48, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#198258'),
      emissive: new THREE.Color('#0c4c33'),
      emissiveIntensity: 0.72,
      metalness: 0.38,
      roughness: 0.06,
      iridescence: 0.9,
      iridescenceIOR: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    const cageGeo = new THREE.IcosahedronGeometry(0.76, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: '#f1cb85',
      wireframe: true,
      transparent: true,
      opacity: 0.26,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(cageMesh);

    // 3. Real 3D Counter-Rotating Assay Text Rings
    const ringTop = createOrbitTextRing(
      'AUR · 0842 · 6190   916 PURE GOLD   4.20G NET   RLS ISOLATED',
      2.28,
      0.32,
      'rgba(246, 212, 142, 0.92)',
      0.88
    );
    ringTop.rotation.set(0.24, 0, -0.18);
    rootGroup.add(ringTop);

    const ringBottom = createOrbitTextRing(
      'ZERO HOME ADDRESSES   AES-256 INVOICE SEALED   SRI LANKA PDPA',
      2.52,
      0.26,
      'rgba(108, 224, 168, 0.68)',
      0.66
    );
    ringBottom.rotation.set(-0.28, 1.2, 0.16);
    rootGroup.add(ringBottom);

    // 4. Sweeping Emerald-Gold Laser Verification Ring
    const laserGeo = new THREE.TorusGeometry(2.04, 0.02, 12, 64);
    const laserMat = new THREE.MeshBasicMaterial({
      color: '#6ce8ad',
      transparent: true,
      opacity: 0,
    });
    const laserRing = new THREE.Mesh(laserGeo, laserMat);
    laserRing.rotation.x = Math.PI / 2;
    rootGroup.add(laserRing);

    // 5. Lightweight 22K Gold Dust Motes (80 particles)
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.1 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#f5d28c',
      size: 0.04,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Momentum-Damped 360° Turntable Physics
    const pointer = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      velYaw: 0,
      velPitch: 0,
      dragYaw: 0,
      dragPitch: 0,
    };

    const onPointerDown = (e: PointerEvent) => {
      pointer.dragging = true;
      pointer.lastX = e.clientX;
      pointer.lastY = e.clientY;
    };
    const onPointerUp = () => {
      pointer.dragging = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (pointer.dragging) {
        const dx = (e.clientX - pointer.lastX) * 0.0085;
        const dy = (e.clientY - pointer.lastY) * 0.0065;
        pointer.dragYaw += dx;
        pointer.dragPitch = Math.max(-0.65, Math.min(0.65, pointer.dragPitch + dy));
        pointer.velYaw = dx;
        pointer.velPitch = dy;
        pointer.lastX = e.clientX;
        pointer.lastY = e.clientY;
      }
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      pointer.targetX = Math.max(-1, Math.min(1, nx));
      pointer.targetY = Math.max(-1, Math.min(1, ny));
    };
    const onPointerLeave = () => {
      pointer.dragging = false;
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // AUTOMATIC SLEEP WHEN OFF-SCREEN OR TAB HIDDEN (0% CPU/GPU WHEN SCROLLED PAST HERO!)
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let rafId = 0;
    const clock = new THREE.Clock();

    const pieceAngles = [
      { rx: 0.46, rz: -0.32, hueColor: '#f2cb74' },
      { rx: 0.72, rz: 0.18, hueColor: '#fbe09e' },
      { rx: 0.34, rz: -0.58, hueColor: '#e7b860' },
    ];

    const renderFrame = () => {
      if (!isVisible || !isTabVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(renderFrame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.07;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.07;

      if (!pointer.dragging) {
        pointer.dragYaw += pointer.velYaw;
        pointer.dragPitch = Math.max(-0.65, Math.min(0.65, pointer.dragPitch + pointer.velPitch));
        pointer.velYaw *= 0.93;
        pointer.velPitch *= 0.93;
      }

      const scrollFactor = Math.min(window.scrollY / 900, 1.4);
      const targetPreset = pieceAngles[stateRef.current.activePieceIndex % pieceAngles.length];
      goldMat.color.lerp(new THREE.Color(targetPreset.hueColor), 0.05);

      if (!stateRef.current.paused) {
        bangleMesh.rotation.y += dt * 0.38;
        bangleMesh.rotation.x +=
          (targetPreset.rx + pointer.currentY * 0.24 + scrollFactor * 0.4 - bangleMesh.rotation.x) *
          0.05;
        bangleMesh.rotation.z +=
          (targetPreset.rz - pointer.currentX * 0.22 - bangleMesh.rotation.z) * 0.05;

        coreMesh.rotation.y -= dt * 0.65;
        coreMesh.rotation.x = Math.sin(elapsed * 0.85) * 0.35;
        coreMesh.position.y = Math.sin(elapsed * 1.4) * 0.08;

        cageMesh.rotation.y += dt * 0.22;
        cageMesh.rotation.z -= dt * 0.14;

        ringTop.rotation.y -= dt * 0.2;
        ringBottom.rotation.y += dt * 0.15;

        particles.rotation.y += dt * 0.045;
        particles.rotation.x = pointer.currentY * 0.06;

        if (stateRef.current.scanProgress < 1.3) {
          stateRef.current.scanProgress += dt * 1.85;
          const p = stateRef.current.scanProgress;
          laserRing.position.y = p;
          laserMat.opacity = Math.max(0, 1 - Math.abs(p) / 1.25) * 0.95;
        } else {
          laserMat.opacity = 0;
        }
      }

      rootGroup.rotation.y = pointer.currentX * 0.24 + pointer.dragYaw;
      rootGroup.rotation.x = pointer.currentY * 0.15 + pointer.dragPitch;

      renderer.render(scene, camera);
    };

    const wakeLoop = () => {
      if (isVisible && isTabVisible && rafId === 0) {
        clock.getDelta();
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) wakeLoop();
      },
      { rootMargin: '120px' }
    );
    observer.observe(container);

    const onVisChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) wakeLoop();
    };
    document.addEventListener('visibilitychange', onVisChange);

    // Draw initial frame immediately and start loop
    renderer.render(scene, camera);
    wakeLoop();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);

      bangleGeo.dispose();
      goldMat.dispose();
      bumpTex.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ringTop.geometry.dispose();
      (ringTop.material as THREE.MeshBasicMaterial).map?.dispose();
      (ringTop.material as THREE.MeshBasicMaterial).dispose();
      ringBottom.geometry.dispose();
      (ringBottom.material as THREE.MeshBasicMaterial).map?.dispose();
      (ringBottom.material as THREE.MeshBasicMaterial).dispose();
      laserGeo.dispose();
      laserMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglReady) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-full flex items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_45%,oklch(34%_0.06_83/0.45),oklch(14.5%_0.022_166))]"
      >
        <div className="w-44 h-44 rounded-full border-4 border-[var(--gold-400)] shadow-[0_0_60px_oklch(78.5%_0.116_82/0.38)]" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label="Interactive 3D 22K gold Sri Lankan bridal bangle with a faceted Ceylon emerald core and orbiting hallmark rings"
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
};
