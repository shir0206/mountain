/**
 * Device detection thresholds and patterns.
 */
export const DEVICE_DETECTION_CONFIG = {
  mobileViewportThreshold: 768,
  mobileUserAgentPatterns: [
    /iPhone/i,
    /iPad/i,
    /Android/i,
    /BlackBerry/i,
    /IEMobile/i,
    /Opera Mini/i,
  ],
} as const;
