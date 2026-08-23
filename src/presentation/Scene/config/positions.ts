// Each object is a grouped constant with X, Y, Z, SCALE, and optionally ANGLE.
//
// FIX: X/Z offsets are no longer hardcoded manual corrections. Instead, each
// child's ORIGINAL offset from its parent (captured before PERGOLA.ANGLE was
// changed) is rotated by PERGOLA_ROTATION_DELTA before being applied. This
// means if PERGOLA.ANGLE (or MOUNTAIN, etc.) changes again in the future,
// every descendant automatically re-aligns — no more manual X/Z tweaking.
//
// PERGOLA and MOUNTAIN keep their authored ("new") values untouched.
// Calling PERGOLA.X / PERGOLA.Z etc. still returns a plain number, same as before.

import type { ScenePosition } from "../types";

/**
 * Rotates a local (dx, dz) offset around the Y axis by `delta` radians.
 * Standard 2D rotation matrix: [cos -sin; sin cos] applied to (dx, dz).
 */
function rotateOffset(dx: number, dz: number, delta: number) {
  const c = Math.cos(delta);
  const s = Math.sin(delta);
  return {
    dx: dx * c - dz * s,
    dz: dx * s + dz * c,
  };
}

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

// The angle PERGOLA used to have, before you rotated it. Everything below
// was originally authored assuming this angle. Change this constant if you
// ever re-baseline the "original" layout.
const PERGOLA_ORIGINAL_ANGLE = Math.PI;

// How far PERGOLA has been rotated since the offsets below were authored.
// This is the single value driving every position correction in this file.
const PERGOLA_ROTATION_DELTA = PERGOLA_ORIGINAL_ANGLE - PERGOLA.ANGLE;

export const PERGOLA_FLOOR: ScenePosition = {
  X: PERGOLA.X,
  Y: PERGOLA.Y - 5,
  Z: PERGOLA.Z,
  SCALE: PERGOLA.SCALE,
  ANGLE: PERGOLA.ANGLE,
};

// ---- Desk cluster (originally offset from PERGOLA) ----

const deskOffset = rotateOffset(-13.84, 4.05, PERGOLA_ROTATION_DELTA);

export const DESK: ScenePosition = {
  X: PERGOLA.X + deskOffset.dx,
  Y: PERGOLA.Y + 1,
  Z: PERGOLA.Z + deskOffset.dz,
  SCALE: 1.75,
  ANGLE: PERGOLA.ANGLE - Math.PI,
};

const shelfOffset = rotateOffset(-14.42, 6.7, PERGOLA_ROTATION_DELTA);

export const SHELF: ScenePosition = {
  X: PERGOLA.X + shelfOffset.dx,
  Y: PERGOLA.Y + 2.4,
  Z: PERGOLA.Z + shelfOffset.dz,
  SCALE: 0.7,
  // SHELF never had its own ANGLE originally; it's rigidly attached to the
  // same desk assembly, so it rotates in lockstep with DESK.
  ANGLE: DESK.ANGLE,
};

const shelfPlantPotOffset = rotateOffset(0.18, 0.62, PERGOLA_ROTATION_DELTA);

export const SHELF_PLANT_POT: ScenePosition = {
  X: SHELF.X + shelfPlantPotOffset.dx,
  Y: SHELF.Y - 0.898,
  Z: SHELF.Z + shelfPlantPotOffset.dz,
  SCALE: 2,
  ANGLE: SHELF.ANGLE + Math.PI / 2,
};

const shelfPlantOffset = rotateOffset(0.2, 0.71, PERGOLA_ROTATION_DELTA);

export const SHELF_PLANT: ScenePosition = {
  X: SHELF.X + shelfPlantOffset.dx,
  Y: SHELF.Y - 1.15,
  Z: SHELF.Z + shelfPlantOffset.dz,
  SCALE: 2,
  ANGLE: SHELF_PLANT_POT.ANGLE,
};

// ---- Monitors (offset from DESK) ----

const monitorMiddleOffset = rotateOffset(-0.5, 3.0, PERGOLA_ROTATION_DELTA);

export const MONITOR_MIDDLE: ScenePosition = {
  SCALE: 1.65,
  X: DESK.X + monitorMiddleOffset.dx,
  Y: DESK.Y - 0.45,
  Z: DESK.Z + monitorMiddleOffset.dz,
  ANGLE: DESK.ANGLE + Math.PI * 0.5,
};

const monitorLeftOffset = rotateOffset(1.23, 1.05, PERGOLA_ROTATION_DELTA);

export const MONITOR_LEFT: ScenePosition = {
  SCALE: 1.65,
  X: MONITOR_MIDDLE.X + monitorLeftOffset.dx,
  Y: MONITOR_MIDDLE.Y,
  Z: MONITOR_MIDDLE.Z + monitorLeftOffset.dz,
  ANGLE: (MONITOR_MIDDLE.ANGLE ?? 0) + Math.PI * 0.08,
};

const monitorRightOffset = rotateOffset(-1.16, -1.4, PERGOLA_ROTATION_DELTA);

export const MONITOR_RIGHT: ScenePosition = {
  SCALE: 1.65,
  X: MONITOR_MIDDLE.X + monitorRightOffset.dx,
  Y: MONITOR_MIDDLE.Y,
  Z: MONITOR_MIDDLE.Z + monitorRightOffset.dz,
  ANGLE: (MONITOR_MIDDLE.ANGLE ?? 0) - Math.PI * 0.1,
};

const clickCodeOffset = rotateOffset(0.005, -4.25, PERGOLA_ROTATION_DELTA);

export const CLICK_CODE: ScenePosition = {
  X: MONITOR_MIDDLE.X + clickCodeOffset.dx,
  Y: MONITOR_MIDDLE.Y + 1,
  Z: MONITOR_MIDDLE.Z + clickCodeOffset.dz,
  SCALE: 0.5,
  ANGLE: MONITOR_MIDDLE.ANGLE,
};

// ---- Desk accessories (offset from DESK) ----

const keyboardOffset = rotateOffset(0.6, -0.8, PERGOLA_ROTATION_DELTA);

export const KEYBOARD: ScenePosition = {
  X: DESK.X + keyboardOffset.dx,
  Y: DESK.Y + 0.05,
  Z: DESK.Z + keyboardOffset.dz,
  SCALE: 0.01,
  ANGLE: DESK.ANGLE + Math.PI * -1.5,
};

const laptopOffset = rotateOffset(0.2, 0.4, PERGOLA_ROTATION_DELTA);

export const LAPTOP: ScenePosition = {
  X: DESK.X + laptopOffset.dx,
  Y: DESK.Y + 0.05,
  Z: DESK.Z + laptopOffset.dz,
  SCALE: 2,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

const deskLampOffset = rotateOffset(-0.1, 1.0, PERGOLA_ROTATION_DELTA);

export const DESK_LAMP: ScenePosition = {
  X: DESK.X + deskLampOffset.dx,
  Y: DESK.Y + 0.45,
  Z: DESK.Z + deskLampOffset.dz,
  SCALE: 0.8,
  ANGLE: DESK.ANGLE + Math.PI,
};

const mouseOffset = rotateOffset(0.3, -1.6, PERGOLA_ROTATION_DELTA);

export const MOUSE: ScenePosition = {
  X: DESK.X + mouseOffset.dx,
  Y: DESK.Y + 0.05,
  Z: DESK.Z + mouseOffset.dz,
  SCALE: 1.6,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

const mugOffset = rotateOffset(-0.5, -2.7, PERGOLA_ROTATION_DELTA);

export const MUG: ScenePosition = {
  X: DESK.X + mugOffset.dx,
  Y: DESK.Y - 1.724,
  Z: DESK.Z + mugOffset.dz,
  SCALE: 0.07,
  ANGLE: DESK.ANGLE + Math.PI * 1.5,
};

const coasterOffset = rotateOffset(0.55, 0.6, PERGOLA_ROTATION_DELTA);

export const COASTER: ScenePosition = {
  X: MUG.X + coasterOffset.dx,
  Y: MUG.Y + 1.77,
  Z: MUG.Z + coasterOffset.dz,
  SCALE: 0.2,
  ANGLE: DESK.ANGLE + Math.PI * 0.8,
};

const officeChairOffset = rotateOffset(1.4, -1.0, PERGOLA_ROTATION_DELTA);

export const OFFICE_CHAIR: ScenePosition = {
  X: DESK.X + officeChairOffset.dx,
  Y: DESK.Y - 1,
  Z: DESK.Z + officeChairOffset.dz,
  SCALE: 0.015,
  ANGLE: DESK.ANGLE + Math.PI * 1.6,
};

// ---- Tree (offset from PERGOLA / TREE_POT) ----

const treePotOffset = rotateOffset(-1, 1, PERGOLA_ROTATION_DELTA);

export const TREE_POT: ScenePosition = {
  X: PERGOLA.X + treePotOffset.dx,
  Y: PERGOLA.Y - 2.18,
  Z: PERGOLA.Z + treePotOffset.dz,
  SCALE: 1.5,
  ANGLE: PERGOLA.ANGLE + Math.PI * 0.5,
};

const treeOffset = rotateOffset(0.2, 0.3, PERGOLA_ROTATION_DELTA);

export const TREE: ScenePosition = {
  X: TREE_POT.X + treeOffset.dx,
  Y: TREE_POT.Y + 2.2,
  Z: TREE_POT.Z + treeOffset.dz,
  SCALE: 0.25,
  ANGLE: TREE_POT.ANGLE,
};

// ---- Coffee table / seating area (offset from PERGOLA) ----

const coffeeTableOffset = rotateOffset(-4, 4, PERGOLA_ROTATION_DELTA);

export const COFFEE_TABLE: ScenePosition = {
  X: PERGOLA.X + coffeeTableOffset.dx,
  Y: PERGOLA.Y + 0.01,
  Z: PERGOLA.Z + coffeeTableOffset.dz,
  SCALE: 2,
};

const tabletOffset = rotateOffset(-0.2, 0.2, PERGOLA_ROTATION_DELTA);

export const TABLET: ScenePosition = {
  X: COFFEE_TABLE.X + tabletOffset.dx,
  Y: COFFEE_TABLE.Y + 0.8,
  Z: COFFEE_TABLE.Z + tabletOffset.dz,
  SCALE: 2,
  ANGLE: Math.PI * 1.5,
};

const tabletTextOffset = rotateOffset(-0.02, 0.01, PERGOLA_ROTATION_DELTA);

export const TABLET_TEXT: ScenePosition = {
  X: TABLET.X + tabletTextOffset.dx,
  Y: TABLET.Y + 0.01,
  Z: TABLET.Z + tabletTextOffset.dz,
  SCALE: 0.18,
  ANGLE: 0,
};

const floorLampOffset = rotateOffset(-0.2, -1.8, PERGOLA_ROTATION_DELTA);

export const FLOOR_LAMP: ScenePosition = {
  X: COFFEE_TABLE.X + floorLampOffset.dx,
  Y: COFFEE_TABLE.Y + 0.01,
  Z: COFFEE_TABLE.Z + floorLampOffset.dz,
  SCALE: 0.01,
  ANGLE: Math.PI,
};

// Armchairs were already defined parametrically (radius + fixed angle
// around COFFEE_TABLE), so they never needed a hardcoded correction — they
// automatically follow COFFEE_TABLE's corrected X/Z. Left untouched.

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
