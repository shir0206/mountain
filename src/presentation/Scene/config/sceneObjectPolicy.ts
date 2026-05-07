import { EXPERIENCE_PROFILE, type ExperienceProfile } from "../types";
import type { SceneObject } from "../types";
import { SCENE_OBJECTS } from "./sceneObjects";

const DECORATIVE_PATHS = new Set<string>([
  "models_optimized/green_creeper_plant.glb",
  "models_optimized/bush_square.glb",
  "models_optimized/realistic_hd_chinese_jungle_geranium_310.glb",
  "models_optimized/realistic_hd_chinese_jungle_geranium_710.glb",
  "models_optimized/realistic_hd_windmill_palm_1625.glb",
  "models_optimized/realistic_hd_large-leaved_lupine_318.glb",
  "models_optimized/dwarf_snowflake_mock_orange_flowers_spring.glb",
  "models_optimized/croton_leaf_plants.glb",
  "models_optimized/wisteria_sinensis005.glb",
  "models_optimized/free_pothos_potted_plant_-_money_plant.glb",
]);

function isDecorativeObject(object: SceneObject): boolean {
  return DECORATIVE_PATHS.has(object.path);
}

export function getSceneObjectsForProfile(
  profile: ExperienceProfile
): SceneObject[] {
  if (profile === EXPERIENCE_PROFILE.FULL) {
    return SCENE_OBJECTS;
  }

  const critical = SCENE_OBJECTS.filter((object) => !isDecorativeObject(object));
  const decorative = SCENE_OBJECTS.filter((object) => isDecorativeObject(object));

  const decorativeLimit =
    profile === EXPERIENCE_PROFILE.HYBRID
      ? Math.ceil(decorative.length * 0.5)
      : Math.ceil(decorative.length * 0.2);

  return [...critical, ...decorative.slice(0, decorativeLimit)];
}
