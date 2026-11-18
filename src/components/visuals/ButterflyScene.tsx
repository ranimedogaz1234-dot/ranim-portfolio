'use client';

import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { POSE, WING_TEXTURE, createFlapState, stepFlap } from './butterflyRig';
import { makeWingGeometry, makeWingMaterial } from './wingShader';
import { scrollState } from '@/lib/scrollState';
import { heroIntro } from '@/lib/heroIntro';

const DEG = Math.PI / 180;
const WING_H = 3.2;
const WING_W = WING_H * (WING_TEXTURE.width / WING_TEXTURE.height);
/** Body landmarks measured on the wing artwork (fraction of its height, from the top). */
const THORAX_V = 0.53;
const ABDOMEN_END_V = 0.82;
const bodyY = (v: number) => (0.5 - v) * WING_H;

/**
 * Writes where the butterfly's body actually is on screen (after its 3D pose and hover) onto
 * the stage as CSS variables, in stage pixels. The orbit lines and the light platform are laid
 * out from these, so they stay aligned at every screen size, while resizing and while hovering.
 *  --bf-cx / --bf-cy  thorax (orbit centre)      --bf-tail  abdomen tip, resting (platform)
 *  --bf-w             wingspan in px            --bf-lift  hover offset in px (+ = higher)
 */
function useBodyAnchor(anchor: RefObject<HTMLElement | null> | undefined) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const last = useRef('');
  return (group: THREE.Group | null, scale: number) => {
    const el = anchor?.current;
    if (!el || !group) return;
    const offX = (el.offsetWidth - size.width) / 2; // canvas is centred on the stage
    const offY = (el.offsetHeight - size.height) / 2;
    const toStage = (y: number) => {
      tmp.set(0, y, 0);
      group.localToWorld(tmp);
      tmp.project(camera);
      return [((tmp.x + 1) / 2) * size.width + offX, ((1 - tmp.y) / 2) * size.height + offY] as const;
    };
    const pxPerUnit = size.height / viewport.height;
    const lift = group.position.y * pxPerUnit; // hover, screen px (+ = up)
    const [cx, cy] = toStage(bodyY(THORAX_V));
    const [, ty] = toStage(bodyY(ABDOMEN_END_V));
    const v = [cx, cy, ty + lift, 2 * WING_W * scale * pxPerUnit, lift].map((n) => n.toFixed(1));
    const key = v.join(',');
    if (key === last.current) return;
    last.current = key;
    el.style.setProperty('--bf-cx', `${v[0]}px`);
    el.style.setProperty('--bf-cy', `${v[1]}px`);
    el.style.setProperty('--bf-tail', `${v[2]}px`);
    el.style.setProperty('--bf-w', `${v[3]}px`);
    el.style.setProperty('--bf-lift', `${v[4]}px`);
    el.style.setProperty('--bf-lift-n', (lift / 100).toFixed(3)); // unitless, for scale()
  };
}

interface WingsProps {
  animate: boolean;
  light: boolean;
  fit: number;
  onReady?: () => void;
  anchor?: RefObject<HTMLElement | null>;
}

function Wings({ animate, light, fit, onReady, anchor }: WingsProps) {
  const loaded = useLoader(THREE.TextureLoader, [
    WING_TEXTURE.left,
    WING_TEXTURE.right,
    WING_TEXTURE.pearlLeft,
    WING_TEXTURE.pearlRight,
  ]) as THREE.Texture[];
  const [leftTex, rightTex, leftPearl, rightPearl] = loaded as [THREE.Texture, THREE.Texture, THREE.Texture, THREE.Texture];
  const gl = useThree((s) => s.gl);
  const viewport = useThree((s) => s.viewport);
  const invalidate = useThree((s) => s.invalidate);
  const group = useRef<THREE.Group>(null);
  const flap = useMemo(() => createFlapState(0.4), []);
  const writeAnchor = useBodyAnchor(anchor);
  const lightValue = useRef(light ? 1 : 0);

  useMemo(() => {
    for (const tex of [leftTex, rightTex, leftPearl, rightPearl]) {
      tex.colorSpace = THREE.NoColorSpace; // pass the artwork's colours through untouched
      tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
    }
  }, [leftTex, rightTex, leftPearl, rightPearl, gl]);

  const [leftGeo, rightGeo] = useMemo(() => [makeWingGeometry(WING_W, WING_H, -1), makeWingGeometry(WING_W, WING_H, 1)], []);
  const [leftMat, rightMat] = useMemo(
    () => [makeWingMaterial(leftTex, leftPearl, -1, WING_W, lightValue.current), makeWingMaterial(rightTex, rightPearl, 1, WING_W, lightValue.current)],
    [leftTex, rightTex, leftPearl, rightPearl],
  );

  useEffect(() => () => {
    leftGeo.dispose();
    rightGeo.dispose();
    leftMat.dispose();
    rightMat.dispose();
  }, [leftGeo, rightGeo, leftMat, rightMat]);

  // Textures are loaded once this component mounts: tell the hero to hide the CSS poster
  // after the first WebGL frame has been drawn.
  useEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => onReady?.());
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => invalidate(), [light, animate, invalidate]);

  const scale = Math.min((viewport.width * fit) / (WING_W * 2), (viewport.height * fit) / WING_H);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    stepFlap(flap, dt, scrollState.velocity, animate, 1, heroIntro.boost);
    const targetLight = light ? 1 : 0;
    lightValue.current += (targetLight - lightValue.current) * (1 - Math.exp(-dt * 5));
    const amp = flap.amp * DEG;
    const flex = animate ? 0.1 + 0.16 * flap.boost : 0;
    // the right wing runs a hair behind the left: never perfectly mirrored
    const phases = [flap.phase, flap.phase - 0.06];
    [leftMat, rightMat].forEach((m, i) => {
      m.uniforms.uTime!.value = animate ? t : 0;
      m.uniforms.uLight!.value = lightValue.current;
      m.uniforms.uPhase!.value = phases[i]!;
      m.uniforms.uAmp!.value = amp;
      m.uniforms.uFlex!.value = flex;
    });
    if (group.current) {
      // the body answers each wingbeat: it lifts on the downstroke and pitches slightly,
      // on top of a slow hover; during the entrance the 3D turn comes from heroIntro
      const e = animate ? 0.5 + flap.boost : 0;
      const lift = Math.sin(flap.phase - 0.9) * 0.035 * e;
      const pitch = Math.sin(flap.phase - 0.5) * 0.9 * e;
      group.current.position.y = (animate ? Math.sin(t * 0.7) * 0.06 : 0) + lift;
      group.current.rotation.x = -(POSE.pitchDeg + heroIntro.pitch + pitch) * DEG;
      group.current.rotation.y = (POSE.yawDeg + heroIntro.yaw) * DEG + (animate ? Math.sin(t * 0.31) * 0.03 : 0);
      group.current.rotation.z = -(POSE.bankDeg + heroIntro.bank) * DEG + (animate ? Math.sin(t * 0.45) * 0.02 : 0);
      group.current.updateMatrixWorld();
      writeAnchor(group.current, scale);
    }
    if (Math.abs(targetLight - lightValue.current) > 0.002) state.invalidate();
  });

  return (
    <group ref={group} scale={scale} rotation={[-POSE.pitchDeg * DEG, POSE.yawDeg * DEG, -POSE.bankDeg * DEG]}>
      <mesh geometry={leftGeo} material={leftMat} frustumCulled={false} />
      <mesh geometry={rightGeo} material={rightMat} frustumCulled={false} />
    </group>
  );
}

interface SceneProps {
  animate: boolean;
  light: boolean;
  visible: boolean;
  fit?: number;
  onReady?: () => void;
  /** Element that receives the body-position CSS variables (the hero stage). */
  anchor?: RefObject<HTMLElement | null>;
}

/** WebGL glass butterfly. Rendered inside the hero stage; lazy-loaded by HeroButterfly. */
export default function ButterflyScene({ animate, light, visible, fit = 0.84, onReady, anchor }: SceneProps) {
  return (
    <Canvas
      // size from layout box (offsetWidth/Height), not getBoundingClientRect: the hero flyer is
      // rotated while flying in, and a rotated box's bounding rect is larger — the canvas used
      // to get stuck oversized and offset, so the butterfly and its effects didn't line up
      resize={{ offsetSize: true }}
      flat
      linear
      dpr={[1, 1.75]}
      frameloop={animate && visible ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 30, position: [0, 0, 8], near: 0.1, far: 50 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0 }}
    >
      <Wings animate={animate} light={light} fit={fit} onReady={onReady} anchor={anchor} />
    </Canvas>
  );
}
