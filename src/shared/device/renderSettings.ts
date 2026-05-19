import { DEVICE_TIER, type DeviceTier } from "./types";

export interface RenderSettings {
  dpr: [number, number];
  shadows: false | true | "soft";
  shadowMapSize: number;
  antialias: boolean;
  postprocessing: boolean;
  particles: number;
  textureSize: number;
  farPlane: number;
  powerPreference: "default" | "high-performance";
}

// DPR caps per tier — we never exceed these regardless of native ratio
const DPR_CAPS: Record<DeviceTier, number> = {
  [DEVICE_TIER.WEAK_MOBILE]: 1.5,
  [DEVICE_TIER.MOBILE]: 2,
  [DEVICE_TIER.DESKTOP]: 3,
};

// DPR minimums per tier — ensures acceptable sharpness
const DPR_MINS: Record<DeviceTier, number> = {
  [DEVICE_TIER.WEAK_MOBILE]: 1,
  [DEVICE_TIER.MOBILE]: 1,
  [DEVICE_TIER.DESKTOP]: 1,
};

interface TierConfig {
  shadows: false | true | "soft";
  shadowMapSize: number;
  antialias: boolean;
  postprocessing: boolean;
  particles: number;
  textureSize: number;
  farPlane: number;
  powerPreference: "default" | "high-performance";
}

const TIER_CONFIG: Record<DeviceTier, TierConfig> = {
  [DEVICE_TIER.WEAK_MOBILE]: {
    shadows: false,
    shadowMapSize: 0,
    antialias: true,
    postprocessing: false,
    particles: 20,
    textureSize: 512,
    farPlane: 200,
    powerPreference: "default",
  },
  [DEVICE_TIER.MOBILE]: {
    shadows: true,
    shadowMapSize: 512,
    antialias: true,
    postprocessing: false,
    particles: 100,
    textureSize: 1024,
    farPlane: 300,
    powerPreference: "default",
  },
  [DEVICE_TIER.DESKTOP]: {
    shadows: "soft",
    shadowMapSize: 2048,
    antialias: true,
    postprocessing: true,
    particles: 1000,
    textureSize: 2048,
    farPlane: 600,
    powerPreference: "high-performance",
  },
};

/**
 * Compute render settings for a given tier + native screen DPR.
 * DPR range is [min, min(nativeDpr, cap)] — renders at native resolution
 * but never exceeds what the tier can handle smoothly.
 */
export function getRenderSettings(
  tier: DeviceTier,
  nativeDpr: number = window.devicePixelRatio || 1
): RenderSettings {
  const cap = DPR_CAPS[tier];
  const min = DPR_MINS[tier];
  const max = Math.min(nativeDpr, cap);

  return {
    ...TIER_CONFIG[tier],
    dpr: [min, max],
  };
}