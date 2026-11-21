import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Exact coordinates for Dholera, Gujarat on sphere of radius R
export const DHOLERA_COORDS = { lat: 22.25, lon: 72.19 };
const EARTH_RADIUS = 2.0;

/**
 * Converts geographic latitude and longitude to 3D Cartesian coordinates
 * on a Three.js SphereGeometry (equirectangular UV mapping).
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Cubic ease-in-out curve for smooth deceleration
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Atmospheric Glow Shader (Rayleigh scattering halo inspired by NASA Earth imagery)
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
      float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
      gl_FragColor = vec4(0.04, 0.82, 0.96, 1.0) * intensity * 1.6;
    }
  `,
};

// NASA Official 3D Earth GLB Component
function NasaEarthModel() {
  const { scene } = useGLTF('/models/Earth_1_12756.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  return <primitive object={clonedScene} scale={0.004} />;
}

// Fallback high-res 2K textured sphere with daylight, bump, specular & night lights
function TexturedEarthMesh({ textures }: { textures: any }) {
  return (
    <mesh>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      {textures.day ? (
        <meshStandardMaterial
          map={textures.day}
          bumpMap={textures.bump || undefined}
          bumpScale={0.05}
          roughnessMap={textures.specular || undefined}
          roughness={0.65}
          metalness={0.1}
          emissiveMap={textures.night || undefined}
          emissive={new THREE.Color('#ffc880')}
          emissiveIntensity={0.65}
        />
      ) : (
        <meshStandardMaterial color="#0e3a66" roughness={0.7} />
      )}
    </mesh>
  );
}

// Error Boundary to seamlessly fallback to TexturedEarth if GLB fails
class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('NASA GLB failed to render, falling back to 2K textures:', error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface EarthSceneProps {
  isTargeting: boolean;
  onCrossFade: () => void;
  onComplete: () => void;
  isMobile: boolean;
}

function EarthScene({ isTargeting, onCrossFade, onComplete, isMobile }: EarthSceneProps) {
  const earthGroupRef = useRef<THREE.Group>(null!);
  const cloudsMeshRef = useRef<THREE.Mesh>(null!);
  const markerPulseRef = useRef<THREE.Mesh>(null!);
  const controlsRef = useRef<any>(null);

  // 2K textures state for instant rendering / fallback
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
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 256;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = fallbackColor;
              ctx.fillRect(0, 0, 512, 256);
            }
            resolve(new THREE.CanvasTexture(canvas));
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

  // Compute 3D Cartesian coordinates of Dholera on the sphere surface
  const dholeraPos = useMemo(
    () => latLonToVector3(DHOLERA_COORDS.lat, DHOLERA_COORDS.lon, EARTH_RADIUS),
    []
  );

  // Compute target angles that align Dholera, Gujarat facing the camera directly
  const { targetRotX, targetRotY } = useMemo(() => {
    const tRotY = Math.atan2(-dholeraPos.x, dholeraPos.z);
    const radiusXZ = Math.sqrt(dholeraPos.x * dholeraPos.x + dholeraPos.z * dholeraPos.z);
    const tRotX = Math.atan2(dholeraPos.y, radiusXZ);
    return { targetRotX: tRotX, targetRotY: tRotY };
  }, [dholeraPos]);

  // Animation timeline state
  const animTimeRef = useRef(0);
  const isInitialSetRef = useRef(false);
  const initialRotRef = useRef<{ x: number; y: number } | null>(null);
  const initialCamDistRef = useRef(5.2);
  const crossFadedRef = useRef(false);
  const completedRef = useRef(false);

  useFrame((state, delta) => {
    const earthGroup = earthGroupRef.current;
    const cloudsMesh = cloudsMeshRef.current;
    const markerPulse = markerPulseRef.current;
    if (!earthGroup) return;

    // Immediately point the globe to Dholera, Gujarat on initial screen load
    if (!isInitialSetRef.current) {
      isInitialSetRef.current = true;
      earthGroup.rotation.x = targetRotX;
      earthGroup.rotation.y = targetRotY;
      if (cloudsMesh) {
        cloudsMesh.rotation.y = targetRotY * 1.03;
      }
    }

    // 1. Idle state: gentle auto-rotation and drifting clouds
    if (!isTargeting) {
      earthGroup.rotation.y += delta * 0.08;
      if (cloudsMesh) {
        cloudsMesh.rotation.y += delta * 0.10;
      }
      if (markerPulse) {
        const pulse = (Math.sin(state.clock.elapsedTime * 3.5) + 1) / 2;
        markerPulse.scale.setScalar(1 + pulse * 1.6);
        (markerPulse.material as THREE.MeshBasicMaterial).opacity = 0.85 - pulse * 0.65;
      }
      return;
    }

    // 2. Start Animation Triggered:
    // Accelerates into a dramatic rotating Earth animation (full 360-deg planetary spin),
    // then smoothly decelerates and zooms directly into Dholera, Gujarat!
    if (!initialRotRef.current) {
      initialRotRef.current = {
        x: earthGroup.rotation.x,
        y: earthGroup.rotation.y,
      };
      initialCamDistRef.current = state.camera.position.length();
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }

    animTimeRef.current += delta;
    const DURATION = 2.2;
    const rawProgress = Math.min(1.0, animTimeRef.current / DURATION);
    const progress = easeInOutCubic(rawProgress);

    // Perform a full 360-degree planetary spin revolution + alignment to target
    const spinRevolutions = 1.0;
    const spinAngle = Math.PI * 2 * spinRevolutions;

    const startY = initialRotRef.current.y;
    let deltaY = (targetRotY - startY) % (Math.PI * 2);
    if (deltaY > Math.PI) deltaY -= Math.PI * 2;
    if (deltaY < -Math.PI) deltaY += Math.PI * 2;

    const startX = initialRotRef.current.x;
    const deltaX = targetRotX - startX;

    // Dramatic rotating animation easing smoothly into Dholera alignment
    earthGroup.rotation.y = startY + (spinAngle + deltaY) * progress;
    earthGroup.rotation.x = startX + deltaX * progress;

    if (cloudsMesh) {
      cloudsMesh.rotation.y = earthGroup.rotation.y * 1.03;
    }

    // Smooth camera zoom: starts at orbital distance ~4.8, zooms into 2.36 (just above Dholera)
    const targetCamDist = 2.36;
    const currentCamDist = THREE.MathUtils.lerp(
      initialCamDistRef.current,
      targetCamDist,
      progress
    );
    state.camera.position.setLength(currentCamDist);
    state.camera.lookAt(0, 0, 0);

    // Cross-fade overlay activates as zoom reaches 82%
    if (rawProgress >= 0.82 && !crossFadedRef.current) {
      crossFadedRef.current = true;
      onCrossFade();
    }

    // When full rotation and zoom completes &rarr; open the site!
    if (rawProgress >= 1.0 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <>
      <Stars radius={150} depth={50} count={isMobile ? 1200 : 3200} factor={4} saturation={0} fade speed={1} />

      {/* Atmospheric directional sunlight mimicking space day/night terminator */}
      <ambientLight intensity={0.28} />
      <directionalLight position={[6, 3, 5]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.2} color="#083344" />
      <hemisphereLight args={['#06b6d4', '#020617', 0.35]} />

      {/* Earth Group containing globe, clouds, atmosphere & Dholera marker */}
      <group ref={earthGroupRef}>
        {/* NASA Official GLB Model with textured fallback */}
        <ModelErrorBoundary fallback={<TexturedEarthMesh textures={textures} />}>
          <Suspense fallback={<TexturedEarthMesh textures={textures} />}>
            <NasaEarthModel />
          </Suspense>
        </ModelErrorBoundary>

        {/* Dynamic Cloud Layer */}
        {textures.clouds && (
          <mesh ref={cloudsMeshRef}>
            <sphereGeometry args={[EARTH_RADIUS * 1.018, 64, 64]} />
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
          <mesh>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshBasicMaterial color="#00f2fe" />
          </mesh>

          <mesh ref={markerPulseRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.035, 0.055, 32]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>

          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.004, 0.008, 0.16, 8]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
          </mesh>

          <Html distanceFactor={8} position={[0, 0.12, 0]} center>
            <div className="pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/90 border border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.65)] backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-90 duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-cyan-300 tracking-wide uppercase leading-tight">
                  Dholera SIR (Gujarat)
                </span>
                <span className="text-[8.5px] font-mono text-cyan-200/70 leading-none">
                  22.25°N, 72.19°E · Greenfield Zone
                </span>
              </div>
            </div>
          </Html>
        </group>

        {/* Outer Cyan Atmospheric Rayleigh Glow */}
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

export const EarthGlobe3D: React.FC<{
  isTargeting: boolean;
  onCrossFade: () => void;
  onComplete: () => void;
}> = ({ isTargeting, onCrossFade, onComplete }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing rounded-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={isMobile ? [1, 1.25] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <EarthScene
            isTargeting={isTargeting}
            onCrossFade={onCrossFade}
            onComplete={onComplete}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
