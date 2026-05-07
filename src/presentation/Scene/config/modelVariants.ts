import { EXPERIENCE_PROFILE, type ExperienceProfile } from "../types";

const MODEL_VARIANTS: Record<
  string,
  Partial<Record<ExperienceProfile, string>>
> = {
  "models_optimized/green_creeper_plant.glb": {
    [EXPERIENCE_PROFILE.CINEMATIC]:
      "models_optimized/green_creeper_plant_low.glb",
    [EXPERIENCE_PROFILE.HYBRID]:
      "models_optimized/green_creeper_plant_med.glb",
  },
  "models_optimized/bush_square.glb": {
    [EXPERIENCE_PROFILE.CINEMATIC]: "models_optimized/bush_square_low.glb",
    [EXPERIENCE_PROFILE.HYBRID]: "models_optimized/bush_square_med.glb",
  },
};

export function resolveModelPathForProfile(
  basePath: string,
  profile: ExperienceProfile
): string {
  return MODEL_VARIANTS[basePath]?.[profile] ?? basePath;
}

export function getAllKnownModelPaths(basePath: string): string[] {
  const variantPaths = Object.values(MODEL_VARIANTS[basePath] ?? {}).filter(
    Boolean
  ) as string[];
  return [basePath, ...variantPaths];
}
