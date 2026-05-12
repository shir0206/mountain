import {
  DEVICE,
  DEVICE_TIER,
  type DeviceType,
  type DeviceTier,
  type DeviceDetectionResult,
} from "./types";
import { DEVICE_DETECTION_CONFIG } from "./breakpoints";

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
 * Detect device tier using hardware heuristics.
 * - WEAK_MOBILE: old iPhones (≤4 cores), budget Androids (≤4 cores)
 * - MOBILE: modern phones / tablets
 * - DESKTOP: everything else
 */
export function detectDeviceTier(
  userAgent: string,
  viewportWidth: number
): DeviceTier {
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  if (!isMobile) return DEVICE_TIER.DESKTOP;

  const cores = navigator.hardwareConcurrency || 2;
  const isOldIOS = /iPhone/i.test(userAgent) && cores <= 4;
  const isBudgetAndroid = /Android/i.test(userAgent) && cores <= 4;

  if (isOldIOS || isBudgetAndroid) return DEVICE_TIER.WEAK_MOBILE;
  return DEVICE_TIER.MOBILE;
}

export function detectDevice(): DeviceDetectionResult {
  const userAgent = navigator.userAgent;
  const viewportWidth = window.innerWidth;
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  const type: DeviceType = isMobile ? DEVICE.MOBILE : DEVICE.DESKTOP;
  const tier = detectDeviceTier(userAgent, viewportWidth);

  return {
    type,
    tier,
    isMobile,
    userAgent,
    viewportWidth,
  };
}