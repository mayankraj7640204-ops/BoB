import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import bobDataRaw from '../data/bobLabsData.json';
import { BobLabsData, BobLabModule } from '../types';

interface Rotunda3DWalkthroughProps {
  onSelectModule: (module: BobLabModule) => void;
  onLaunchModule: (slug: string) => void;
  isDarkMode: boolean;
}

const bobData = bobDataRaw as unknown as BobLabsData;

// Math constants
const G_SLOT = 2.5 / 12; // = 0.208333 rad per slot
const R_OUTER_WALL = 12.0;
const R_INNER_WALL = 7.4;
const R_WALK = 9.7;
const W_INNER_MAX = (2.5 / 12) * 14.8 - 0.7;
const LABEL_RATIO = (0.5 * 256) / 512; // 0.25

const PALETTE_LIGHT = {
  bg: '#f8fafc',
  floor: '#e2e8f0',
  outer: '#ffffff',
  inner: '#ffffff',
  lamp: 0.35,
  pool: 0.12,
};

const PALETTE_DARK = {
  bg: '#080c14',
  floor: '#131b2c',
  outer: '#0f172a',
  inner: '#0f172a',
  lamp: 0.45,
  pool: 0.18,
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function clampRatio(ratio?: number): number {
  return Math.min(1.78, Math.max(0.65, ratio || 1.777));
}

// Collection / Section intro plaque texture
function createLabPlaqueTexture(
  title: string,
  category: string,
  isDark: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#161e2e' : '#e2e8f0';
    ctx.fillRect(0, 0, 512, 640);

    // Tech border
    ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 472, 600);

    // Chip icon
    ctx.fillStyle = isDark ? '#60a5fa' : '#2563eb';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('[ BOB LABS IoT ]', 50, 80);

    // Category
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#475569';
    ctx.fillText(category.toUpperCase(), 50, 130);

    // Title
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    ctx.font = 'bold 44px system-ui, sans-serif';
    ctx.textBaseline = 'top';

    const words = title.split(' ');
    let line = '';
    let y = 180;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > 400 && line) {
        ctx.fillText(line, 50, y);
        y += 56;
        line = w;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, 50, y);

    // Specs
    ctx.font = '400 20px monospace';
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.fillText('MQTT: 127.0.0.1:1883', 50, 480);
    ctx.fillText('PROTO: WebSocket / TCP', 50, 515);
    ctx.fillText('STATUS: Live Telemetry', 50, 550);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Artwork / Module label plaque texture
function createModuleLabelTexture(
  title: string,
  category: string,
  isDark: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 504, 248);

    ctx.textBaseline = 'top';

    // Subtitle
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#38bdf8' : '#0284c7';
    ctx.fillText('BOB LABS • VIRTUAL TESTING LAB', 28, 28);

    // Title
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
    const displayTitle = title.length > 26 ? title.slice(0, 24) + '...' : title;
    ctx.fillText(displayTitle, 28, 70);

    // Category / specs
    ctx.font = '500 20px monospace';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.fillText(category.toUpperCase(), 28, 126);

    ctx.font = '400 18px monospace';
    ctx.fillStyle = isDark ? '#4ade80' : '#16a34a';
    ctx.fillText('● BROKER STREAM: 127.0.0.1:1883', 28, 200);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Soft radial spotlight texture
let cachedLampTexture: THREE.CanvasTexture | null = null;
function getLampTexture(): THREE.CanvasTexture {
  if (cachedLampTexture) return cachedLampTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  cachedLampTexture = new THREE.CanvasTexture(canvas);
  return cachedLampTexture;
}

let cachedWhiteTexture: THREE.CanvasTexture | null = null;
function getWhiteTexture(): THREE.CanvasTexture {
  if (cachedWhiteTexture) return cachedWhiteTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 2, 2);
  }
  cachedWhiteTexture = new THREE.CanvasTexture(canvas);
  return cachedWhiteTexture;
}

interface PlaceSlot {
  type: 'plaque' | 'module';
  title: string;
  category: string;
  slug: string;
  module?: BobLabModule;
  innerModule?: BobLabModule;
}

export const Rotunda3DWalkthrough: React.FC<Rotunda3DWalkthroughProps> = ({
  onSelectModule,
  onLaunchModule,
  isDarkMode,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const kickerTextRef = useRef<HTMLParagraphElement>(null);
  const hintTextRef = useRef<HTMLDivElement>(null);

  // Build places around rotunda with completely distinct exhibits on left and right walls
  const places: PlaceSlot[] = useMemo(() => {
    const list: PlaceSlot[] = [];
    const findM = (id: string) => bobData.modules.find((m) => m.id === id) || bobData.modules[0];

    // =========================================================================
    // SECTION 1: Virtual Simulator & Core Telemetry
    // =========================================================================
    // Slot 0: Plaque on outer wall vs BOB Builder Bot on inner wall
    list.push({
      type: 'plaque',
      title: 'VIRTUAL TESTING LAB (BOB LABS)',
      category: 'System Architecture',
      slug: 'simulation',
      innerModule: findM('bob-mascot'),
    });

    // Slot 1: Simulation Settings on outer wall vs Arduino Microcontroller on inner wall
    list.push({
      type: 'module',
      title: findM('simulation-control').title,
      category: findM('simulation-control').category,
      slug: 'simulation-control',
      module: findM('simulation-control'),
      innerModule: findM('arduino-controller'),
    });

    // Slot 2: Device Monitoring on outer wall vs Temp & Humidity Sensor on inner wall
    list.push({
      type: 'module',
      title: findM('device-monitoring').title,
      category: findM('device-monitoring').category,
      slug: 'device-monitoring',
      module: findM('device-monitoring'),
      innerModule: findM('temp-humidity-sensor'),
    });

    // Slot 3: Live Telemetry Trend Wave on outer wall vs Mission Analytics Console on inner wall
    list.push({
      type: 'module',
      title: findM('live-telemetry').title,
      category: findM('live-telemetry').category,
      slug: 'live-telemetry',
      module: findM('live-telemetry'),
      innerModule: findM('analytics-console'),
    });

    // Slot 4: Failure Testing on outer wall vs AI CCTV Camera on inner wall
    list.push({
      type: 'module',
      title: findM('failure-testing').title,
      category: findM('failure-testing').category,
      slug: 'failure-testing',
      module: findM('failure-testing'),
      innerModule: findM('smart-cctv-camera'),
    });

    // Slot 5: External App Integration on outer wall vs Team AURA 999+ Banner on inner wall
    list.push({
      type: 'module',
      title: findM('external-integration').title,
      category: findM('external-integration').category,
      slug: 'external-integration',
      module: findM('external-integration'),
      innerModule: findM('bits2wave-aura999'),
    });

    // =========================================================================
    // SECTION 2: Smart Infrastructure & Mobility
    // =========================================================================
    // Slot 6: Plaque on outer wall vs BOB Chaos Hacker Bot on inner wall
    list.push({
      type: 'plaque',
      title: 'SMART INFRASTRUCTURE & MOBILITY',
      category: 'Urban IoT Suite',
      slug: 'smart-city',
      innerModule: findM('fire-hacker-mascot'),
    });

    // Slot 7: Smart City Traffic on outer wall vs Device Fleet Health on inner wall
    list.push({
      type: 'module',
      title: findM('smart-city-traffic').title,
      category: findM('smart-city-traffic').category,
      slug: 'smart-city-traffic',
      module: findM('smart-city-traffic'),
      innerModule: findM('device-fleet-alt'),
    });

    // Slot 8: Smart Agriculture on outer wall vs Microcontroller Edge Board on inner wall
    list.push({
      type: 'module',
      title: findM('smart-agriculture-node').title,
      category: findM('smart-agriculture-node').category,
      slug: 'smart-agriculture-node',
      module: findM('smart-agriculture-node'),
      innerModule: findM('arduino-controller'),
    });

    // Slot 9: Smart Building Console on outer wall vs Hardware Lab Arena on inner wall
    list.push({
      type: 'module',
      title: findM('smart-building-console').title,
      category: findM('smart-building-console').category,
      slug: 'smart-building-console',
      module: findM('smart-building-console'),
      innerModule: findM('bits2wave-lab-entrance'),
    });

    // Slot 10: Asset Tracking on outer wall vs BOB Builder Bot on inner wall
    list.push({
      type: 'module',
      title: findM('asset-tracking').title,
      category: findM('asset-tracking').category,
      slug: 'asset-tracking',
      module: findM('asset-tracking'),
      innerModule: findM('bob-mascot'),
    });

    // Slot 11: Healthcare Monitoring on outer wall vs Real-Time Analytics on inner wall
    list.push({
      type: 'module',
      title: findM('healthcare-monitoring').title,
      category: findM('healthcare-monitoring').category,
      slug: 'healthcare-monitoring',
      module: findM('healthcare-monitoring'),
      innerModule: findM('analytics-console'),
    });

    // =========================================================================
    // SECTION 3: Industry 4.0 & Enterprise Automation
    // =========================================================================
    // Slot 12: Plaque on outer wall vs Temp & Humidity Sensor on inner wall
    list.push({
      type: 'plaque',
      title: 'ENTERPRISE IIOT & FACTORY AUTOMATION',
      category: 'Industry 4.0 Suite',
      slug: 'iiot',
      innerModule: findM('temp-humidity-sensor'),
    });

    // Slot 13: Industrial IIoT Factory on outer wall vs BOB Chaos Hacker on inner wall
    list.push({
      type: 'module',
      title: findM('industrial-iiot-factory').title,
      category: findM('industrial-iiot-factory').category,
      slug: 'industrial-iiot-factory',
      module: findM('industrial-iiot-factory'),
      innerModule: findM('fire-hacker-mascot'),
    });

    // Slot 14: Predictive Maintenance on outer wall vs Smart CCTV on inner wall
    list.push({
      type: 'module',
      title: findM('predictive-maintenance').title,
      category: findM('predictive-maintenance').category,
      slug: 'predictive-maintenance',
      module: findM('predictive-maintenance'),
      innerModule: findM('smart-cctv-camera'),
    });

    // Slot 15: BITS2WAVE Mission Clock on outer wall vs Device Fleet Health on inner wall
    list.push({
      type: 'module',
      title: findM('bits2wave-timer').title,
      category: findM('bits2wave-timer').category,
      slug: 'bits2wave-timer',
      module: findM('bits2wave-timer'),
      innerModule: findM('device-fleet-alt'),
    });

    // Slot 16: BITS2WAVE Lab Arena on outer wall vs Simulation Settings on inner wall
    list.push({
      type: 'module',
      title: findM('bits2wave-lab-entrance').title,
      category: findM('bits2wave-lab-entrance').category,
      slug: 'bits2wave-lab-entrance',
      module: findM('bits2wave-lab-entrance'),
      innerModule: findM('simulation-control'),
    });

    // Slot 17: Device Fleet Health on outer wall vs Smart City Traffic on inner wall
    list.push({
      type: 'module',
      title: findM('device-fleet-alt').title,
      category: findM('device-fleet-alt').category,
      slug: 'device-fleet-alt',
      module: findM('device-fleet-alt'),
      innerModule: findM('smart-city-traffic'),
    });

    // =========================================================================
    // SECTION 4: BITS2WAVE Hackathon & Chaos Engineering
    // ==========================================
    // Slot 18: Plaque on outer wall vs Connected IIoT Factory on inner wall
    list.push({
      type: 'plaque',
      title: 'BITS2WAVE ARENA • TEAM AURA 999+',
      category: 'Hackathon Innovation',
      slug: 'bits2wave',
      innerModule: findM('industrial-iiot-factory'),
    });

    // Slot 19: Team AURA Banner on outer wall vs Smart Building Console on inner wall
    list.push({
      type: 'module',
      title: findM('bits2wave-aura999').title,
      category: findM('bits2wave-aura999').category,
      slug: 'bits2wave-aura999',
      module: findM('bits2wave-aura999'),
      innerModule: findM('smart-building-console'),
    });

    // Slot 20: BOB Builder Mascot on outer wall vs Predictive Maintenance on inner wall
    list.push({
      type: 'module',
      title: findM('bob-mascot').title,
      category: findM('bob-mascot').category,
      slug: 'bob-mascot',
      module: findM('bob-mascot'),
      innerModule: findM('predictive-maintenance'),
    });

    // Slot 21: BOB Chaos Hacker on outer wall vs Healthcare Monitoring on inner wall
    list.push({
      type: 'module',
      title: findM('fire-hacker-mascot').title,
      category: findM('fire-hacker-mascot').category,
      slug: 'fire-hacker-mascot',
      module: findM('fire-hacker-mascot'),
      innerModule: findM('healthcare-monitoring'),
    });

    // Slot 22: Arduino Microcontroller on outer wall vs IoT Asset Tracking on inner wall
    list.push({
      type: 'module',
      title: findM('arduino-controller').title,
      category: findM('arduino-controller').category,
      slug: 'arduino-controller',
      module: findM('arduino-controller'),
      innerModule: findM('asset-tracking'),
    });

    // Slot 23: Temp & Humidity Sensor on outer wall vs BITS2WAVE Mission Clock on inner wall
    list.push({
      type: 'module',
      title: findM('temp-humidity-sensor').title,
      category: findM('temp-humidity-sensor').category,
      slug: 'temp-humidity-sensor',
      module: findM('temp-humidity-sensor'),
      innerModule: findM('bits2wave-timer'),
    });

    return list;
  }, []);

  const totalPlaces = places.length;

  const activeModuleSlugRef = useRef('simulation-control');
  const [activeModuleTitle, setActiveModuleTitle] = useState('Simulation Settings & Control');

  // Walking state ref
  const walkRef = useRef({
    at: -0.2,
    target: -0.2,
    moved: 0,
  });

  const pointerDragRef = useRef<{
    id: number;
    t: number;
    v: number;
    x: number;
    y: number;
  } | null>(null);
  const isDraggedRef = useRef(false);

  const focusedMeshRef = useRef<THREE.Object3D | null>(null);
  const focusedTimeRef = useRef(0);
  const activePlaceIdxRef = useRef(0);

  const onSelectModuleRef = useRef(onSelectModule);
  onSelectModuleRef.current = onSelectModule;
  const onLaunchModuleRef = useRef(onLaunchModule);
  onLaunchModuleRef.current = onLaunchModule;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight - 60;

    const scene = new THREE.Scene();
    const palette = isDarkMode ? PALETTE_DARK : PALETTE_LIGHT;
    scene.background = new THREE.Color(palette.bg);
    scene.fog = new THREE.Fog(palette.bg, 8, 24);

    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 60);
    camera.position.set(0, 1.55, R_WALK);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDarkMode ? 1.05 : 1.15;
    container.appendChild(renderer.domElement);

    // Textures & Caches
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    const textureCache = new Map<string, THREE.Texture>();

    const getTexture = (url: string, onLoadCallback?: (tex: THREE.Texture) => void) => {
      let tex = textureCache.get(url);
      if (!tex) {
        tex = textureLoader.load(url, (loadedTex) => {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          loadedTex.anisotropy = 4;
          if (onLoadCallback) onLoadCallback(loadedTex);
        });
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        textureCache.set(url, tex);
      }
      return tex;
    };

    // Preload textures
    places.forEach((p) => {
      if (p.module?.image) getTexture(p.module.image);
      if (p.innerModule?.image) getTexture(p.innerModule.image);
    });

    const plaqueTextures = places.map((p) =>
      createLabPlaqueTexture(p.title, p.category, isDarkMode)
    );

    const labelTexturesCache = new Map<string, THREE.CanvasTexture>();
    places.forEach((p) => {
      if (p.module) {
        labelTexturesCache.set(
          `out-${p.slug}`,
          createModuleLabelTexture(p.module.title, p.module.category, isDarkMode)
        );
      }
      if (p.innerModule) {
        labelTexturesCache.set(
          `in-${p.innerModule.slug}`,
          createModuleLabelTexture(p.innerModule.title, p.innerModule.category, isDarkMode)
        );
      }
    });

    const lampTex = getLampTexture();
    const whiteTex = getWhiteTexture();

    // Floor Material (Curved corridor ring)
    const floorMat = new THREE.MeshBasicMaterial({
      color: palette.floor,
      toneMapped: false,
    });

    // Outer Wall Material (Radius 12.0)
    const outerWallMat = new THREE.MeshBasicMaterial({
      color: palette.outer,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    // Inner Wall Material (Radius 7.4) - The other side wall!
    const innerWallMat = new THREE.MeshBasicMaterial({
      color: palette.inner,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const lampMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? '#818cf8' : '#ffffff',
      map: lampTex,
      transparent: true,
      opacity: palette.lamp,
      depthWrite: false,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });

    const innerLampMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? '#38bdf8' : '#ffffff',
      map: lampTex,
      transparent: true,
      opacity: palette.lamp,
      depthWrite: false,
      blending: THREE.NormalBlending,
      toneMapped: false,
    });

    const poolMat = new THREE.MeshBasicMaterial({
      color: isDarkMode ? '#4f46e5' : '#e0e7ff',
      map: lampTex,
      transparent: true,
      opacity: palette.pool,
      depthWrite: false,
      toneMapped: false,
    });

    // 1. Double Wall Architecture
    const floorGeo = new THREE.RingGeometry(7.2, 12.2, 160);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, 0, 0);
    scene.add(floorMesh);

    // Outer Cylinder Wall
    const outerWallGeo = new THREE.CylinderGeometry(R_OUTER_WALL, R_OUTER_WALL, 3.6, 160, 1, true);
    const outerWallMesh = new THREE.Mesh(outerWallGeo, outerWallMat);
    outerWallMesh.position.set(0, 1.8, 0);
    scene.add(outerWallMesh);

    // Inner Cylinder Wall (The other side wall!)
    const innerWallGeo = new THREE.CylinderGeometry(R_INNER_WALL, R_INNER_WALL, 3.6, 120, 1, true);
    const innerWallMesh = new THREE.Mesh(innerWallGeo, innerWallMat);
    innerWallMesh.position.set(0, 1.8, 0);
    scene.add(innerWallMesh);

    // 2. Persistent Pool of 24 Mesh Slots across both walls
    const POOL_SIZE = 24;

    const outerGroups: THREE.Group[] = [];
    const outerArtMeshes: THREE.Mesh[] = [];
    const outerLabelMeshes: THREE.Mesh[] = [];
    const currentOuterSlots: number[] = new Array(POOL_SIZE).fill(-999);

    const innerGroups: THREE.Group[] = [];
    const innerArtMeshes: THREE.Mesh[] = [];
    const innerLabelMeshes: THREE.Mesh[] = [];
    const currentInnerSlots: number[] = new Array(POOL_SIZE).fill(-999);

    const planeGeo1x1 = new THREE.PlaneGeometry(1, 1);
    const outerLampGeo = new THREE.PlaneGeometry(2.8, 3.2);
    const poolGeo = new THREE.PlaneGeometry(2.6, 2.0);
    const labelGeo = new THREE.PlaneGeometry(0.58, LABEL_RATIO);
    const innerLampGeo = new THREE.PlaneGeometry(2.4, 2.8);

    for (let i = 0; i < POOL_SIZE; i++) {
      // --- Outer Mesh Group ---
      const oGroup = new THREE.Group();

      const oLamp = new THREE.Mesh(outerLampGeo, lampMat);
      oLamp.position.set(0, 1.8, 0.01);
      oGroup.add(oLamp);

      const oPool = new THREE.Mesh(poolGeo, poolMat);
      oPool.position.set(0, 0.02, 1.1);
      oPool.rotation.x = -Math.PI / 2;
      oGroup.add(oPool);

      const oArtMat = new THREE.MeshBasicMaterial({ color: 0xffffff, map: whiteTex, toneMapped: false });
      const oArtMesh = new THREE.Mesh(planeGeo1x1, oArtMat);
      oArtMesh.position.set(0, 1.6, 0.03);
      oGroup.add(oArtMesh);
      outerArtMeshes.push(oArtMesh);

      const oLabelMat = new THREE.MeshBasicMaterial({ color: 0xffffff, map: whiteTex, toneMapped: false });
      const oLabelMesh = new THREE.Mesh(labelGeo, oLabelMat);
      oLabelMesh.visible = false;
      oGroup.add(oLabelMesh);
      outerLabelMeshes.push(oLabelMesh);

      scene.add(oGroup);
      outerGroups.push(oGroup);

      // --- Inner Mesh Group (Mounted on Inner Wall on the left!) ---
      const iGroup = new THREE.Group();

      const iLamp = new THREE.Mesh(innerLampGeo, innerLampMat);
      iLamp.position.set(0, 1.8, 0.01);
      iGroup.add(iLamp);

      const iPool = new THREE.Mesh(poolGeo, poolMat);
      iPool.position.set(0, 0.02, 0.9);
      iPool.rotation.x = -Math.PI / 2;
      iGroup.add(iPool);

      const iArtMat = new THREE.MeshBasicMaterial({ color: 0xffffff, map: whiteTex, toneMapped: false });
      const iArtMesh = new THREE.Mesh(planeGeo1x1, iArtMat);
      iArtMesh.position.set(0, 1.6, 0.03);
      iGroup.add(iArtMesh);
      innerArtMeshes.push(iArtMesh);

      const iLabelMat = new THREE.MeshBasicMaterial({ color: 0xffffff, map: whiteTex, toneMapped: false });
      const iLabelMesh = new THREE.Mesh(labelGeo, iLabelMat);
      iLabelMesh.visible = false;
      iGroup.add(iLabelMesh);
      innerLabelMeshes.push(iLabelMesh);

      scene.add(iGroup);
      innerGroups.push(iGroup);
    }

    // Vectors & Interaction
    const pointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();

    const camPosVec = new THREE.Vector3(0, 1.55, R_WALK);
    const camLookVec = new THREE.Vector3(0, 1.5, R_WALK);
    const smoothCamPos = new THREE.Vector3(0, 1.55, R_WALK);
    const smoothCamLook = new THREE.Vector3(0, 1.5, R_WALK);
    const objWorldPos = new THREE.Vector3();
    const objWorldDir = new THREE.Vector3();
    const targetCamPos = new THREE.Vector3();
    const targetCamLook = new THREE.Vector3();

    const introAnim = {
      phase: 'run',
      at: performance.now(),
      from: -5.0,
      to: -0.2,
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDragRef.current = {
        id: e.pointerId,
        t: e.timeStamp,
        v: 0,
        x: e.clientX,
        y: e.clientY,
      };
      isDraggedRef.current = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - rect.left}px, ${
          e.clientY - rect.top
        }px, 0)`;
      }

      const p = pointerDragRef.current;
      if (!p || p.id !== e.pointerId) return;

      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      const dist = Math.abs(dx) >= Math.abs(dy) ? dx : dy;

      if (Math.abs(dist) > 3) isDraggedRef.current = true;

      walkRef.current.target -= 0.0022 * dist;
      if (Math.abs(dist) > 3) walkRef.current.moved = performance.now();

      const dt = Math.max(1, e.timeStamp - p.t);
      p.v = 0.6 * p.v + (dist / dt) * 0.4;
      p.t = e.timeStamp;
      p.x = e.clientX;
      p.y = e.clientY;
    };

    const handlePointerUp = (e: PointerEvent) => {
      const p = pointerDragRef.current;
      if (p && p.id === e.pointerId) {
        pointerDragRef.current = null;
        if (isDraggedRef.current && !(e.timeStamp - p.t > 80)) {
          walkRef.current.target -= 220 * Math.max(-3, Math.min(3, p.v)) * 0.0022;
          walkRef.current.moved = performance.now();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? (e.deltaY + e.deltaX) * 16 : e.deltaY + e.deltaX;
      walkRef.current.target += 0.0009 * Math.max(-120, Math.min(120, delta));
      walkRef.current.moved = performance.now();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        focusedMeshRef.current = null;
        updateZoomState(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        walkRef.current.target += 2 * G_SLOT;
        walkRef.current.moved = performance.now();
      } else if (e.key === 'ArrowLeft') {
        walkRef.current.target -= 2 * G_SLOT;
        walkRef.current.moved = performance.now();
      }
    };

    const updateZoomState = (zoomed: boolean) => {
      if (hintTextRef.current) {
        if (zoomed) {
          hintTextRef.current.innerHTML =
            '<p>Click to open module telemetry</p><p class="opacity-75">Esc or click away to step back</p>';
        } else {
          hintTextRef.current.innerHTML =
            '<p>Scroll or drag to walk round lab</p><p class="opacity-75">Click an exhibit to inspect</p>';
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (isDraggedRef.current) return;

      raycaster.setFromCamera(pointer, camera);
      const testMeshes = [...outerArtMeshes, ...innerArtMeshes];
      const hits = raycaster.intersectObjects(testMeshes, false);

      if (hits.length > 0) {
        const hitObj = hits[0].object as THREE.Mesh;

        // Dolly zoom
        if (focusedMeshRef.current !== hitObj) {
          focusedMeshRef.current = hitObj;
          focusedTimeRef.current = performance.now();
          updateZoomState(true);
          return;
        }

        // Open module details if already zoomed
        const outIdx = outerArtMeshes.indexOf(hitObj);
        if (outIdx !== -1) {
          const slot = currentOuterSlots[outIdx];
          const place = places[mod(slot, totalPlaces)];
          if (place.module) {
            onSelectModuleRef.current(place.module);
          } else {
            onLaunchModuleRef.current(place.slug);
          }
        } else {
          const inIdx = innerArtMeshes.indexOf(hitObj);
          if (inIdx !== -1) {
            const slot = currentInnerSlots[inIdx];
            const place = places[mod(slot, totalPlaces)];
            if (place.innerModule) {
              onSelectModuleRef.current(place.innerModule);
            }
          }
        }
      } else {
        focusedMeshRef.current = null;
        updateZoomState(false);
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    container.addEventListener('click', handleClick);

    // 3. Smooth Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let smoothPointerX = 0;
    let smoothPointerY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      // Silky-smooth pointer easing for camera rotation (Cyera / Active Theory feel)
      smoothPointerX += (pointer.x - smoothPointerX) * Math.min(1, 5.5 * dt);
      smoothPointerY += (pointer.y - smoothPointerY) * Math.min(1, 5.5 * dt);

      const walk = walkRef.current;
      if (focusedMeshRef.current && walk.moved > focusedTimeRef.current) {
        focusedMeshRef.current = null;
        updateZoomState(false);
      }

      if (introAnim.phase === 'run') {
        const progress = Math.min(1, (now - introAnim.at) / 4500);
        walk.at = introAnim.from + (introAnim.to - introAnim.from) * (1 - Math.pow(1 - progress, 3));
        if (progress >= 1) introAnim.phase = 'done';
      } else {
        if (!focusedMeshRef.current) {
          walk.target += 0.03 * dt * 0.25;
        }
        walk.at += (walk.target - walk.at) * Math.min(1, 3.2 * dt);
      }

      const a = walk.at;

      // Camera walking corridor path (at radius 9.7)
      camPosVec.set(
        R_WALK * Math.sin(a),
        1.55 + 0.012 * Math.sin(1.4 * (now * 0.001)),
        R_WALK * Math.cos(a)
      );

      const lookAngle = a + 0.32 + 0.25 * smoothPointerX;
      camLookVec.set(
        R_WALK * Math.sin(lookAngle),
        1.5 + 0.25 * smoothPointerY,
        R_WALK * Math.cos(lookAngle)
      );

      if (focusedMeshRef.current) {
        focusedMeshRef.current.getWorldPosition(targetCamLook);
        focusedMeshRef.current.getWorldDirection(objWorldDir);
        targetCamPos.copy(targetCamLook).addScaledVector(objWorldDir, 2.2);
        targetCamLook.y -= 0.3;
      } else {
        targetCamPos.copy(camPosVec);
        targetCamLook.copy(camLookVec);
      }

      const lerpSpeed = Math.min(1, dt * (focusedMeshRef.current ? 4.5 : 2.5));
      smoothCamPos.lerp(targetCamPos, lerpSpeed);
      smoothCamLook.lerp(targetCamLook, lerpSpeed);

      camera.position.copy(smoothCamPos);
      camera.lookAt(smoothCamLook);

      // Active exhibit indicator
      const activeSlot = Math.round((a + 0.25) / G_SLOT);
      const activePlace = places[mod(activeSlot, totalPlaces)];
      if (activePlace && activePlace !== places[activePlaceIdxRef.current]) {
        activePlaceIdxRef.current = mod(activeSlot, totalPlaces);
        activeModuleSlugRef.current = activePlace.slug;
        if (titleTextRef.current) {
          titleTextRef.current.textContent = activePlace.title;
        }
      }

      // Update 24 Mesh Slots across both Outer & Inner walls
      const baseSlot = Math.floor(a / G_SLOT);

      for (let offset = -4; offset <= 19; offset++) {
        const meshIdx = offset + 4; // 0 to 23
        const slot = baseSlot + offset;
        const place = places[mod(slot, totalPlaces)];
        const slotAngle = slot * G_SLOT;

        // --- Outer Wall Meshes ---
        const oGroup = outerGroups[meshIdx];
        const oArt = outerArtMeshes[meshIdx];
        const oLabel = outerLabelMeshes[meshIdx];

        oGroup.position.set(11.97 * Math.sin(slotAngle), 0, 11.97 * Math.cos(slotAngle));
        oGroup.rotation.y = slotAngle + Math.PI;

        if (currentOuterSlots[meshIdx] !== slot) {
          currentOuterSlots[meshIdx] = slot;

          if (place.type === 'plaque') {
            oLabel.visible = false;
            oArt.scale.set(1.2, 1.5, 1);
            oArt.position.y = 1.55;

            const plaqueTex = plaqueTextures[mod(slot, totalPlaces)];
            (oArt.material as THREE.MeshBasicMaterial).map = plaqueTex;
          } else if (place.module) {
            const m = place.module;
            const r = clampRatio(m.ratio);
            const w = 1.55 * r;
            const h = 1.55;

            oArt.scale.set(w, h, 1);
            oArt.position.y = 1.6;

            const printTex = getTexture(m.image, (loadedTex) => {
              if (currentOuterSlots[meshIdx] === slot) {
                (oArt.material as THREE.MeshBasicMaterial).map = loadedTex;
              }
            });
            (oArt.material as THREE.MeshBasicMaterial).map = printTex;

            const labelTex = labelTexturesCache.get(`out-${place.slug}`);
            if (labelTex) {
              oLabel.visible = true;
              oLabel.position.set(-w / 2 + 0.3, 1.6 - h / 2 - 0.22, 0.03);
              (oLabel.material as THREE.MeshBasicMaterial).map = labelTex;
            } else {
              oLabel.visible = false;
            }
          }
        }

        // --- Inner Wall Meshes (On the other side wall!) ---
        const iGroup = innerGroups[meshIdx];
        const iArt = innerArtMeshes[meshIdx];
        const iLabel = innerLabelMeshes[meshIdx];

        if (place.innerModule) {
          iGroup.visible = true;
          const innerAngle = slotAngle + 0.04;
          iGroup.position.set(Math.sin(innerAngle) * 7.43, 0, Math.cos(innerAngle) * 7.43);
          iGroup.rotation.y = innerAngle;

          if (currentInnerSlots[meshIdx] !== slot) {
            currentInnerSlots[meshIdx] = slot;

            const m = place.innerModule;
            const r = clampRatio(m.ratio);
            // Balanced museum proportions: tight, rhythmic gallery spacing without merging
            const maxW = 1.28;
            const maxH = 1.05;
            let h = maxH;
            let w = h * r;
            if (w > maxW) {
              w = maxW;
              h = w / r;
            }

            iArt.scale.set(w, h, 1);
            iArt.position.y = 1.6;

            // Proportionate spotlight and floor reflection pool
            if (iGroup.children[0]) {
              iGroup.children[0].scale.set(Math.max(1.4, w + 0.4) / 2.4, Math.max(1.6, h + 0.5) / 2.8, 1);
            }
            if (iGroup.children[1]) {
              iGroup.children[1].scale.set(Math.max(1.3, w + 0.3) / 2.6, 1, 1);
            }

            const innerTex = getTexture(m.image, (loadedTex) => {
              if (currentInnerSlots[meshIdx] === slot) {
                (iArt.material as THREE.MeshBasicMaterial).map = loadedTex;
              }
            });
            (iArt.material as THREE.MeshBasicMaterial).map = innerTex;

            const labelTex = labelTexturesCache.get(`in-${m.slug}`);
            if (labelTex) {
              iLabel.visible = true;
              iLabel.position.set(-w / 2 + 0.25, 1.6 - h / 2 - 0.20, 0.03);
              (iLabel.material as THREE.MeshBasicMaterial).map = labelTex;
            } else {
              iLabel.visible = false;
            }
          }
        } else {
          iGroup.visible = false;
          currentInnerSlots[meshIdx] = -999;
        }
      }

      // Cursor raycasting
      raycaster.setFromCamera(pointer, camera);
      const testMeshes = [...outerArtMeshes, ...innerArtMeshes];
      const hits = raycaster.intersectObjects(testMeshes, false);

      if (hits.length > 0) {
        const hitObj = hits[0].object as THREE.Mesh;
        renderer.domElement.style.cursor = 'pointer';

        if (cursorRef.current && cursorTextRef.current) {
          cursorRef.current.style.opacity = '1';
          if (hitObj === focusedMeshRef.current) {
            cursorTextRef.current.textContent = 'Open IoT Telemetry';
          } else {
            cursorTextRef.current.textContent = 'Inspect in 3D';
          }
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '0';
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('click', handleClick);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [places, totalPlaces, isDarkMode]);

  // Navigate module button handlers
  const navigatePlaces = useCallback(
    (direction: number) => {
      walkRef.current.target += direction * G_SLOT * 1.5;
      walkRef.current.moved = performance.now();
      focusedMeshRef.current = null;
      if (hintTextRef.current) {
        hintTextRef.current.innerHTML =
          '<p>Scroll or drag to walk round lab</p><p class="opacity-75">Click an exhibit to inspect</p>';
      }
    },
    []
  );

  return (
    <div className="relative w-full h-[calc(100vh-62px)] overflow-hidden select-none touch-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Mouse Cursor Tooltip Pill */}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-30 transition-opacity duration-150 opacity-0"
      >
        <span
          ref={cursorTextRef}
          className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full shadow-lg border backdrop-blur-md -translate-x-1/2 -translate-y-8 block ${
            isDarkMode
              ? 'bg-[#181a1d]/90 text-white border-white/20'
              : 'bg-[#ffffff]/90 text-neutral-900 border-black/10'
          }`}
        >
          Inspect in 3D
        </span>
      </span>

      {/* Center Bottom HUD: Room Caption for BOB Labs */}
      <div className="absolute bottom-20 md:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none z-20 text-center px-4 max-w-[min(34rem,85vw)]">
        <p
          ref={kickerTextRef}
          className={`text-[10px] md:text-[11px] font-mono tracking-[0.25em] uppercase mb-1.5 transition-colors ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600 font-semibold'
          }`}
        >
          You are exploring
        </p>

        <h2
          ref={titleTextRef}
          className={`font-sans text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase transition-colors duration-300 line-clamp-2 leading-[0.95] ${
            isDarkMode ? 'text-white drop-shadow-md' : 'text-[#0f172a] drop-shadow-xs'
          }`}
        >
          {activeModuleTitle}
        </h2>

        <button
          onClick={() => onLaunchModule(activeModuleSlugRef.current)}
          className={`pointer-events-auto mt-2.5 text-xs font-mono font-bold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border transition-all hover:scale-105 shadow-sm ${
            isDarkMode
              ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500'
              : 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700'
          }`}
        >
          Launch Live Module →
        </button>
      </div>

      {/* Bottom Right Controls (←) (→) and Museum Subtitles */}
      <div className="absolute bottom-6 right-6 md:right-10 flex flex-col items-end space-y-3 z-20 pointer-events-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigatePlaces(-1)}
            className={`w-11 h-11 rounded-full border flex items-center justify-center text-sm transition-all shadow-xs backdrop-blur-md ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900/70 text-white hover:bg-indigo-600 hover:border-indigo-500'
                : 'border-slate-300 bg-white/70 text-slate-800 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
            }`}
            aria-label="Previous exhibit"
            title="Previous exhibit"
          >
            ←
          </button>
          <button
            onClick={() => navigatePlaces(1)}
            className={`w-11 h-11 rounded-full border flex items-center justify-center text-sm transition-all shadow-xs backdrop-blur-md ${
              isDarkMode
                ? 'border-slate-700 bg-slate-900/70 text-white hover:bg-indigo-600 hover:border-indigo-500'
                : 'border-slate-300 bg-white/70 text-slate-800 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
            }`}
            aria-label="Next exhibit"
            title="Next exhibit"
          >
            →
          </button>
        </div>

        <div
          ref={hintTextRef}
          className={`text-[10px] font-mono uppercase tracking-[0.18em] text-right space-y-0.5 pointer-events-none transition-colors ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          <p>Scroll or drag to walk round lab</p>
          <p className="opacity-75">Click an exhibit to inspect</p>
        </div>
      </div>
    </div>
  );
};
