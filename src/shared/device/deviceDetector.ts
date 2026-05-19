import {
  DEVICE,
  DEVICE_TIER,
  type DeviceType,
  type DeviceTier,
  type DeviceDetectionResult,
} from "./types";
import { DEVICE_DETECTION_CONFIG } from "./breakpoints";

// Known weak GPU patterns (budget/old mobile GPUs)
const WEAK_GPU_PATTERNS = [
  /Mali-4/i,
  /Mali-T[1-6]/i,
  /Adreno\s*[23]/i,
  /PowerVR\s*SGX/i,
  /Vivante/i,
  /VideoCore/i,
];

// Powerful mobile GPUs that should get DESKTOP treatment
const POWERFUL_MOBILE_PATTERNS = [/Apple M[1-9]/i, /Apple GPU/i];

/**
 * Detect GPU renderer string via a throwaway WebGL context.
 * Returns empty string if unavailable.
 */
function getGPURenderer(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "";
    const debugInfo = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_debug_renderer_info"
    );
    if (!debugInfo) return "";
    const renderer = (gl as WebGLRenderingContext).getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL
    );
    // Lose context to free resources immediately
    const loseCtx = (gl as WebGLRenderingContext).getExtension(
      "WEBGL_lose_context"
    );
    if (loseCtx) loseCtx.loseContext();
    return renderer || "";
  } catch {
    return "";
  }
}

export function isMobileDevice(
  userAgent: string,
  viewportWidth: number
): boolean {
  if (viewportWidth < DEVICE_DETECTION_CONFIG.mobileViewportThreshold) {
    return true;
  }
  return DEVICE_DETECTION_CONFIG.mobileUserAgentPatterns.some((pattern) =>
    pattern.test(userAgent)
  );
}

/**
 * Detect device tier using hardware heuristics + GPU info.
 * - WEAK_MOBILE: old iPhones (≤4 cores), budget Androids (≤4 cores), weak GPUs
 * - MOBILE: modern phones / tablets
 * - DESKTOP: non-mobile, or powerful mobile GPUs (iPad M-series)
 */
export function detectDeviceTier(
  userAgent: string,
  viewportWidth: number,
  gpuRenderer: string
): DeviceTier {
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  if (!isMobile) return DEVICE_TIER.DESKTOP;

  // Promote powerful mobile devices (iPad with M-chip, etc.) to DESKTOP
  const cores = navigator.hardwareConcurrency || 2;
  const isPowerfulMobileGPU = POWERFUL_MOBILE_PATTERNS.some((p) =>
    p.test(gpuRenderer)
  );
  const isIPadWithHighCores = /iPad/i.test(userAgent) && cores >= 6;
  if (isPowerfulMobileGPU || isIPadWithHighCores) return DEVICE_TIER.DESKTOP;

  // Detect weak GPUs
  const isWeakGPU = WEAK_GPU_PATTERNS.some((p) => p.test(gpuRenderer));
  if (isWeakGPU) return DEVICE_TIER.WEAK_MOBILE;

  // Core-count fallback
  const isOldIOS = /iPhone/i.test(userAgent) && cores <= 4;
  const isBudgetAndroid = /Android/i.test(userAgent) && cores <= 4;
  if (isOldIOS || isBudgetAndroid) return DEVICE_TIER.WEAK_MOBILE;

  return DEVICE_TIER.MOBILE;
}

export function detectDevice(): DeviceDetectionResult {
  const userAgent = navigator.userAgent;
  const viewportWidth = window.innerWidth;
  const nativeDpr = window.devicePixelRatio || 1;
  const gpuRenderer = getGPURenderer();
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  const type: DeviceType = isMobile ? DEVICE.MOBILE : DEVICE.DESKTOP;
  const tier = detectDeviceTier(userAgent, viewportWidth, gpuRenderer);

  return {
    type,
    tier,
    isMobile,
    userAgent,
    viewportWidth,
    nativeDpr,
    gpuRenderer,
  };
}