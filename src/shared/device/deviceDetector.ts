import {
  DEVICE,
  EXPERIENCE_PROFILE,
  type DeviceType,
  type DeviceDetectionResult,
  type ExperienceProfile,
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

export function detectDevice(): DeviceDetectionResult {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const userAgent = navigator.userAgent;
  const viewportWidth = window.innerWidth;
  const deviceMemoryGb =
    typeof nav.deviceMemory === "number" ? nav.deviceMemory : null;
  const hardwareConcurrency =
    typeof navigator.hardwareConcurrency === "number"
      ? navigator.hardwareConcurrency
      : null;
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  const type: DeviceType = isMobile ? DEVICE.MOBILE : DEVICE.DESKTOP;
  const defaultProfile = detectDefaultProfile({
    isMobile,
    userAgent,
    deviceMemoryGb,
    hardwareConcurrency,
  });

  return {
    type,
    isMobile,
    isDesktop: !isMobile,
    userAgent,
    viewportWidth,
    deviceMemoryGb,
    hardwareConcurrency,
    defaultProfile,
  };
}

function detectDefaultProfile({
  isMobile,
  userAgent,
  deviceMemoryGb,
  hardwareConcurrency,
}: {
  isMobile: boolean;
  userAgent: string;
  deviceMemoryGb: number | null;
  hardwareConcurrency: number | null;
}): ExperienceProfile {
  const isiOS = /iPhone|iPad|iPod/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|Edg/i.test(userAgent);

  if (isMobile && (isiOS || isSafari)) {
    return EXPERIENCE_PROFILE.CINEMATIC;
  }

  if (isMobile) {
    return EXPERIENCE_PROFILE.HYBRID;
  }

  const lowMemory = deviceMemoryGb !== null && deviceMemoryGb <= 4;
  const lowCores = hardwareConcurrency !== null && hardwareConcurrency <= 4;
  const highMemory = deviceMemoryGb !== null && deviceMemoryGb >= 8;
  const highCores = hardwareConcurrency !== null && hardwareConcurrency >= 8;

  if (lowMemory || lowCores) {
    return EXPERIENCE_PROFILE.HYBRID;
  }

  if (highMemory && highCores) {
    return EXPERIENCE_PROFILE.FULL;
  }

  return EXPERIENCE_PROFILE.HYBRID;
}
