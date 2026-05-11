export const DEVICE = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
} as const;

export type DeviceType = (typeof DEVICE)[keyof typeof DEVICE];

export const DEVICE_TIER = {
  WEAK_MOBILE: "weak_mobile",
  MOBILE: "mobile",
  DESKTOP: "desktop",
} as const;

export type DeviceTier = (typeof DEVICE_TIER)[keyof typeof DEVICE_TIER];

export interface DeviceDetectionResult {
  type: DeviceType;
  tier: DeviceTier;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
  viewportWidth: number;
}
