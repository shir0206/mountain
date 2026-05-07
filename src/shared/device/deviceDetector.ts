import { DEVICE, type DeviceType, type DeviceDetectionResult } from "./types";
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
  const userAgent = navigator.userAgent;
  const viewportWidth = window.innerWidth;
  const isMobile = isMobileDevice(userAgent, viewportWidth);
  const type: DeviceType = isMobile ? DEVICE.MOBILE : DEVICE.DESKTOP;

  return {
    type,
    isMobile,
    isDesktop: !isMobile,
    userAgent,
    viewportWidth,
  };
}
