import { useCallback, useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import * as P from "../config/positions";
import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { useSceneContext } from "../../../context/scene/useSceneContext";
import { BROWSER_MODE } from "../../../context/portfolio/types";

// ─── Cloudy orb shader (inner layer) ────────────────────────────────────────
const orbVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const orbFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uBreath;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // Multi-octave noise for cloud turbulence
  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3d(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n = mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
    return n;
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; i++) {
      v += a * noise3d(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(fresnel, 0.0, 1.0);

    // Soft falloff — pow makes edges dissolve more
    float edgeFade = pow(fresnel, 1.5);

    // Animated cloud noise
    vec3 noisePos = vPosition * 3.5 + vec3(uTime * 0.15, uTime * 0.1, uTime * 0.12);
    float cloud = fbm(noisePos);
    cloud = smoothstep(0.2, 0.7, cloud);

    // Breathing modulates alpha
    float breathAlpha = 0.65 + uBreath * 0.15;

    // Final alpha: dissolves at edges via cloud + fresnel
    float alpha = edgeFade * cloud * breathAlpha;

    // Inner glow color
    vec3 col = mix(uColor, vec3(1.0), fresnel * 0.5);

    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Outer atmosphere shader (soft undefined halo) ──────────────────────────
const atmoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmoFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uBreath;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  float hash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3d(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
    return n;
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 3; i++) {
      v += a * noise3d(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(fresnel, 0.0, 1.0);

    // Very soft edge — inverted fresnel for rim glow
    float rim = 1.0 - fresnel;
    float edgeFade = pow(rim, 2.0) * pow(fresnel, 0.3);

    // Wispy cloud
    vec3 noisePos = vPosition * 2.5 + vec3(uTime * 0.08, uTime * 0.12, uTime * 0.06);
    float cloud = fbm(noisePos);
    cloud = smoothstep(0.25, 0.65, cloud);

    float breathAlpha = 0.4 + uBreath * 0.1;
    float alpha = edgeFade * cloud * breathAlpha;

    vec3 col = mix(uColor, vec3(1.0), 0.3);
    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Cross-ray shader (additive gradient) ───────────────────────────────────
const rayVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rayFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    // Fade from center to edges on both axes
    float fadeX = 1.0 - abs(vUv.x - 0.5) * 2.0;
    float fadeY = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float alpha = fadeX * fadeY * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export function PortalButton3D() {
  const { setBrowserMode } = usePortfolioContext();
  const { setRunIntro } = useSceneContext();

  const onClick = useCallback(() => {
    setBrowserMode(BROWSER_MODE.OPEN);
    setRunIntro(false);
  }, [setBrowserMode, setRunIntro]);

  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);
  const orbMatRef = useRef<THREE.ShaderMaterial>(null);
  const atmoMatRef = useRef<THREE.ShaderMaterial>(null);
  const coreRef = useRef<THREE.PointLight>(null);
  const [oriented, setOriented] = useState(false);
  const { camera } = useThree();

  // Orb shader material
  const orbUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#f9f6f1") },
      uBreath: { value: 0 },
    }),
    []
  );

  // Atmosphere shader material
  const atmoUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#f9f6f1") },
      uBreath: { value: 0 },
    }),
    []
  );

  // Ray shader materials
  const rayUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#f9f6f1") },
      uOpacity: { value: 0.6 },
    }),
    []
  );

  useFrame(({ clock }) => {
    // Orient group to face camera once
    if (!oriented && groupRef.current) {
      groupRef.current.lookAt(camera.position);
      setOriented(true);
    }

    const t = clock.getElapsedTime();

    // Breathing factor (0..1 oscillation)
    const breath = Math.sin(t * 0.8) * 0.5 + 0.5;

    // Ring slow rotation + subtle pulse
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.25;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.0) * 0.02);
    }

    // Orb breathing scale
    if (orbRef.current) {
      const s = 1 + breath * 0.08;
      orbRef.current.scale.setScalar(s);
    }

    // Shader uniforms
    if (orbMatRef.current) {
      orbMatRef.current.uniforms.uTime.value = t;
      orbMatRef.current.uniforms.uBreath.value = breath;
    }
    if (atmoMatRef.current) {
      atmoMatRef.current.uniforms.uTime.value = t;
      atmoMatRef.current.uniforms.uBreath.value = breath;
    }

    // Core light pulse synced with breath
    if (coreRef.current) {
      coreRef.current.intensity = 2 + breath * 1.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[P.DESK_X, P.DESK_Y + 2.5, P.DESK_Z - 0.5]}
      scale={0.8}
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* Gold metallic ring — Torus */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.5, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#c9a97d"
          metalness={0.6}
          roughness={0.15}
          emissive="#8a6530"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cloudy energy orb — inner */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <shaderMaterial
          ref={orbMatRef}
          vertexShader={orbVertexShader}
          fragmentShader={orbFragmentShader}
          uniforms={orbUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer atmosphere halo — undefined cloud border */}
      <mesh scale={1.35}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <shaderMaterial
          ref={atmoMatRef}
          vertexShader={atmoVertexShader}
          fragmentShader={atmoFragmentShader}
          uniforms={atmoUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Compass ray — horizontal */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[1.2, 0.025]} />
        <shaderMaterial
          vertexShader={rayVertexShader}
          fragmentShader={rayFragmentShader}
          uniforms={rayUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Compass ray — vertical */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[1.2, 0.025]} />
        <shaderMaterial
          vertexShader={rayVertexShader}
          fragmentShader={rayFragmentShader}
          uniforms={rayUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Core point light */}
      <pointLight
        ref={coreRef}
        color="#80eeff"
        intensity={2}
        distance={3}
        decay={2}
      />

      {/* Sparkles */}
      <Sparkles count={20} scale={1.6} size={2.5} speed={1.2} color="#f9f6f1" />

      {/* Label */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.0001}
        outlineBlur={0.15}
        outlineColor="#353535"
        outlineOffsetY={0.01}
        font={undefined}
      >
        Open Website
      </Text>
    </group>
  );
}
