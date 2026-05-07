import {
  EXPERIENCE_PROFILE,
  type ExperienceProfile,
} from "../../../context/device/types";

export const PROFILE_ORDER: ExperienceProfile[] = [
  EXPERIENCE_PROFILE.CINEMATIC,
  EXPERIENCE_PROFILE.HYBRID,
  EXPERIENCE_PROFILE.FULL,
];

export interface ExperienceBudget {
  maxDpr: number;
  antialias: boolean;
  enableIntroAnimation: boolean;
  shadowMode: "none" | "basic" | "full";
  shadowMapSize: 512 | 1024 | 2048;
  decorativeDensity: number;
}

export const EXPERIENCE_BUDGETS: Record<ExperienceProfile, ExperienceBudget> = {
  [EXPERIENCE_PROFILE.CINEMATIC]: {
    maxDpr: 1,
    antialias: false,
    enableIntroAnimation: false,
    shadowMode: "none",
    shadowMapSize: 512,
    decorativeDensity: 0.35,
  },
  [EXPERIENCE_PROFILE.HYBRID]: {
    maxDpr: 1.35,
    antialias: true,
    enableIntroAnimation: true,
    shadowMode: "basic",
    shadowMapSize: 1024,
    decorativeDensity: 0.6,
  },
  [EXPERIENCE_PROFILE.FULL]: {
    maxDpr: 2,
    antialias: true,
    enableIntroAnimation: true,
    shadowMode: "full",
    shadowMapSize: 2048,
    decorativeDensity: 1,
  },
};

export function getLowerProfile(
  profile: ExperienceProfile
): ExperienceProfile | null {
  const index = PROFILE_ORDER.indexOf(profile);
  if (index <= 0) return null;
  return PROFILE_ORDER[index - 1];
}
