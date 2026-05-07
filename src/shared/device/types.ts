export const DEVICE = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
} as const;

export type DeviceType = (typeof DEVICE)[keyof typeof DEVICE];

export const EXPERIENCE_PROFILE = {
  CINEMATIC: "cinematic",
  HYBRID: "hybrid",
  FULL: "full",
} as const;

export type ExperienceProfile =
  (typeof EXPERIENCE_PROFILE)[keyof typeof EXPERIENCE_PROFILE];

export interface DeviceDetectionResult {
  type: DeviceType;
  isMobile: boolean;
  isDesktop: boolean;
  userAgent: string;
  viewportWidth: number;
  deviceMemoryGb: number | null;
  hardwareConcurrency: number | null;
  defaultProfile: ExperienceProfile;
}
