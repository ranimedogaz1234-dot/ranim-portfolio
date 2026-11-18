import * as THREE from 'three';
import { POSE } from './butterflyRig';

/**
 * Shared articulated-wing material for every WebGL butterfly (hero + small ones).
 *
 * Each wing plane is bent per vertex instead of rotating rigidly (the "cardboard" look):
 *  - the root follows the beat; the tip and the hindwing trail it → the membrane flexes;
 *  - an asymmetric beat curve: a slightly quicker downstroke, a softer upstroke;
 *  - chordwise camber and a small wing-tip curl against the stroke;
 * Rotation is about the body axis (x = 0), so a wing never crosses the body.
 */
export const wingVertexShader = /* glsl */ `
  uniform float uPhase;   // beat phase (radians)
  uniform float uAmp;     // beat amplitude (radians)
  uniform float uRest;    // resting raise (radians)
  uniform float uWidth;   // wing span from the hinge
  uniform float uFlex;    // membrane camber amount
  varying vec2 vUv;
  varying float vAng;

  float beat(float p) { return 0.5 - 0.5 * cos(p + 0.35 * sin(p)); }

  void main() {
    vUv = uv;
    vec3 p = position;
    float d = clamp(abs(p.x) / uWidth, 0.0, 1.0);      // 0 at the body … 1 at the tip
    float hind = smoothstep(0.55, 0.15, uv.y);           // lower part of the wing
    float lag = d * 0.6 + hind * 0.38;                   // tips and hindwing trail the root
    float a = uRest + uAmp * beat(uPhase - lag);
    vAng = a;
    float r = abs(p.x);
    p.x = sign(p.x) * r * cos(a);
    p.z = r * sin(a);
    // camber: the outer membrane bends against the stroke, strongest at the tip
    float stroke = sin(uPhase - lag - 1.2);
    p.z += uFlex * d * d * stroke * (0.6 + 0.4 * (1.0 - hind));
    // wing-tip curl: the very edge trails a little more
    p.z += uFlex * 0.45 * d * d * d * sin(uPhase - lag - 1.9);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const wingFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uMapPearl;
  uniform float uTime;
  uniform float uLight;
  uniform float uSide;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vAng;

  void main() {
    vec4 c = mix(texture2D(uMap, vUv), texture2D(uMapPearl, vUv), uLight);
    if (c.a < 0.004) discard;
    // reflection band sweeping across the glass as the wing tilts
    float s = (uSide < 0.0 ? 1.0 - vUv.x : vUv.x) * 0.85 + vUv.y * 0.55 + vAng * 1.8 - uTime * 0.035;
    float band = pow(0.5 + 0.5 * sin(s * 6.2831), 22.0);
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + vUv.y * 0.55 + vAng * 0.9 + uTime * 0.025));
    irid = mix(vec3(0.82, 0.72, 1.0), irid, 0.5);
    // the pearl (soft-theme) wings are already light: a softer reflection keeps them from blowing out
    vec3 col = c.rgb + band * irid * mix(0.42, 0.2, uLight) * c.a;
    col = mix(col, min(col, vec3(0.97)), uLight);
    gl_FragColor = vec4(col, c.a * uOpacity);
  }
`;

export function makeWingGeometry(width: number, height: number, side: -1 | 1, segments = [48, 40] as [number, number]) {
  const g = new THREE.PlaneGeometry(width, height, segments[0], segments[1]);
  g.translate((side * width) / 2, 0, 0);
  return g;
}

export function makeWingMaterial(map: THREE.Texture, pearl: THREE.Texture, side: -1 | 1, width: number, light: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uMapPearl: { value: pearl },
      uTime: { value: 0 },
      uLight: { value: light },
      uSide: { value: side },
      uPhase: { value: 0 },
      uAmp: { value: 0 },
      uRest: { value: (POSE.restDeg * Math.PI) / 180 },
      uWidth: { value: width },
      uFlex: { value: 0 },
      uOpacity: { value: 1 },
    },
    vertexShader: wingVertexShader,
    fragmentShader: wingFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
