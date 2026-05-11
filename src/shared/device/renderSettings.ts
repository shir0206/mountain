import { DEVICE_TIER, type DeviceTier } from "./types";

export interface RenderSettings {
  dpr: [number, number];
  shadows: false | "soft";
  antialias: boolean;
  postprocessing: boolean;
  particles: number;
  textureSize: number;
  farPlane: number;
  powerPreference: "default" | "high-performance";
}

const TIER_SETTINGS: Record<DeviceTier, RenderSettings> = {
  [DEVICE_TIER.WEAK_MOBILE]: {
    dpr: [1, 1],
    shadows: false,
    antialias: false,
    postprocessing: false,
    particles: 20,
    textureSize: 512,
    farPlane: 200,
    powerPreference: "default",
  },
  [DEVICE_TIER.MOBILE]: {
    dpr: [1, 1],
    shadows: false,
    antialias: false,
    postprocessing: false,
    particles: 100,
    textureSize: 1024,
    farPlane: 300,
    powerPreference: "default",
  },
  [DEVICE_TIER.TABLET]: {
    dpr: [1, 1.5],
    shadows: false,
    antialias: false,
    postprocessing: false,
    particles: 100,
    textureSize: 1024,
    farPlane: 300,
    powerPreference: "default",
  },
  [DEVICE_TIER.DESKTOP]: {
    dpr: [1, 2],
    shadows: "soft",
    antialias: true,
    postprocessing: true,
    particles: 1000,
    textureSize: 2048,
    farPlane: 600,
    powerPreference: "high-performance",
  },
};

export function getRenderSettings(tier: DeviceTier): RenderSettings {
  return TIER_SETTINGS[tier];
}
