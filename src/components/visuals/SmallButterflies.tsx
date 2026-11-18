'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { POSE, WING_TEXTURE, createFlapState, stepFlap, type FlapState } from './butterflyRig';
import { makeWingGeometry, makeWingMaterial } from './wingShader';
import { scrollState } from '@/lib/scrollState';
import { setSmallWingsReady } from '@/lib/smallWings';

const DEG = Math.PI / 180;
const WING_H = 1;
const WING_W = WING_H * (WING_TEXTURE.width / WING_TEXTURE.height);
const FOV = 30;
const CAM_Z = 10;
const MAX = 6;

/**
 * Draws every small butterfly (the two hero companions and the two travellers) with the same
 * articulated glass wings as the hero butterfly, in one transparent full-screen canvas.
 *
 * Each butterfly follows a DOM anchor (`[data-wing-anchor]`) every frame — the anchors keep
 * their existing GSAP flight paths, sizes, fades and tilts — so only one extra WebGL context is
 * used. Each has its own seed: wingbeat speed, phase and rhythm differ, so they never sync.
 */
function Flock({ animate, light }: { animate: boolean; light: boolean }) {
  const loaded = useLoader(THREE.TextureLoader, [
    WING_TEXTURE.smallLeft,
    WING_TEXTURE.smallRight,
    WING_TEXTURE.smallPearlLeft,
    WING_TEXTURE.smallPearlRight,
  ]) as THREE.Texture[];
  const [l, r, pl, pr] = loaded as [THREE.Texture, THREE.Texture, THREE.Texture, THREE.Texture];
  const size = useThree((s) => s.size);
  const lightValue = useRef(light ? 1 : 0);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const anchors = useRef<HTMLElement[]>([]);
  const frame = useRef(0);

  useMemo(() => {
    for (const tex of [l, r, pl, pr]) {
      tex.colorSpace = THREE.NoColorSpace;
      tex.needsUpdate = true;
    }
  }, [l, r, pl, pr]);

  const geos = useMemo(() => [makeWingGeometry(WING_W, WING_H, -1, [20, 16]), makeWingGeometry(WING_W, WING_H, 1, [20, 16])], []);
  // one material pair + flap state per butterfly (each beats on its own)
  const birds = useMemo(
    () =>
      Array.from({ length: MAX }, (_, i) => ({
        mats: [makeWingMaterial(l, pl, -1, WING_W, lightValue.current), makeWingMaterial(r, pr, 1, WING_W, lightValue.current)],
        flap: createFlapState(1.3 + i * 2.17) as FlapState,
      })),
    [l, r, pl, pr],
  );

  useEffect(() => () => {
    geos.forEach((g) => g.dispose());
    birds.forEach((b) => b.mats.forEach((m) => m.dispose()));
  }, [geos, birds]);

  useEffect(() => {
    setSmallWingsReady(true);
    return () => setSmallWingsReady(false);
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (frame.current++ % 30 === 0) anchors.current = Array.from(document.querySelectorAll<HTMLElement>('[data-wing-anchor]')).slice(0, MAX);
    const k = (2 * Math.tan((FOV / 2) * DEG) * CAM_Z) / size.height; // world units per CSS px
    const targetLight = light ? 1 : 0;
    lightValue.current += (targetLight - lightValue.current) * (1 - Math.exp(-dt * 5));

    for (let i = 0; i < MAX; i++) {
      const g = groups.current[i];
      if (!g) continue;
      const el = anchors.current[i];
      if (!el || !el.isConnected) {
        g.visible = false;
        continue;
      }
      const host = (el.dataset.wingHost === 'parent' ? el.parentElement : el) ?? el;
      const cs = getComputedStyle(host);
      const opacity = parseFloat(cs.opacity) || 0;
      const rect = el.getBoundingClientRect();
      const w = el.offsetWidth;
      if (opacity < 0.01 || rect.bottom < -50 || rect.top > size.height + 50) {
        g.visible = false;
        continue;
      }
      g.visible = true;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      g.position.set((cx - size.width / 2) * k, -(cy - size.height / 2) * k, 0);
      g.scale.setScalar((w * k * 0.98) / (2 * WING_W));

      const bird = birds[i]!;
      const speed = parseFloat(el.dataset.wingSpeed ?? '1.4');
      stepFlap(bird.flap, dt, scrollState.velocity, animate, speed, 0);
      const amp = bird.flap.amp * DEG;
      const flex = animate ? 0.1 + 0.14 * bird.flap.boost : 0;
      const ph = bird.flap.phase;
      bird.mats.forEach((m, j) => {
        m.uniforms.uTime!.value = animate ? t : 0;
        m.uniforms.uLight!.value = lightValue.current;
        m.uniforms.uPhase!.value = j === 0 ? ph : ph - 0.07;
        m.uniforms.uAmp!.value = amp;
        m.uniforms.uFlex!.value = flex;
        m.uniforms.uOpacity!.value = opacity;
      });
      // CSS rotation of the anchor (GSAP banking) + the body answering each wingbeat
      const tr = cs.transform;
      const rot = tr && tr !== 'none' ? Math.atan2(new DOMMatrix(tr).b, new DOMMatrix(tr).a) : 0;
      const e = animate ? 0.6 + bird.flap.boost : 0;
      g.position.y += Math.sin(ph - 0.9) * 0.05 * e * g.scale.x;
      g.rotation.set(
        -(POSE.pitchDeg + Math.sin(ph - 0.5) * 2.2 * e) * DEG,
        (POSE.yawDeg + Math.sin(t * 0.4 + i) * 6) * DEG,
        -rot - POSE.bankDeg * DEG + Math.sin(t * 0.6 + i * 1.3) * 0.05,
      );
    }
  });

  return (
    <>
      {birds.map((b, i) => (
        <group key={i} ref={(n) => void (groups.current[i] = n)} visible={false}>
          <mesh geometry={geos[0]} material={b.mats[0]} frustumCulled={false} />
          <mesh geometry={geos[1]} material={b.mats[1]} frustumCulled={false} />
        </group>
      ))}
    </>
  );
}

export default function SmallButterflies({ animate, light }: { animate: boolean; light: boolean }) {
  // without animation the anchors still move with the page: redraw on scroll
  const invalidateRef = useRef<() => void>(() => undefined);
  useEffect(() => {
    if (animate) return;
    const on = () => invalidateRef.current();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [animate]);
  return (
    <Canvas
      // size from layout box (offsetWidth/Height), not getBoundingClientRect: the hero flyer is
      // rotated while flying in, and a rotated box's bounding rect is larger — the canvas used
      // to get stuck oversized and offset, so the butterfly and its effects didn't line up
      resize={{ offsetSize: true }}
      flat
      linear
      dpr={[1, 1.5]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 50 }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0);
        invalidateRef.current = invalidate;
      }}
      aria-hidden="true"
    >
      <Flock animate={animate} light={light} />
    </Canvas>
  );
}
