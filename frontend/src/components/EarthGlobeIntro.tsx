import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Globe, X, Satellite, Crosshair, Sparkles, Compass } from 'lucide-react';
import { Region } from '../types';

interface EarthGlobeIntroProps {
  currentRegion: Region;
  onComplete: () => void;
  isOpen: boolean;
}

// Simplified continent vector outlines [lon, lat]
const CONTINENT_POLYGONS: [number, number][][] = [
  // India Subcontinent (Detailed)
  [
    [68.5, 23.8], [69.0, 22.0], [70.2, 21.0], [72.5, 20.8], [72.8, 19.0],
    [73.8, 15.5], [74.8, 13.0], [76.5, 9.8], [77.5, 8.1], [78.2, 8.8],
    [79.8, 10.3], [80.3, 13.1], [80.9, 15.8], [82.8, 17.0], [84.0, 18.5],
    [85.8, 19.8], [87.0, 21.5], [88.5, 21.6], [89.0, 22.8], [91.5, 22.2],
    [92.6, 20.8], [92.3, 23.8], [94.5, 25.0], [97.0, 28.0], [95.0, 29.5],
    [92.0, 28.0], [88.5, 27.5], [84.0, 28.5], [81.0, 30.2], [78.5, 31.5],
    [76.8, 33.2], [74.5, 35.5], [73.5, 33.5], [71.5, 30.0], [70.0, 27.5],
    [68.5, 23.8]
  ],
  // Eurasia Mainland
  [
    [-9.5, 38.7], [0.0, 43.5], [3.0, 48.0], [5.0, 52.0], [10.0, 55.0],
    [20.0, 55.0], [30.0, 60.0], [40.0, 65.0], [60.0, 68.0], [90.0, 72.0],
    [120.0, 70.0], [140.0, 65.0], [170.0, 65.0], [160.0, 55.0], [140.0, 50.0],
    [130.0, 42.0], [122.0, 37.0], [120.0, 30.0], [115.0, 22.0], [105.0, 15.0],
    [100.0, 7.0], [104.0, 1.3], [98.0, 8.0], [95.0, 18.0], [80.0, 25.0],
    [65.0, 25.0], [60.0, 25.0], [50.0, 30.0], [35.0, 32.0], [28.0, 41.0],
    [15.0, 40.0], [5.0, 36.0], [-5.0, 36.0], [-9.5, 38.7]
  ],
  // Africa
  [
    [-17.5, 14.8], [-12.0, 28.0], [0.0, 35.5], [10.0, 37.0], [30.0, 31.5],
    [32.5, 30.0], [34.0, 27.5], [43.5, 12.5], [51.0, 11.8], [45.0, 2.0],
    [40.0, -5.0], [35.0, -15.0], [32.0, -28.0], [26.0, -33.5], [18.5, -34.5],
    [15.0, -28.0], [12.0, -18.0], [9.0, 0.0], [2.0, 6.0], [-5.0, 5.0],
    [-15.0, 11.0], [-17.5, 14.8]
  ],
  // North America
  [
    [-168.0, 65.0], [-150.0, 60.0], [-130.0, 50.0], [-125.0, 40.0], [-117.0, 32.0],
    [-105.0, 20.0], [-90.0, 15.0], [-80.0, 8.5], [-77.0, 8.0], [-82.0, 23.0],
    [-75.0, 35.0], [-65.0, 45.0], [-55.0, 50.0], [-60.0, 60.0], [-85.0, 68.0],
    [-120.0, 70.0], [-168.0, 65.0]
  ],
  // South America
  [
    [-76.0, 8.5], [-60.0, 8.0], [-50.0, -2.0], [-35.0, -6.0], [-40.0, -22.0],
    [-55.0, -35.0], [-65.0, -50.0], [-70.0, -55.0], [-75.0, -45.0], [-72.0, -20.0],
    [-80.0, -5.0], [-76.0, 8.5]
  ],
  // Australia
  [
    [114.0, -22.0], [122.0, -18.0], [130.0, -12.0], [136.0, -12.0], [142.0, -10.5],
    [150.0, -22.0], [153.0, -28.0], [150.0, -37.0], [140.0, -38.0], [130.0, -32.0],
    [115.0, -34.0], [113.0, -26.0], [114.0, -22.0]
  ],
  // Japan & East Asia Islands
  [
    [130.0, 32.0], [135.0, 35.0], [140.0, 37.0], [142.0, 43.0], [140.0, 45.0],
    [135.0, 40.0], [130.0, 32.0]
  ],
  // Sri Lanka
  [
    [79.8, 9.8], [81.8, 8.5], [81.5, 6.5], [80.0, 6.0], [79.8, 9.8]
  ]
];

// Satellites in orbit around Earth
const SATELLITES = [
  { name: 'CARTOSAT-3 (ISRO)', alt: '505 km', incl: 0.65, speed: 0.024, phase: 0.2, color: '#38bdf8' },
  { name: 'EOS-04 RISAT-1A', alt: '529 km', incl: -0.55, speed: 0.018, phase: 1.5, color: '#4ade80' },
  { name: 'INSAT-3DR MOSDAC', alt: '35,786 km', incl: 0.15, speed: 0.008, phase: 3.2, color: '#fbbf24' },
];

export const EarthGlobeIntro: React.FC<EarthGlobeIntroProps> = ({
  currentRegion,
  onComplete,
  isOpen,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const [phaseText, setPhaseText] = useState('ORBITAL RECONNAISSANCE INITIALIZING...');
  const [altitudeKm, setAltitudeKm] = useState(35786);
  const [isDiving, setIsDiving] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Target coordinates [lat, lon]
  const targetLat = currentRegion.center[0];
  const targetLon = currentRegion.center[1];

  const handleSkip = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    onComplete();
  }, [onComplete]);

  // Keyboard shortcut: Escape or Space to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle HiDPI retina displays
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Starfield points
    const stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    const startTime = performance.now();
    const DURATION_MS = 4800; // Total briefing duration: 4.8 seconds

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1.0, elapsed / DURATION_MS);
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Deep Space Background with Twinkling Stars
      ctx.fillStyle = '#020617'; // Slate 950 deep cosmic obsidian
      ctx.fillRect(0, 0, width, height);

      // Subtle Cosmic Nebula Glow
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.45, 50,
        width * 0.5, height * 0.45, width * 0.8
      );
      nebulaGrad.addColorStop(0, 'rgba(30, 58, 138, 0.25)'); // Indigo core
      nebulaGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.4)');
      nebulaGrad.addColorStop(1, 'rgba(2, 6, 23, 1)');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (const s of stars) {
        const starAlpha = Math.sin(now * s.speed + s.x) * 0.3 + s.alpha;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, starAlpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Timeline Phases:
      // 0.00 - 0.40 (0.0s - 1.9s): Free spin, telemetry establishing
      // 0.40 - 0.70 (1.9s - 3.3s): Decelerating & locking on India / Jewar, radar reticle
      // 0.70 - 1.00 (3.3s - 4.8s): Hyper-dive zoom into target parcel & fade into Leaflet map
      let globeScale = 1.0;
      let globeRadius = Math.min(width, height) * 0.26;
      let centerOffsetLon = 0;
      let currentRotationLon = 0;
      let globeCenterY = height * 0.48;

      if (progress < 0.40) {
        // Phase 1: Fast global spin
        const p1 = progress / 0.40;
        currentRotationLon = (p1 * 220) % 360;
        setPhaseText('ISRO 7-PILLAR SATELLITE CONSTELLATION ONLINE...');
        setAltitudeKm(Math.round(35786 - p1 * 5000));
        setScanProgress(Math.round(p1 * 40));
      } else if (progress < 0.70) {
        // Phase 2: Smooth target acquisition centering on target coordinates
        const p2 = (progress - 0.40) / 0.30;
        // Target long needs to face forward (sub-satellite point)
        // In orthographic projection, when sub-lon = targetLon, target is dead center
        const targetRotLon = -targetLon;
        const startRotLon = 220 % 360;
        // Ease out quad
        const easeP2 = 1 - (1 - p2) * (1 - p2);
        currentRotationLon = startRotLon + (targetRotLon - startRotLon) * easeP2;
        setIsDiving(false);
        setPhaseText(`TARGET LOCK: ${currentRegion.name.toUpperCase()}`);
        setAltitudeKm(Math.round(30000 - easeP2 * 20000));
        setScanProgress(Math.round(40 + p2 * 35));
      } else {
        // Phase 3: Hyper-dive zoom into target
        const p3 = (progress - 0.70) / 0.30;
        setIsDiving(true);
        // Exponential scale dive
        const diveEase = Math.pow(p3, 2.8);
        globeScale = 1.0 + diveEase * 12.0;
        currentRotationLon = -targetLon;
        setPhaseText('DESCENDING TO MASTER-PLANNING RESOLUTION (1,200M)...');
        setAltitudeKm(Math.max(1200, Math.round(10000 * (1 - p3))));
        setScanProgress(Math.round(75 + p3 * 25));
      }

      const cx = width * 0.5;
      const cy = globeCenterY;
      const R = globeRadius * globeScale;

      // Axial tilt (23.5 degrees)
      const tiltLat = 18.0 * (Math.PI / 180);
      const rotLon = currentRotationLon * (Math.PI / 180);

      // Helper for 3D orthographic projection
      const project = (lonDeg: number, latDeg: number): { x: number; y: number; visible: boolean } => {
        const phi = latDeg * (Math.PI / 180);
        const lam = (lonDeg * (Math.PI / 180)) + rotLon;

        // Orthographic projection formulas
        const x3 = Math.cos(phi) * Math.sin(lam);
        const y3 = Math.cos(tiltLat) * Math.sin(phi) - Math.sin(tiltLat) * Math.cos(phi) * Math.cos(lam);
        const z3 = Math.sin(tiltLat) * Math.sin(phi) + Math.cos(tiltLat) * Math.cos(phi) * Math.cos(lam);

        return {
          x: cx + x3 * R,
          y: cy - y3 * R,
          visible: z3 > 0,
        };
      };

      // 2. Outer Atmospheric Glow (Cyan/Azure Halo)
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.25);
      glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)'); // Sky 400
      glowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.2)');
      glowGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 3. Earth Sphere Base (Deep Ocean Blue Shading with Sun Terminator)
      const earthGrad = ctx.createRadialGradient(
        cx - R * 0.35, cy - R * 0.35, R * 0.1,
        cx, cy, R
      );
      earthGrad.addColorStop(0, '#1e3a8a'); // Bright Sunlit Ocean (Blue 900)
      earthGrad.addColorStop(0.65, '#0f172a'); // Deep Twilight
      earthGrad.addColorStop(1, '#020617'); // Dark Limb
      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // 4. Clip to Earth Sphere for Graticules and Continents
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Draw Graticule Lines (Parallels and Meridians)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)'; // Cyan wireframe
      ctx.lineWidth = 1;

      // Parallels every 20 degrees
      for (let lat = -60; lat <= 60; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project(lon, lat);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Meridians every 30 degrees
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const pt = project(lon, lat);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 5. Draw Continents with Holographic Landfill & Outline
      CONTINENT_POLYGONS.forEach((poly, polyIdx) => {
        const isIndia = polyIdx === 0;

        ctx.beginPath();
        let started = false;
        let visibleCount = 0;

        for (let i = 0; i < poly.length; i++) {
          const pt = project(poly[i][0], poly[i][1]);
          if (pt.visible) {
            visibleCount++;
            if (!started) {
              ctx.moveTo(pt.x, pt.y);
              started = true;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            started = false;
          }
        }

        if (visibleCount > 2) {
          if (isIndia) {
            // Highlight Indian Subcontinent in Glowing Emerald/Cyan
            ctx.fillStyle = 'rgba(16, 185, 129, 0.35)'; // Emerald glow
            ctx.fill();
            ctx.strokeStyle = '#34d399'; // Emerald 400
            ctx.lineWidth = 2.2;
            ctx.stroke();
          } else {
            // Other continents in subtle spatial slate
            ctx.fillStyle = 'rgba(30, 41, 59, 0.55)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });

      // Atmospheric Cloud Swirls
      const cloudAlpha = 0.18 + Math.sin(now * 0.001) * 0.05;
      ctx.fillStyle = `rgba(255, 255, 255, ${cloudAlpha})`;
      for (let c = 0; c < 5; c++) {
        const cloudPt = project(-40 + c * 60 + (now * 0.01), 15 + c * 8);
        if (cloudPt.visible) {
          ctx.beginPath();
          ctx.arc(cloudPt.x, cloudPt.y, R * 0.12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore(); // Restore after sphere clip

      // 6. Draw Orbiting Satellites with Tracking Arcs
      SATELLITES.forEach((sat, sIdx) => {
        const satAngle = now * sat.speed * 0.08 + sat.phase;
        const satR = R * (1.18 + sIdx * 0.12);
        const satX = cx + Math.cos(satAngle) * satR;
        const satY = cy + Math.sin(satAngle) * satR * Math.cos(sat.incl);

        // Orbital Ring
        ctx.strokeStyle = `${sat.color}33`; // 20% alpha
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(cx, cy, satR, satR * Math.cos(sat.incl), 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite Marker Pin
        ctx.fillStyle = sat.color;
        ctx.shadowColor = sat.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(satX, satY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Satellite Telemetry Label
        if (globeScale <= 2.5) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = sat.color;
          ctx.fillText(sat.name, satX + 6, satY - 4);
        }
      });

      // 7. Target Region Lock Reticle (Targeting Jewar or Dholera)
      const targetProj = project(targetLon, targetLat);
      if (targetProj.visible) {
        const tx = targetProj.x;
        const ty = targetProj.y;

        // Expanding radar beacon pulses
        const pulse = (now * 0.003) % 1;
        const pulseR = 12 + pulse * 45;
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - pulse})`; // Red beacon pulse
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tx, ty, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        // Target Crosshair
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;

        // Concentric target ring
        ctx.beginPath();
        ctx.arc(tx, ty, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Cross lines
        ctx.beginPath();
        ctx.moveTo(tx - 18, ty); ctx.lineTo(tx - 12, ty);
        ctx.moveTo(tx + 12, ty); ctx.lineTo(tx + 18, ty);
        ctx.moveTo(tx, ty - 18); ctx.lineTo(tx, ty - 12);
        ctx.moveTo(tx, ty + 12); ctx.lineTo(tx, ty + 18);
        ctx.stroke();

        // Corner brackets around target area
        const boxSize = 24 * Math.min(2.5, globeScale);
        ctx.strokeStyle = '#38bdf8'; // Cyan bracket
        ctx.lineWidth = 1.8;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(tx - boxSize, ty - boxSize + 8);
        ctx.lineTo(tx - boxSize, ty - boxSize);
        ctx.lineTo(tx - boxSize + 8, ty - boxSize);
        // Top-right
        ctx.moveTo(tx + boxSize - 8, ty - boxSize);
        ctx.lineTo(tx + boxSize, ty - boxSize);
        ctx.lineTo(tx + boxSize, ty - boxSize + 8);
        // Bottom-left
        ctx.moveTo(tx - boxSize, ty + boxSize - 8);
        ctx.lineTo(tx - boxSize, ty + boxSize);
        ctx.lineTo(tx - boxSize + 8, ty + boxSize);
        // Bottom-right
        ctx.moveTo(tx + boxSize - 8, ty + boxSize);
        ctx.lineTo(tx + boxSize, ty + boxSize);
        ctx.lineTo(tx + boxSize, ty + boxSize - 8);
        ctx.stroke();

        // Target Tag Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`TARGET: ${currentRegion.id === 'up_jewar' ? 'UP JEWAR AEROTROPOLIS' : 'DHOLERA SIR NODE'}`, tx + boxSize + 8, ty - 6);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '9.5px monospace';
        ctx.fillText(`${targetLat.toFixed(4)}°N, ${targetLon.toFixed(4)}°E`, tx + boxSize + 8, ty + 8);
      }

      // 8. Dive Speed Lines Effect in Phase 3
      if (progress >= 0.70) {
        const diveP = (progress - 0.70) / 0.30;
        const lineCount = 40;
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * diveP})`;
        ctx.lineWidth = 2;
        for (let l = 0; l < lineCount; l++) {
          const angle = (l / lineCount) * Math.PI * 2;
          const r1 = R * (0.8 + Math.random() * 0.4);
          const r2 = r1 + 80 * diveP;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }

        // Radar Scan Bar sweeping down
        const scanY = (now * 0.4) % height;
        const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0.4)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 30, width, 30);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
      }

      // 9. Fade to Leaflet map during last 400ms
      if (progress >= 0.88) {
        const fadeOut = (progress - 0.88) / 0.12;
        canvas.style.opacity = `${1.0 - fadeOut}`;
      } else {
        canvas.style.opacity = '1.0';
      }

      // Complete when timeline finishes
      if (progress < 1.0) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        onComplete();
      }
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isOpen, currentRegion, targetLat, targetLon, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col justify-between pointer-events-auto select-none font-sans">
      {/* 3D Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top TV Broadcast Reconnaissance Telemetry Overlay */}
      <div className="relative z-10 p-6 flex items-start justify-between bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sky-400 font-extrabold text-xs tracking-wider uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <Satellite className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>ISRO Satellite Reconnaissance Telemetry</span>
          </div>
          <div className="text-white font-mono text-sm tracking-tight font-black flex items-center space-x-3">
            <span>GRID: {currentRegion.id === 'up_jewar' ? 'UP-NCR QUADRANT 43N' : 'GULF OF KHAMBHAT 43N'}</span>
            <span className="text-slate-500">|</span>
            <span className="text-sky-300">
              {targetLat.toFixed(4)}°N, {targetLon.toFixed(4)}°E
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            STACK: Bhoonidhi CartoDEM • Bhuvan 50k LULC • MOSDAC INSAT-3DR • VEDAS NDVI
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
          title="Press Esc or Space to jump to interactive map"
        >
          <span>Skip Briefing</span>
          <span className="px-1.5 py-0.5 text-[9px] bg-white/20 rounded-md font-mono text-slate-200">
            ESC
          </span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Reticle Telemetry Data (Visible when diving) */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
        {isDiving && (
          <div className="bg-slate-900/80 backdrop-blur-md border border-sky-500/50 px-5 py-2.5 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 space-y-1">
            <div className="flex items-center justify-center space-x-2 text-sky-400 font-black text-xs uppercase tracking-widest">
              <Crosshair className="w-4 h-4 animate-spin-slow text-sky-400" />
              <span>Diving into Target Corridor</span>
            </div>
            <div className="text-white text-lg font-black tracking-tight font-mono">
              ALTITUDE: {altitudeKm.toLocaleString()} METERS
            </div>
          </div>
        )}
      </div>

      {/* Bottom TV News Broadcast Ticker & Progress Bar */}
      <div className="relative z-10 p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent space-y-3">
        <div className="max-w-2xl mx-auto w-full space-y-2">
          {/* Status Text Banner */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 uppercase tracking-wider">{phaseText}</span>
            </span>
            <span className="text-sky-400">{scanProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-100 ease-out rounded-full shadow-sm shadow-sky-400/50"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          {/* Subtitle Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>TERRACITY AI // MULTI-PORTAL LAND INTELLIGENCE</span>
            <span className="font-mono text-slate-500">CLICK ANYWHERE OR PRESS ESC TO START</span>
          </div>
        </div>
      </div>
    </div>
  );
};
