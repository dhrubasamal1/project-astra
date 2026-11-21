import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

// Coordinate conversion: lat 22.25, lon 72.19 (Dholera, Gujarat) on sphere radius R
export const DHOLERA_COORDS = { lat: 22.25, lon: 72.19 };
const EARTH_RADIUS = 2.0;

export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Ease in-out cubic easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Atmosphere Glow Shader Material (Ethereal cyan halo)
const AtmosphereShaderMaterial = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
      gl_FragColor = vec4(0.024, 0.85, 0.95, 1.0) * intensity * 1.5;
    }
  `,
};

interface EarthSceneProps {
  isTargeting: boolean;
  onCrossFade: () => void;
  onComplete: () => void;
  isMobile: boolean;
}

function EarthScene({ isTargeting, onCrossFade, onComplete, isMobile }: EarthSceneProps) {
  const earthGroupRef = useRef<THREE.Group>(null!);
  const earthMeshRef = useRef<THREE.Mesh>(null!);
  const cloudsMeshRef = useRef<THREE.Mesh>(null!);
  const markerPulseRef = useRef<THREE.Mesh>(null!);
  const controlsRef = useRef<any>(null);

  // Textures state
  const [textures, setTextures] = useState<{
    day: THREE.Texture | null;
    bump: THREE.Texture | null;
    specular: THREE.Texture | null;
    night: THREE.Texture | null;
    clouds: THREE.Texture | null;
  }>({
    day: null,
    bump: null,
    specular: null,
    night: null,
    clouds: null,
  });

  // Load realistic textures asynchronously with fallback canvas generation
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const load = (path: string, fallbackColor: string) =>
      new Promise<THREE.Texture>((resolve) => {
        loader.load(
          path,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            resolve(tex);
          },
          undefined,
          () => {
            // Generate fallback procedural texture if file is not found
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = fallbackColor;
              ctx.fillRect(0, 0, 512, 256);
            }
            const fallbackTex = new THREE.CanvasTexture(canvas);
            resolve(fallbackTex);
          }
        );
      });

    Promise.all([
      load('/textures/earth_daymap.jpg', '#0f3a63'),
      load('/textures/earth_bump.jpg', '#808080'),
      load('/textures/earth_specular.jpg', '#000000'),
      load('/textures/earth_nightlights.png', '#000000'),
      load('/textures/earth_clouds.png', '#ffffff'),
    ]).then(([day, bump, specular, night, clouds]) => {
      setTextures({ day, bump, specular, night, clouds });
    });
  }, []);

  // Compute 3D position of Dholera on the sphere surface
  const dholeraPos = useMemo(
    () => latLonToVector3(DHOLERA_COORDS.lat, DHOLERA_COORDS.lon, EARTH_RADIUS),
    []
  );

  // Compute target rotation angles that bring Dholera directly facing the camera
  const { targetRotX, targetRotY } = useMemo(() => {
    // Angle in XZ plane around Y
    const currentAngle = Math.atan2(dholeraPos.x, dholeraPos.z);
    // Rotating by -currentAngle brings (x, z) to (0, +R_xz) facing +Z (camera)
    const tRotY = -currentAngle;
    // Pitch around X to align latitude
    const radiusXZ = Math.sqrt(dholeraPos.x * dholeraPos.x + dholeraPos.z * dholeraPos.z);
    const tRotX = -Math.atan2(dholeraPos.y, radiusXZ);
    return { targetRotX: tRotX, targetRotY: tRotY };
  }, [dholeraPos]);

  // Animation timeline state
  const animTimeRef = useRef(0);
  const initialRotRef = useRef<{ x: number; y: number } | null>(null);
  const initialCamDistRef = useRef(4.8);
  const crossFadedRef = useRef(false);
  const completedRef = useRef(false);

  useFrame((state, delta) => {
    const earthGroup = earthGroupRef.current;
    const cloudsMesh = cloudsMeshRef.current;
    const markerPulse = markerPulseRef.current;
    if (!earthGroup) return;

    // 1. Normal state: gentle auto-rotation and cloud drift
    if (!isTargeting) {
      earthGroup.rotation.y += delta * 0.12;
      if (cloudsMesh) {
        cloudsMesh.rotation.y += delta * 0.16; // Clouds drift slightly faster
      }
      // Pulse animation for Dholera beacon ring
      if (markerPulse) {
        const pulse = (Math.sin(state.clock.elapsedTime * 3.5) + 1) / 2;
        markerPulse.scale.setScalar(1 + pulse * 1.6);
        (markerPulse.material as THREE.MeshBasicMaterial).opacity = 0.85 - pulse * 0.65;
      }
      return;
    }

    // 2. Targeting State ("Start Planning" clicked):
    // Smoothly rotate Earth to Dholera, Gujarat, and zoom camera in (2 seconds, eased)
    if (!initialRotRef.current) {
      // Capture start orientation
      initialRotRef.current = {
        x: earthGroup.rotation.x,
        y: earthGroup.rotation.y,
      };
      initialCamDistRef.current = state.camera.position.length();
      // Disable orbit drag during animation
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }

    animTimeRef.current += delta;
    const DURATION = 2.0;
    const rawProgress = Math.min(1.0, animTimeRef.current / DURATION);
    const progress = easeInOutCubic(rawProgress);

    // Find shortest angular distance for rotation.y
    const startY = initialRotRef.current.y;
    let deltaY = (targetRotY - startY) % (Math.PI * 2);
    if (deltaY > Math.PI) deltaY -= Math.PI * 2;
    if (deltaY < -Math.PI) deltaY += Math.PI * 2;

    const startX = initialRotRef.current.x;
    const deltaX = targetRotX - startX;

    // Interpolate rotation
    earthGroup.rotation.y = startY + deltaY * progress;
    earthGroup.rotation.x = startX + deltaX * progress;

    // Interpolate camera zoom (starts at ~4.8, zooms directly down to 2.38 near Dholera)
    const targetCamDist = 2.38;
    const currentCamDist = THREE.MathUtils.lerp(
      initialCamDistRef.current,
      targetCamDist,
      progress
    );
    state.camera.position.setLength(currentCamDist);
    state.camera.lookAt(0, 0, 0);

    // Trigger cross-fade when zoom reaches 85%
    if (rawProgress >= 0.85 && !crossFadedRef.current) {
      crossFadedRef.current = true;
      onCrossFade();
    }

    // Complete navigation when zoom reaches 100%
    if (rawProgress >= 1.0 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <>
      <Stars radius={150} depth={50} count={isMobile ? 1200 : 3000} factor={4} saturation={0} fade speed={1} />

      {/* Atmospheric directional sunlight mimicking space daylight terminator */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 3, 5]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.15} color="#083344" />
      <hemisphereLight args={['#06b6d4', '#020617', 0.3]} />

      {/* Earth Group containing globe, clouds, atmosphere & marker */}
      <group ref={earthGroupRef}>
        {/* Main Earth Sphere with Photo Satellite Textures */}
        <mesh ref={earthMeshRef}>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          {textures.day ? (
            <meshStandardMaterial
              map={textures.day}
              bumpMap={textures.bump || undefined}
              bumpScale={0.045}
              roughnessMap={textures.specular || undefined}
              roughness={0.65}
              metalness={0.1}
              emissiveMap={textures.night || undefined}
              emissive={new THREE.Color('#ffc880')}
              emissiveIntensity={0.6}
            />
          ) : (
            <meshStandardMaterial color="#0e3a66" roughness={0.7} />
          )}
        </mesh>

        {/* Dynamic Cloud Layer */}
        {textures.clouds && (
          <mesh ref={cloudsMeshRef}>
            <sphereGeometry args={[EARTH_RADIUS * 1.015, 64, 64]} />
            <meshStandardMaterial
              map={textures.clouds}
              transparent
              opacity={0.38}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Glowing Pulsing Beacon Marker on Dholera, Gujarat */}
        <group position={dholeraPos}>
          {/* Core pin */}
          <mesh>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color="#00f2fe" />
          </mesh>

          {/* Animated pulse wave ring */}
          <mesh ref={markerPulseRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.035, 0.055, 32]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>

          {/* Vertical light beacon beam */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.004, 0.008, 0.16, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
          </mesh>

          {/* Floating UI Tooltip Badge */}
          <Html distanceFactor={8} position={[0, 0.12, 0]} center>
            <div className="pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 border border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.65)] backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-90 duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-cyan-300 tracking-wide uppercase leading-tight">
                  Dholera SIR (Gujarat)
                </span>
                <span className="text-[8.5px] font-mono text-cyan-200/70 leading-none">
                  22.25°N, 72.19°E · Greenfield Hub
                </span>
              </div>
            </div>
          </Html>
        </group>

        {/* Outer Cyan Atmospheric Glow Halo */}
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS * 1.14, 64, 64]} />
          <shaderMaterial
            args={[AtmosphereShaderMaterial]}
            side={THREE.BackSide}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* OrbitControls: User can drag to rotate the globe */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.55}
        dampingFactor={0.06}
      />
    </>
  );
}

// Glowing-Circle Fallback Component while 3D Canvas / Textures load
export const EarthFallback: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center relative">
    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-cyan-500/30 flex items-center justify-center relative animate-pulse">
      {/* Outer spinning radar arc */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
      {/* Inner glowing core */}
      <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center justify-center gap-2">
        <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider uppercase text-center px-4">
          Synthesizing Orbital Earth...
        </span>
      </div>
    </div>
  </div>
);

interface EarthGlobe3DProps {
  isTargeting: boolean;
  onCrossFade: () => void;
  onComplete: () => void;
}

export const EarthGlobe3D: React.FC<EarthGlobe3DProps> = ({
  isTargeting,
  onCrossFade,
  onComplete,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 45 }}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <React.Suspense fallback={null}>
          <EarthScene
            isTargeting={isTargeting}
            onCrossFade={onCrossFade}
            onComplete={onComplete}
            isMobile={isMobile}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
