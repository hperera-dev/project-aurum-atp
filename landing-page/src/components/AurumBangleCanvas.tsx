'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AurumBangleCanvasProps {
  activePieceIndex: number;
  paused: boolean;
}

function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const baseGrad = ctx.createLinearGradient(0, 0, 0, 256);
  baseGrad.addColorStop(0, '#0a2319');
  baseGrad.addColorStop(0.45, '#05120d');
  baseGrad.addColorStop(0.75, '#153126');
  baseGrad.addColorStop(1, '#040c09');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, 512, 256);

  const strips = [
    { x: 46, y: 20, w: 165, h: 56, c1: 'rgba(255, 248, 232, 0.98)', c2: 'rgba(235, 190, 102, 0)' },
    { x: 268, y: 36, w: 185, h: 64, c1: 'rgba(255, 234, 180, 0.94)', c2: 'rgba(205, 155, 72, 0)' },
    { x: 145, y: 150, w: 230, h: 60, c1: 'rgba(232, 182, 92, 0.68)', c2: 'rgba(10, 42, 30, 0)' },
    { x: 405, y: 112, w: 92, h: 84, c1: 'rgba(84, 214, 156, 0.42)', c2: 'rgba(6, 20, 14, 0)' },
  ];

  for (const s of strips) {
    const rg = ctx.createRadialGradient(
      s.x + s.w / 2,
      s.y + s.h / 2,
      6,
      s.x + s.w / 2,
      s.y + s.h / 2,
      Math.max(s.w, s.h) * 0.64
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
    const shade = 123 + Math.floor(Math.sin(y * 0.5) * 7 + (Math.random() - 0.5) * 6);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 256, 1.5);
  }
  ctx.strokeStyle = 'rgba(218,218,218,0.38)';
  ctx.lineWidth = 1.4;
  for (let x = 0; x < 256; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 96);
    ctx.lineTo(x + 12, 128);
    ctx.lineTo(x, 160);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 1);
  return tex;
}

export const AurumBangleCanvas: React.FC<AurumBangleCanvasProps> = ({
  activePieceIndex,
  paused,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(true);
  const stateRef = useRef({ activePieceIndex, paused });

  useEffect(() => {
    stateRef.current.activePieceIndex = activePieceIndex;
  }, [activePieceIndex]);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);

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

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 440;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 0.08, 5.7);

    const envMap = createStudioEnvMap(renderer);
    scene.environment = envMap;

    // Clean 3-light jewelry studio rig
    scene.add(new THREE.AmbientLight('#fff0d2', 0.62));

    const keyLight = new THREE.DirectionalLight('#fff8ea', 3.0);
    keyLight.position.set(4.5, 5.5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#55d99e', 2.4, 16);
    rimLight.position.set(-4.0, -2.0, 3.8);
    scene.add(rimLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Sculpted 22K Solid Gold Sri Lankan Bridal Bangle
    const bumpTex = createBrushedGoldBumpTexture();
    const bangleProfile: THREE.Vector2[] = [
      new THREE.Vector2(1.44, -0.35),
      new THREE.Vector2(1.60, -0.37),
      new THREE.Vector2(1.76, -0.27),
      new THREE.Vector2(1.84, -0.10),
      new THREE.Vector2(1.84, 0.10),
      new THREE.Vector2(1.76, 0.27),
      new THREE.Vector2(1.60, 0.37),
      new THREE.Vector2(1.44, 0.35),
      new THREE.Vector2(1.39, 0.20),
      new THREE.Vector2(1.39, -0.20),
      new THREE.Vector2(1.44, -0.35),
    ];

    const bangleGeo = new THREE.LatheGeometry(bangleProfile, 64);
    const goldMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f0c872'),
      metalness: 0.95,
      roughness: 0.13,
      clearcoat: 0.88,
      clearcoatRoughness: 0.09,
      bumpMap: bumpTex,
      bumpScale: 0.009,
      envMapIntensity: 2.05,
    });
    const bangleMesh = new THREE.Mesh(bangleGeo, goldMat);
    bangleMesh.rotation.set(0.44, 0.25, -0.3);
    rootGroup.add(bangleMesh);

    // 2. Faceted Ceylon Emerald Core (Single-pass iridescent crystal — zero GPU transmission pass)
    const coreGeo = new THREE.OctahedronGeometry(0.46, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#187b53'),
      emissive: new THREE.Color('#0a422b'),
      emissiveIntensity: 0.65,
      metalness: 0.36,
      roughness: 0.06,
      iridescence: 0.85,
      iridescenceIOR: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // 3. Single Hairline Architectural Halo Ring (Clean horology detail, zero sci-fi HUD clutter)
    const haloGeo = new THREE.TorusGeometry(2.16, 0.008, 12, 96);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#e5be72',
      transparent: true,
      opacity: 0.34,
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.set(1.22, 0.2, -0.32);
    rootGroup.add(haloRing);

    // 4. Subtle Studio Gold Dust (44 particles)
    const particleCount = 44;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 2.25 + Math.random() * 2.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#f2ce85',
      size: 0.032,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Smooth Drag-to-Orbit Physics
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
        const dx = (e.clientX - pointer.lastX) * 0.008;
        const dy = (e.clientY - pointer.lastY) * 0.006;
        pointer.dragYaw += dx;
        pointer.dragPitch = Math.max(-0.6, Math.min(0.6, pointer.dragPitch + dy));
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
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Automatic Off-Screen & Hidden-Tab Sleep (0% CPU once scrolled past Hero)
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let rafId = 0;
    const clock = new THREE.Clock();

    const pieceAngles = [
      { rx: 0.44, rz: -0.3, hueColor: '#f0c872' },
      { rx: 0.68, rz: 0.16, hueColor: '#f7db98' },
      { rx: 0.34, rz: -0.52, hueColor: '#e4b55c' },
    ];

    const renderFrame = () => {
      if (!isVisible || !isTabVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(renderFrame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.06;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.06;

      if (!pointer.dragging) {
        pointer.dragYaw += pointer.velYaw;
        pointer.dragPitch = Math.max(-0.6, Math.min(0.6, pointer.dragPitch + pointer.velPitch));
        pointer.velYaw *= 0.93;
        pointer.velPitch *= 0.93;
      }

      const targetPreset = pieceAngles[stateRef.current.activePieceIndex % pieceAngles.length];
      goldMat.color.lerp(new THREE.Color(targetPreset.hueColor), 0.045);

      if (!stateRef.current.paused) {
        bangleMesh.rotation.y += dt * 0.28;
        bangleMesh.rotation.x += (targetPreset.rx + pointer.currentY * 0.2 - bangleMesh.rotation.x) * 0.045;
        bangleMesh.rotation.z += (targetPreset.rz - pointer.currentX * 0.18 - bangleMesh.rotation.z) * 0.045;

        coreMesh.rotation.y -= dt * 0.48;
        coreMesh.rotation.x = Math.sin(elapsed * 0.7) * 0.28;
        coreMesh.position.y = Math.sin(elapsed * 1.1) * 0.06;

        haloRing.rotation.z += dt * 0.12;
        particles.rotation.y += dt * 0.03;
      }

      rootGroup.rotation.y = pointer.currentX * 0.2 + pointer.dragYaw;
      rootGroup.rotation.x = pointer.currentY * 0.12 + pointer.dragPitch;

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
      { rootMargin: '100px' }
    );
    observer.observe(container);

    const onVisChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) wakeLoop();
    };
    document.addEventListener('visibilitychange', onVisChange);

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
      haloGeo.dispose();
      haloMat.dispose();
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
        className="w-full h-full flex items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_45%,oklch(34%_0.06_83/0.4),oklch(15.2%_0.024_166))]"
      >
        <div className="w-44 h-44 rounded-full border-4 border-[var(--gold-bullion)]" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
};
