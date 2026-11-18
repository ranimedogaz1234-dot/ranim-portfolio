'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLASS_BG, GLASS_BG_SIZE } from './wavesAssets';

/**
 * Animated liquid-glass background.
 *
 * Draws Ranim's final background renders (soft and dark) full-screen and brings the glass to
 * life in the shader — the image is never just moved around:
 *  - a slow, layered flow field bends the glass ribbons (only inside the wave regions, so the
 *    open background never warps); frequencies are incommensurate, so no loop is visible;
 *  - soft reflections travel across the glass, following the render's own highlights
 *    (detail = pixel − blurred mip level), with a faint iridescent drift;
 *  - the bottom band is gently compressed toward the lower edge so the waves sit slightly
 *    lower and smaller, leaving the content area open.
 * Mipmapped trilinear sampling keeps the glass smooth at any screen size.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uLightTex;
  uniform sampler2D uDarkTex;
  uniform vec2 uRes;
  uniform vec2 uSize;
  uniform float uTime;
  uniform float uDark;
  uniform float uAnchorX;   // horizontal focus when the screen is narrower than the image
  uniform float uSquash;    // screen height (0–1) the bottom wave band is compressed into
  uniform float uAmp;       // flow strength (lower on phones)
  uniform float uTuck;      // how far the top-left piece is pushed into its corner
  uniform float uMobile;    // 1 on phones: uniform-scale framing of the two glass bands
  uniform float uZoom;      // phones: image width as a multiple of the screen width
  uniform vec2 uAxis;       // phones: horizontal focus of the bottom band (x) and the top band (y)
  varying vec2 vUv;

  vec2 cover(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uSize.x / uSize.y;
    vec2 s = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    float ax = clamp(uAnchorX, s.x * 0.5, 1.0 - s.x * 0.5);
    return vec2((uv.x - 0.5) * s.x + ax, (uv.y - 0.5) * s.y + 0.5);
  }

  vec4 sampleBg(vec2 uv, float bias) {
    return mix(texture2D(uLightTex, uv, bias), texture2D(uDarkTex, uv, bias), uDark);
  }

  void main() {
    const float B = 0.46;   // top of the wave band in the image
    const float T = 0.70;   // from here up: the top band (top-left glass)
    vec2 img;
    if (uMobile > 0.5) {
      // Phones: the render keeps its proportions (one uniform scale, uZoom × the screen width),
      // so the glass ribbons are never stretched. The bottom band sits on the lower edge, the
      // top band in the upper corner, each framed on its best part; only the empty background
      // between them is stretched, and the frames meet there, where nothing can show a seam.
      float t = vUv.y;
      float f = uRes.y / (uRes.x * uZoom * uSize.y / uSize.x); // image heights per screen height
      float hs = B / f;                  // screen height of the bottom band
      float ts = 1.0 - (1.0 - T) / f;    // screen height where the top band starts
      float yLow = t * f;
      float yTop = 1.0 - (1.0 - t) * f;
      float yMid = B + (t - hs) * ((T - B) / max(ts - hs, 0.001));
      float y1 = mix(yLow, yMid, smoothstep(hs - 0.04, hs + 0.04, t));
      img.y = mix(y1, yTop, smoothstep(ts - 0.04, ts + 0.04, t));
      float ax = mix(uAxis.x, uAxis.y, smoothstep(hs, ts, t));
      img.x = (vUv.x - 0.5) / uZoom + ax;
    } else {
    img = cover(vUv);
    // Smaller bottom waves: the render's wave band (image y 0 … 0.46) is shown in only the
    // bottom uSquash of the screen; the empty middle of the image absorbs the difference and
    // the top band (top-left glass) keeps its true scale. Joins are blended, so no crease.
    float t = img.y;
    float H = uSquash;      // top of the wave band on screen
    float yLow = t * (B / H);
    float yMid = B + (t - H) * ((T - B) / (T - H));
    float yTop = t;
    float y1 = mix(yLow, yMid, smoothstep(H - 0.05, H + 0.05, t));
    img.y = mix(y1, yTop, smoothstep(T - 0.06, T + 0.02, t));
    }
    // tuck the top-left glass piece slightly further into its corner (away from the logo):
    // near the corner we sample a little farther out, which compresses the piece toward it
    vec2 corner = vec2(0.0, 1.0);
    vec2 rel = (img - corner) * vec2(1.0, 1.6);
    float wc0 = 1.0 - smoothstep(0.0, 0.55, length(rel));
    img = corner + (img - corner) * (1.0 + uTuck * wc0);

    // where the glass is: the bottom band and the top-left corner piece
    float wBottom = 1.0 - smoothstep(0.30, 0.52, img.y);
    float wCorner = 1.0 - smoothstep(0.16, 0.42, length(vec2(img.x * 0.9, (1.0 - img.y) * 1.5)));
    float w = max(wBottom, wCorner);

    // slow layered flow; faded at the frame edges so nothing is pulled in from outside
    float tt = uTime;
    float edgeX = smoothstep(0.0, 0.03, min(img.x, 1.0 - img.x));
    float edgeY = smoothstep(0.0, 0.03, min(img.y, 1.0 - img.y));
    vec2 d;
    d.y = sin(img.x * 4.6 - tt * 0.31 + sin(img.x * 1.9 + tt * 0.113) * 1.3) * 0.0062
        + sin(img.x * 10.7 + tt * 0.47 + 1.7) * 0.0018;
    d.x = sin(img.y * 6.3 + tt * 0.23 + img.x * 2.1) * 0.0034
        + sin(img.y * 13.1 - tt * 0.37) * 0.0011;
    vec2 uv = img + vec2(d.x * edgeX, d.y * edgeY) * w * uAmp;

    vec3 c = sampleBg(uv, 0.0).rgb;
    vec3 blur = sampleBg(uv, 3.5).rgb;
    float detail = max(dot(c - blur, vec3(0.333)), 0.0);   // the glass's own highlights

    // a soft reflection that travels slowly along the ribbons
    float sweep = exp(-pow((img.x * 0.85 - img.y * 0.55 - (fract(tt * 0.021) * 2.4 - 0.9)) * 4.2, 2.0));
    float shimmer = 0.5 + 0.5 * sin(img.x * 18.0 - tt * 0.9 + img.y * 9.0);
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + img.x * 0.6 + img.y * 0.4 + tt * 0.015));
    irid = mix(vec3(0.85, 0.78, 1.0), irid, mix(0.35, 0.22, uDark));   // restrained in the dark theme
    vec3 col = c;
    col += w * detail * (sweep * 1.5 + shimmer * 0.25) * irid;
    col += w * sweep * 0.025 * mix(vec3(1.0), vec3(0.75, 0.65, 1.0), uDark);
    gl_FragColor = vec4(min(col, vec3(1.0)), 1.0);
  }
`;

interface Props {
  dark: boolean;
  animate: boolean;
  onReady: () => void;
}

function WavesPlane({ dark, animate, onReady }: Props) {
  const [lightTex, darkTex] = useLoader(THREE.TextureLoader, [GLASS_BG.light, GLASS_BG.dark]) as THREE.Texture[];
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const darkValue = useRef(dark ? 1 : 0);
  const time = useRef(0);

  const material = useMemo(() => {
    for (const tex of [lightTex!, darkTex!]) {
      tex.colorSpace = THREE.NoColorSpace; // the renders' colours pass through untouched
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
    }
    return new THREE.ShaderMaterial({
      uniforms: {
        uLightTex: { value: lightTex },
        uDarkTex: { value: darkTex },
        uRes: { value: new THREE.Vector2(1, 1) },
        uSize: { value: new THREE.Vector2(GLASS_BG_SIZE.width, GLASS_BG_SIZE.height) },
        uTime: { value: 0 },
        uDark: { value: darkValue.current },
        uAnchorX: { value: 0.5 },
        uSquash: { value: 0.22 },
        uTuck: { value: 0.5 },
        uAmp: { value: 1 },
        uMobile: { value: 0 },
        uZoom: { value: 1.7 },
        uAxis: { value: new THREE.Vector2(0.66, 0.3) },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
  }, [lightTex, darkTex, gl]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  useEffect(() => () => {
    material.dispose();
    geometry.dispose();
  }, [material, geometry]);

  useEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(onReady);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => invalidate(), [dark, animate, size.width, size.height, invalidate]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (animate) time.current += dt;
    const target = dark ? 1 : 0;
    darkValue.current += (target - darkValue.current) * (1 - Math.exp(-dt * 4));
    const u = material.uniforms;
    const portrait = size.width < size.height;
    u.uRes!.value.set(size.width, size.height);
    u.uTime!.value = time.current;
    u.uDark!.value = darkValue.current;
    u.uAnchorX!.value = portrait ? 0.3 : 0.5; // phones: keep the top-left glass in frame
    u.uAmp!.value = size.width < 768 ? 0.7 : 1;
    u.uMobile!.value = size.width < 768 ? 1 : 0;
    if (Math.abs(target - darkValue.current) > 0.002) state.invalidate();
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}

export default function WavesGL(props: Props) {
  return (
    <Canvas
      // size from layout box (offsetWidth/Height), not getBoundingClientRect: the hero flyer is
      // rotated while flying in, and a rotated box's bounding rect is larger — the canvas used
      // to get stuck oversized and offset, so the butterfly and its effects didn't line up
      resize={{ offsetSize: true }}
      className="backdrop__canvas"
      flat
      linear
      dpr={[1, 1.5]}
      frameloop={props.animate ? 'always' : 'demand'}
      gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0 }}
    >
      <WavesPlane {...props} />
    </Canvas>
  );
}
