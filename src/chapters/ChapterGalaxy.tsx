import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { ChevronDown } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return mobile;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Nebula Particles                                                   */
/* ------------------------------------------------------------------ */

function NebulaParticles({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(123 / 255, 45 / 255, 142 / 255),
      new THREE.Color(27 / 255, 73 / 255, 101 / 255),
      new THREE.Color(212 / 255, 175 / 255, 55 / 255),
    ];

    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

    }
    return { positions: pos, colors: col };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame((_state, delta) => {
    if (ref.current && !reduced) {
      ref.current.rotation.y += delta * 0.008;
      ref.current.rotation.x += delta * 0.003;
    }
  });

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Spiral Galaxy                                                      */
/* ------------------------------------------------------------------ */

function SpiralGalaxy({ starCount, reduced }: { starCount: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const arms = 4;
    for (let i = 0; i < starCount; i++) {
      const arm = i % arms;
      const armAngle = (arm / arms) * Math.PI * 2;
      const dist = Math.random() * 12;
      // logarithmic spiral
      const spiralAngle = dist * 0.8 + armAngle;
      const scatter = (1 - dist / 12) * 1.5 + 0.2;
      const x = Math.cos(spiralAngle) * dist + (Math.random() - 0.5) * scatter;
      const z = Math.sin(spiralAngle) * dist + (Math.random() - 0.5) * scatter;
      const y = (Math.random() - 0.5) * scatter * 0.3;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [starCount]);

  const colors = useMemo(() => {
    const col = new Float32Array(starCount * 3);
    const inner = new THREE.Color(212 / 255, 175 / 255, 55 / 255);
    const outer = new THREE.Color(123 / 255, 45 / 255, 142 / 255);
    const tmp = new THREE.Color();
    for (let i = 0; i < starCount; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const d = Math.sqrt(x * x + z * z) / 12;
      tmp.copy(inner).lerp(outer, d);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    return col;
  }, [starCount, positions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame((_state, delta) => {
    if (ref.current && !reduced) {
      ref.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <Float speed={reduced ? 0 : 0.4} rotationIntensity={reduced ? 0 : 0.1} floatIntensity={reduced ? 0 : 0.2}>
      <points ref={ref} material={material} position={[0, 0, -8]} rotation={[Math.PI * 0.35, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
      </points>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/*  Shooting Stars                                                     */
/* ------------------------------------------------------------------ */

interface ShootingStar {
  id: number;
  start: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
}

function ShootingStars({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const nextId = useRef(0);

  const spawn = useCallback(() => {
    const s: ShootingStar = {
      id: nextId.current++,
      start: new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        10 + Math.random() * 15,
        -5 - Math.random() * 20,
      ),
      direction: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        -1,
        (Math.random() - 0.5) * 0.3,
      ).normalize(),
      speed: 12 + Math.random() * 10,
    };
    setStars((prev) => [...prev.slice(-2), s]);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(spawn, 2000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [spawn, reduced]);

  return (
    <group ref={groupRef}>
      {stars.map((s) => (
        <ShootingStarLine key={s.id} star={s} onDone={() => setStars((prev) => prev.filter((x) => x.id !== s.id))} />
      ))}
    </group>
  );
}

function ShootingStarLine({ star, onDone }: { star: ShootingStar; onDone: () => void }) {
  const ref = useRef<THREE.Line>(null);
  const progress = useRef(0);
  const tailLength = 3;

  const geometry = useMemo(() => new THREE.BufferGeometry(), []);
  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0xf0f0ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useFrame((_state, delta) => {
    progress.current += delta * star.speed;
    if (progress.current > 50) {
      onDone();
      return;
    }
    const head = star.start.clone().addScaledVector(star.direction, progress.current);
    const tail = star.start.clone().addScaledVector(star.direction, Math.max(0, progress.current - tailLength));
    const pts = new Float32Array([tail.x, tail.y, tail.z, head.x, head.y, head.z]);
    geometry.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    geometry.computeBoundingSphere();

    if (ref.current) {
      (ref.current.material as THREE.LineBasicMaterial).opacity = Math.max(0, 1 - progress.current / 50);
    }
  });

  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);
  return <primitive object={lineObj} ref={ref} />;
}

/* ------------------------------------------------------------------ */
/*  Drifting Camera                                                    */
/* ------------------------------------------------------------------ */

function DriftingCamera({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const t = useRef(0);

  useFrame((_state, delta) => {
    if (reduced) return;
    t.current += delta * 0.15;
    camera.position.x = Math.sin(t.current * 0.3) * 1.5;
    camera.position.y = Math.cos(t.current * 0.2) * 0.8;
    camera.lookAt(0, 0, -5);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props {
  onExplore: () => void;
}

export default function ChapterGalaxy({ onExplore }: Props) {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const [textStage, setTextStage] = useState(0);

  const starCount = isMobile ? 1000 : 3000;
  const galaxyStarCount = isMobile ? 800 : 2000;
  const nebulaCount = isMobile ? 120 : 300;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setTextStage(1), 1200));
    timers.push(setTimeout(() => setTextStage(2), 4000));
    timers.push(setTimeout(() => setTextStage(3), 7000));
    timers.push(setTimeout(() => setTextStage(4), 10000));
    return () => timers.forEach(clearTimeout);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduced ? 0.3 : 1.4, ease: [0.25, 0.46, 0.45, 0.94] as any },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: 'blur(6px)',
      transition: { duration: reduced ? 0.2 : 0.8 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduced ? 0.3 : 1.2, ease: 'easeOut' as any },
    },
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a1a',
      }}
    >
      {/* Three.js Canvas */}
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <fog attach="fog" args={['#0a0a1a', 30, 80]} />

        {/* Background stars from drei */}
        <Stars
          radius={60}
          depth={60}
          count={starCount}
          factor={isMobile ? 3 : 4}
          saturation={0.1}
          fade
          speed={reduced ? 0 : 0.5}
        />

        {/* Nebula atmosphere */}
        <NebulaParticles count={nebulaCount} reduced={reduced} />

        {/* Spiral galaxy */}
        <SpiralGalaxy starCount={galaxyStarCount} reduced={reduced} />

        {/* Shooting stars */}
        <ShootingStars reduced={reduced} />

        {/* Camera drift */}
        <DriftingCamera reduced={reduced} />

        {/* Subtle ambient light */}
        <ambientLight intensity={0.05} />
      </Canvas>

      {/* Nebula gradient overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 80% 60% at 30% 40%, rgba(123, 45, 142, 0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 70% 60%, rgba(27, 73, 101, 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 60%)
          `,
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
          padding: '0 1.5rem',
        }}
      >
        <AnimatePresence mode="wait">
          {textStage === 1 && (
            <motion.p
              key="line1"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.5rem' : '2.4rem',
                color: 'rgba(240, 240, 255, 0.9)',
                letterSpacing: '0.15em',
                textAlign: 'center',
                textShadow: '0 0 30px rgba(123, 45, 142, 0.4)',
                margin: 0,
              }}
            >
              Somewhere in the universe...
            </motion.p>
          )}

          {textStage === 2 && (
            <motion.p
              key="line2"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.5rem' : '2.4rem',
                color: 'rgba(240, 240, 255, 0.9)',
                letterSpacing: '0.15em',
                textAlign: 'center',
                textShadow: '0 0 30px rgba(27, 73, 101, 0.4)',
                margin: 0,
              }}
            >
              On the 5th of November, 2005...
            </motion.p>
          )}

          {textStage === 3 && (
            <motion.p
              key="line3"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: isMobile ? '1.5rem' : '2.4rem',
                color: 'rgba(212, 175, 55, 0.95)',
                letterSpacing: '0.18em',
                textAlign: 'center',
                textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
                margin: 0,
              }}
            >
              Something remarkable began.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Explore button */}
        <AnimatePresence>
          {textStage >= 4 && (
            <motion.div
              key="cta"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                pointerEvents: 'auto',
              }}
            >
              <motion.button
                onClick={onExplore}
                whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(212, 175, 55, 0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: '#f0f0ff',
                  background: 'linear-gradient(135deg, rgba(123, 45, 142, 0.25) 0%, rgba(27, 73, 101, 0.25) 50%, rgba(212, 175, 55, 0.2) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '4px',
                  padding: isMobile ? '1rem 2rem' : '1.2rem 3rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 0 25px rgba(123, 45, 142, 0.15), inset 0 0 20px rgba(212, 175, 55, 0.05)',
                  transition: 'box-shadow 0.4s ease',
                }}
              >
                Explore the Universe
              </motion.button>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ opacity: 0.5 }}
              >
                <ChevronDown size={24} color="rgba(240, 240, 255, 0.6)" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom vignette */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30vh',
          background: 'linear-gradient(to top, #0a0a1a 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </div>
  );
}
