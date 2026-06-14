import * as P from "./positions";
import type { SceneObject } from "../types";
import { shouldKeepOnMobile } from "./sceneDensity";

export const SCENE_OBJECTS: SceneObject[] = [
  {
    path: "models/mountain.glb",
    label: "Mountain Peak",
    position: [P.MOUNTAIN_X, P.MOUNTAIN_Y, P.MOUNTAIN_Z],
    scale: [P.MOUNTAIN_SCALE, P.MOUNTAIN_SCALE * 0.7, P.MOUNTAIN_SCALE],
    rotationY: P.MOUNTAIN_ANGLE,
  },
  {
    path: "models/pergola_structure.glb",
    label: "Glass Terrace",
    position: [P.PERGOLA_X, P.PERGOLA_Y, P.PERGOLA_Z],
    scale: [P.PERGOLA_SCALE, P.PERGOLA_SCALE * 0.7, P.PERGOLA_SCALE],
    rotationY: P.PERGOLA_ANGLE,
  },
  {
    path: "models/pergola_floor.glb",
    label: "Pergola Floor",
    position: [P.PERGOLA_FLOOR_X, P.PERGOLA_FLOOR_Y, P.PERGOLA_FLOOR_Z],
    scale: [
      P.PERGOLA_FLOOR_SCALE,
      P.PERGOLA_FLOOR_SCALE * 4.2,
      P.PERGOLA_FLOOR_SCALE,
    ],
    rotationY: P.PERGOLA_FLOOR_ANGLE,
  },

  {
    path: "models/office_chair_cream.glb",
    label: "Chair",
    position: [P.OFFICE_CHAIR_X, P.OFFICE_CHAIR_Y, P.OFFICE_CHAIR_Z],
    scale: P.OFFICE_CHAIR_SCALE,
    rotationY: P.OFFICE_CHAIR_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Left",
    position: [P.MONITOR_A_X, P.MONITOR_A_Y, P.MONITOR_A_Z],
    scale: P.MONITOR_A_SCALE,
    rotationY: P.MONITOR_A_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Right",
    position: [P.MONITOR_B_X, P.MONITOR_B_Y, P.MONITOR_B_Z],
    scale: P.MONITOR_B_SCALE,
    rotationY: P.MONITOR_B_ANGLE,
  },
  {
    path: "models_optimized/monitor.glb",
    label: "Monitor Right",
    position: [P.MONITOR_C_X, P.MONITOR_C_Y, P.MONITOR_C_Z],
    scale: P.MONITOR_C_SCALE,
    rotationY: P.MONITOR_C_ANGLE,
  },
  {
    path: "models_optimized/mac_keyboard.glb",
    label: "Keyboard",
    position: [P.KEYBOARD_X, P.KEYBOARD_Y, P.KEYBOARD_Z],
    scale: P.KEYBOARD_SCALE,
    rotationY: P.KEYBOARD_ANGLE,
  },

  {
    path: "models_optimized/lowpoly_laptop_closed.glb",
    label: "Laptop",
    position: [P.LAPTOP_X, P.LAPTOP_Y, P.LAPTOP_Z],
    scale: P.LAPTOP_SCALE,
    rotationY: P.LAPTOP_ANGLE,
  },
  {
    path: "models_optimized/the_serpent_-_tret030.glb",
    label: "DESK_LAMP",
    position: [P.DESK_LAMP_X, P.DESK_LAMP_Y, P.DESK_LAMP_Z],
    scale: P.DESK_LAMP_SCALE,
    rotationY: P.DESK_LAMP_ANGLE,
  },
  {
    path: "models_optimized/imac_magic_mouse.glb",
    label: "mouse",
    position: [P.MOUSE_X, P.MOUSE_Y, P.MOUSE_Z],
    scale: P.MOUSE_SCALE,
    rotationY: P.MOUSE_ANGLE,
  },
  {
    path: "models_optimized/mug.glb",
    label: "Mug",
    position: [P.MUG_X, P.MUG_Y, P.MUG_Z],
    scale: P.MUG_SCALE,
    rotationY: P.MUG_ANGLE,
  },
  {
    path: "models_optimized/unhyun__straw_mat_a.glb",
    label: "COASTER",
    position: [P.COASTER_X, P.COASTER_Y, P.COASTER_Z],
    scale: P.COASTER_SCALE,
    rotationY: P.COASTER_ANGLE,
  },

  {
    path: "models_optimized/welcome_text.glb",
    label: "TV_CODE",
    position: [P.TV_CODE_X, P.TV_CODE_Y, P.TV_CODE_Z],
    scale: P.TV_CODE_SCALE,
    rotationY: P.TV_CODE_ANGLE,
  },

  {
    path: "models_optimized/ipad_air4.glb",
    label: "tablet",
    position: [P.TABLET_X, P.TABLET_Y, P.TABLET_Z],
    scale: P.TABLET_SCALE,
    rotationY: P.TABLET_ANGLE,
  },
  {
    path: "models_optimized/irvin_floor_lamp_natural_wood_and_white.glb",
    label: "FLOOR_LAMP",
    position: [P.FLOOR_LAMP_X, P.FLOOR_LAMP_Y, P.FLOOR_LAMP_Z],
    scale: P.FLOOR_LAMP_SCALE,
    rotationY: P.FLOOR_LAMP_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_A_X, P.ARMCHAIR_A_Y, P.ARMCHAIR_A_Z],
    scale: P.ARMCHAIR_A_SCALE,
    rotationY: P.ARMCHAIR_A_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_B_X, P.ARMCHAIR_B_Y, P.ARMCHAIR_B_Z],
    scale: P.ARMCHAIR_B_SCALE,
    rotationY: P.ARMCHAIR_B_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_C_X, P.ARMCHAIR_C_Y, P.ARMCHAIR_C_Z],
    scale: P.ARMCHAIR_C_SCALE,
    rotationY: P.ARMCHAIR_C_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_D_X, P.ARMCHAIR_D_Y, P.ARMCHAIR_D_Z],
    scale: P.ARMCHAIR_D_SCALE,
    rotationY: P.ARMCHAIR_D_ANGLE,
  },
  {
    path: "models/ritchie_armchair_barley_beige.glb",
    label: "Armchair",
    position: [P.ARMCHAIR_E_X, P.ARMCHAIR_E_Y, P.ARMCHAIR_E_Z],
    scale: P.ARMCHAIR_E_SCALE,
    rotationY: P.ARMCHAIR_E_ANGLE,
  },
  {
    path: "models/coffee_table_final (1).glb",
    label: "coffee table",
    position: [P.COFFEE_TABLE_X, P.COFFEE_TABLE_Y, P.COFFEE_TABLE_Z],
    scale: [
      P.COFFEE_TABLE_SCALE,
      P.COFFEE_TABLE_SCALE * 0.85,
      P.COFFEE_TABLE_SCALE,
    ],
  },

  {
    path: "models_optimized/rug_round.glb",

    label: "rug meeting",
    position: [P.RUG_MEETING_X, P.RUG_MEETING_Y, P.RUG_MEETING_Z],
    scale: [
      P.RUG_MEETING_SCALE * 1.25,
      P.RUG_MEETING_SCALE,
      P.RUG_MEETING_SCALE * 1.25,
    ],
  },

  {
    path: "models_optimized/desk.glb",
    label: "Wall Desk",
    position: [P.DESK_X, P.DESK_Y, P.DESK_Z],
    scale: [P.DESK_SCALE * 1.5, P.DESK_SCALE * 0.5, P.DESK_SCALE * 1.5],
  },
  {
    path: "models_optimized/desk.glb",
    label: "Shelf Desk",
    position: [P.SHELF_X, P.SHELF_Y, P.SHELF_Z],
    scale: [P.SHELF_SCALE * 1, P.SHELF_SCALE * 0.8, P.SHELF_SCALE * 1],
  },
  {
    path: "models/pot-plant-with-mud.glb",
    label: "Stonecrop",
    position: [P.SHELF_PLANT_POT_X, P.SHELF_PLANT_POT_Y, P.SHELF_PLANT_POT_Z],
    scale: [
      P.SHELF_PLANT_POT_SCALE * 1.5,
      P.SHELF_PLANT_POT_SCALE * 0.8,
      P.SHELF_PLANT_POT_SCALE * 0.5,
    ],
    rotationY: P.SHELF_PLANT_POT_ANGLE,
  },
  {
    path: "models/railing-plant-fixed.glb",
    label: "Stonecrop",
    position: [P.SHELF_PLANT_X, P.SHELF_PLANT_Y, P.SHELF_PLANT_Z],
    scale: [
      P.SHELF_PLANT_SCALE * 1.5,
      P.SHELF_PLANT_SCALE * 0.9,
      P.SHELF_PLANT_SCALE * 1,
    ],
    rotationY: P.SHELF_PLANT_ANGLE,
  },

  {
    path: "models/blenderzelkova_schneideriana.glb",
    label: "plant",
    position: [P.TREE_X, P.TREE_Y, P.TREE_Z],
    scale: P.TREE_SCALE,
    rotationY: P.TREE_ANGLE,
  },
  {
    path: "models/pot-plant-with-mud.glb",
    label: "plant",
    position: [P.TREE_POT_X, P.TREE_POT_Y, P.TREE_POT_Z],
    scale: [P.TREE_POT_SCALE, P.TREE_POT_SCALE * 2.5, P.TREE_POT_SCALE],
  },
];

// ── Progressive Suspense tiers ────────────────────────────────────────────────
// Tier 1: models visible during intro orbit (mountain, structure, ground).
// Tier 2: near furniture visible right after intro completes.
// Tier 3: decorative plants/bushes far from camera — true lazy load (no preload).
const PRIMARY_LABELS = new Set([
  "Mountain Peak",
  "Glass Terrace",
  "Pergola Floor",
  // "mud",
  // "wooden_fence a",
]);

const TERTIARY_LABELS = new Set([
  "jungle geranium",
  "jungle PALM",
  "jungle LUPINE",
  "jungle SNOWFLAKE",
  "jungle CROTON",
  "jungle SINENSIS",
  "jungle BUSH",
  "creeper",
  "square",
]);

export const SCENE_OBJECTS_PRIMARY = SCENE_OBJECTS.filter((obj) =>
  PRIMARY_LABELS.has(obj.label)
);

export const SCENE_OBJECTS_SECONDARY = SCENE_OBJECTS.filter(
  (obj) => !PRIMARY_LABELS.has(obj.label) && !TERTIARY_LABELS.has(obj.label)
);

export const SCENE_OBJECTS_TERTIARY = SCENE_OBJECTS.filter((obj) =>
  TERTIARY_LABELS.has(obj.label)
);

// ── Mobile-reduced lists ─────────────────────────────────────────────────────
// Thin out repeated decorative objects to cut ~40-60 MB on mobile devices.
function filterForMobile(objects: SceneObject[]): SceneObject[] {
  const labelCount = new Map<string, number>();
  return objects.filter((obj) => {
    const idx = labelCount.get(obj.label) ?? 0;
    labelCount.set(obj.label, idx + 1);
    return shouldKeepOnMobile(obj.label, idx);
  });
}

export const SCENE_OBJECTS_PRIMARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_PRIMARY
);
export const SCENE_OBJECTS_SECONDARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_SECONDARY
);
export const SCENE_OBJECTS_TERTIARY_MOBILE = filterForMobile(
  SCENE_OBJECTS_TERTIARY
);
