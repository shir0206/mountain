import type { ScenePosition } from "../types";

export const MOUNTAIN: ScenePosition = {
  SCALE: 27,
  X: 0,
  Y: -100,
  Z: 0,
  ANGLE: -Math.PI * 1.55,
};

export const PEAK_WORLD_Y = MOUNTAIN.Y + 1 * MOUNTAIN.SCALE;

export const PERGOLA: ScenePosition = {
  X: 10,
  Y: PEAK_WORLD_Y - 13,
  Z: -0.47,
  SCALE: 0.05,
  ANGLE: Math.PI - 0.5,
};

export const PERGOLA_FLOOR: ScenePosition = {
  X: PERGOLA.X,
  Y: PERGOLA.Y - 5,
  Z: PERGOLA.Z,
  SCALE: PERGOLA.SCALE,
  ANGLE: PERGOLA.ANGLE,
};

export const DESK: ScenePosition = {
  X: PERGOLA.X - 14.1,
  Y: PERGOLA.Y + 0.97,
  Z: PERGOLA.Z - 3.1,
  SCALE: 1.75,
  ANGLE: PERGOLA.ANGLE - Math.PI,
};

export const SHELF: ScenePosition = {
  X: DESK.X - 1.75,
  Y: DESK.Y + 1.3,
  Z: DESK.Z + 2.05,
  SCALE: 0.7,
  ANGLE: PERGOLA.ANGLE - Math.PI,
};

export const SHELF_PLANT_POT: ScenePosition = {
  X: SHELF.X - 0.1,
  Y: SHELF.Y - 0.898,
  Z: SHELF.Z + 0.5,
  SCALE: 2,
  ANGLE: SHELF.ANGLE + Math.PI / 2,
};

export const SHELF_PLANT: ScenePosition = {
  X: SHELF_PLANT_POT.X + 0.02,
  Y: SHELF_PLANT_POT.Y - 0.252,
  Z: SHELF_PLANT_POT.Z + 0.09,
  SCALE: SHELF_PLANT_POT.SCALE,
  ANGLE: SHELF_PLANT_POT.ANGLE,
};

export const MONITOR_MIDDLE: ScenePosition = {
  SCALE: 1.65,
  X: DESK.X - 1.7,
  Y: DESK.Y - 0.45,
  Z: DESK.Z + 2,
  ANGLE: DESK.ANGLE + Math.PI * 0.5,
};

export const MONITOR_LEFT: ScenePosition = {
  SCALE: 1.65,
  X: MONITOR_MIDDLE.X + 0.52,
  Y: MONITOR_MIDDLE.Y,
  Z: MONITOR_MIDDLE.Z + 1.52,
  ANGLE: (MONITOR_MIDDLE.ANGLE ?? 0) + Math.PI * 0.077,
};

export const MONITOR_RIGHT: ScenePosition = {
  SCALE: 1.65,
  X: MONITOR_MIDDLE.X - 0.35,
  Y: MONITOR_MIDDLE.Y,
  Z: MONITOR_MIDDLE.Z - 1.8,
  ANGLE: (MONITOR_MIDDLE.ANGLE ?? 0) - Math.PI * 0.1,
};

export const CLICK_CODE: ScenePosition = {
  X: MONITOR_MIDDLE.X + 2.05,
  Y: MONITOR_MIDDLE.Y + 1,
  Z: MONITOR_MIDDLE.Z - 3.75,
  SCALE: 0.5,
  ANGLE: MONITOR_MIDDLE.ANGLE,
};

export const LAPTOP: ScenePosition = {
  X: DESK.X - 0.2,
  Y: DESK.Y + 0.05,
  Z: DESK.Z + 0.4,
  SCALE: 2,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

export const DESK_LAMP: ScenePosition = {
  X: DESK.X - 0.9,
  Y: DESK.Y + 0.45,
  Z: DESK.Z + 0.7,
  SCALE: 0.8,
  ANGLE: DESK.ANGLE + Math.PI,
};

export const MOUSE: ScenePosition = {
  X: DESK.X + 1.2,
  Y: DESK.Y + 0.05,
  Z: DESK.Z - 1.6,
  SCALE: 1.6,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

export const KEYBOARD: ScenePosition = {
  X: DESK.X + 1.1,
  Y: DESK.Y + 0.05,
  Z: DESK.Z - 0.8,
  SCALE: 0.01,
  ANGLE: DESK.ANGLE + Math.PI * -1.5,
};

export const MUG: ScenePosition = {
  X: DESK.X + 1.1,
  Y: DESK.Y - 1.724,
  Z: DESK.Z - 3,
  SCALE: 0.07,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

export const COASTER: ScenePosition = {
  X: MUG.X + 0.2,
  Y: MUG.Y + 1.77,
  Z: MUG.Z + 0.75,
  SCALE: 0.2,
  ANGLE: DESK.ANGLE + Math.PI * 0.8,
};

export const OFFICE_CHAIR: ScenePosition = {
  X: DESK.X + 2,
  Y: DESK.Y - 1,
  Z: DESK.Z - 0.5,
  SCALE: 0.015,
  ANGLE: DESK.ANGLE + Math.PI * 1.6,
};

export const TREE_POT: ScenePosition = {
  X: PERGOLA.X - 1.2,
  Y: PERGOLA.Y - 2.18,
  Z: PERGOLA.Z + 0.15,
  SCALE: 1.5,
  ANGLE: PERGOLA.ANGLE + Math.PI * 0.5,
};

export const TREE: ScenePosition = {
  X: TREE_POT.X,
  Y: TREE_POT.Y + 2.2,
  Z: PERGOLA.Z + 0.5,
  SCALE: 0.25,
  ANGLE: TREE_POT.ANGLE,
};

export const COFFEE_TABLE: ScenePosition = {
  X: PERGOLA.X - 5,
  Y: PERGOLA.Y - 0.03,
  Z: PERGOLA.Z + 1.8,
  SCALE: 2,
  ANGLE: PERGOLA.ANGLE,
};

export const TABLET: ScenePosition = {
  X: COFFEE_TABLE.X - 0.2,
  Y: COFFEE_TABLE.Y + 0.8,
  Z: COFFEE_TABLE.Z + 0.2,
  SCALE: 2,
  ANGLE: Math.PI * 1.5,
};

export const TABLET_TEXT: ScenePosition = {
  X: TABLET.X - 0.02,
  Y: TABLET.Y + 0.01,
  Z: TABLET.Z + 0.01,
  SCALE: 0.18,
  ANGLE: 0,
};

export const FLOOR_LAMP: ScenePosition = {
  X: COFFEE_TABLE.X - 0.2,
  Y: COFFEE_TABLE.Y + 0.01,
  Z: COFFEE_TABLE.Z - 1.8,
  SCALE: 0.01,
  ANGLE: Math.PI,
};

const ARMCHAIR_RADIUS = 1.5;
const ARMCHAIR_Y = COFFEE_TABLE.Y + 0.01;
const ARMCHAIR_SCALE = 0.0175;

export const ARMCHAIR_A: ScenePosition = {
  X: COFFEE_TABLE.X + Math.cos(Math.PI * 0.1) * ARMCHAIR_RADIUS,
  Y: ARMCHAIR_Y,
  Z: COFFEE_TABLE.Z + Math.sin(Math.PI * 0.1) * ARMCHAIR_RADIUS,
  SCALE: ARMCHAIR_SCALE,
  ANGLE: Math.PI * 1.4,
};

export const ARMCHAIR_B: ScenePosition = {
  X: COFFEE_TABLE.X + Math.cos(Math.PI * 0.5) * ARMCHAIR_RADIUS,
  Y: ARMCHAIR_Y,
  Z: COFFEE_TABLE.Z + Math.sin(Math.PI * 0.5) * ARMCHAIR_RADIUS,
  SCALE: ARMCHAIR_SCALE,
  ANGLE: Math.PI * 1,
};

export const ARMCHAIR_C: ScenePosition = {
  X: COFFEE_TABLE.X + Math.cos(Math.PI * 0.9) * ARMCHAIR_RADIUS,
  Y: ARMCHAIR_Y,
  Z: COFFEE_TABLE.Z + Math.sin(Math.PI * 0.9) * ARMCHAIR_RADIUS,
  SCALE: ARMCHAIR_SCALE,
  ANGLE: Math.PI * 0.6,
};

export const ARMCHAIR_D: ScenePosition = {
  X: COFFEE_TABLE.X + Math.cos(Math.PI * 1.3) * ARMCHAIR_RADIUS,
  Y: ARMCHAIR_Y,
  Z: COFFEE_TABLE.Z + Math.sin(Math.PI * 1.3) * ARMCHAIR_RADIUS,
  SCALE: ARMCHAIR_SCALE,
  ANGLE: Math.PI * 0.2,
};

export const ARMCHAIR_E: ScenePosition = {
  X: COFFEE_TABLE.X + Math.cos(Math.PI * 1.7) * ARMCHAIR_RADIUS,
  Y: ARMCHAIR_Y,
  Z: COFFEE_TABLE.Z + Math.sin(Math.PI * 1.7) * ARMCHAIR_RADIUS,
  SCALE: ARMCHAIR_SCALE,
  ANGLE: Math.PI * 1.8,
};

export const RUG_MEETING: ScenePosition = {
  X: COFFEE_TABLE.X,
  Y: COFFEE_TABLE.Y - 0.01,
  Z: COFFEE_TABLE.Z,
  SCALE: 2.2,
};
