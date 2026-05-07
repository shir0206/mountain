export const DEVICE = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
} as const;

export type DeviceType = (typeof DEVICE)[keyof typeof DEVICE];

export interface DeviceDetectionResult {
  type: DeviceType;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
  viewportWidth: number;
}
