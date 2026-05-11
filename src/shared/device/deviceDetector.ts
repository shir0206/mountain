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
 * - WEAK_MOBILE: old iPhones, budget Androids (≤4 cores AND ≤4 GB RAM)
 * - MOBILE: modern phones
 * - TABLET: tablets (iPad detected via UA + wide viewport)
 * - DESKTOP: everything else
 */
export function detectDeviceTier(
  userAgent: string,
  viewportWidth: number
): DeviceTier {
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  if (!isMobile) return DEVICE_TIER.DESKTOP;

  // Tablet heuristic: iPad UA or mobile UA with wide viewport
  const isTablet =
    /iPad/i.test(userAgent) || (isMobile && viewportWidth >= 768);
  if (isTablet) return DEVICE_TIER.TABLET;

  // Hardware heuristics for weak vs normal mobile
  const cores = navigator.hardwareConcurrency || 2;
  const memory =
    (navigator as unknown as { deviceMemory?: number }).deviceMemory || 2; // Chrome-only, fallback 2

  if (cores <= 4 && memory <= 4) return DEVICE_TIER.WEAK_MOBILE;
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
    isDesktop: !isMobile,
    userAgent,
    viewportWidth,
  };
}
