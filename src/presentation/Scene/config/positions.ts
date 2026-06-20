// ─── Scene object positions ──────────────────────────────────────────────────
// All spatial constants for 3D objects in the scene.
// Each object is a grouped constant with X, Y, Z, SCALE, and optionally ANGLE.

import type { ScenePosition } from "../types";

export const MOUNTAIN: ScenePosition = {
	SCALE: 25,
	X: 0,
	Y: -100,
	Z: 0,
	ANGLE: -Math.PI * 1.5,
};

export const PEAK_WORLD_Y = MOUNTAIN.Y + 1 * MOUNTAIN.SCALE;

export const PERGOLA: ScenePosition = {
	X: 7,
	Y: PEAK_WORLD_Y - 11.95,
	Z: -7,
	SCALE: 0.05,
	ANGLE: Math.PI,
};

export const PERGOLA_FLOOR: ScenePosition = {
	X: PERGOLA.X,
	Y: PERGOLA.Y - 5,
	Z: PERGOLA.Z,
	SCALE: PERGOLA.SCALE,
	ANGLE: PERGOLA.ANGLE,
};

export const DESK: ScenePosition = {
	X: PERGOLA.X - 13.84,
	Y: PERGOLA.Y + 1,
	Z: PERGOLA.Z + 4.05,
	SCALE: 1.75,
};

export const SHELF: ScenePosition = {
	X: PERGOLA.X - 14.42,
	Y: PERGOLA.Y + 2.4,
	Z: PERGOLA.Z + 6.7,
	SCALE: 0.7,
};

export const SHELF_PLANT: ScenePosition = {
	X: SHELF.X + 0.2,
	Y: SHELF.Y - 1.15,
	Z: SHELF.Z + 0.71,
	SCALE: 2,
	ANGLE: Math.PI / 2,
};

export const SHELF_PLANT_POT: ScenePosition = {
	X: SHELF.X + 0.18,
	Y: SHELF.Y - 0.898,
	Z: SHELF.Z + 0.62,
	SCALE: 2,
	ANGLE: Math.PI / 2,
};

// CENTRAL MONITOR (relative to desk)
export const MONITOR_B: ScenePosition = {
	SCALE: 1.65,
	X: DESK.X - 0.5,
	Y: DESK.Y - 0.45,
	Z: DESK.Z + 3,
	ANGLE: Math.PI * 0.5,
};

// LEFT MONITOR
export const MONITOR_A: ScenePosition = {
	SCALE: 1.65,
	X: MONITOR_B.X + 1.23,
	Y: MONITOR_B.Y,
	Z: MONITOR_B.Z + 1.05,
	ANGLE: MONITOR_B.ANGLE + Math.PI * 0.08,
};

// RIGHT MONITOR
export const MONITOR_C: ScenePosition = {
	SCALE: 1.65,
	X: MONITOR_B.X - 1.16,
	Y: MONITOR_B.Y,
	Z: MONITOR_B.Z - 1.4,
	ANGLE: MONITOR_B.ANGLE - Math.PI * 0.1,
};

export const CLICK_CODE: ScenePosition = {
	X: MONITOR_B.X + 0.005,
	Y: MONITOR_B.Y + 1,
	Z: MONITOR_B.Z - 4.25,
	SCALE: 0.5,
	ANGLE: MONITOR_B.ANGLE,
};

export const KEYBOARD: ScenePosition = {
	X: DESK.X + 0.6,
	Y: DESK.Y + 0.05,
	Z: DESK.Z - 0.8,
	SCALE: 0.01,
	ANGLE: Math.PI * -1.5,
};

export const LAPTOP: ScenePosition = {
	X: DESK.X + 0.2,
	Y: DESK.Y + 0.05,
	Z: DESK.Z + 0.4,
	SCALE: 2,
	ANGLE: Math.PI * 1.5,
};

export const DESK_LAMP: ScenePosition = {
	X: DESK.X - 0.1,
	Y: DESK.Y + 0.45,
	Z: DESK.Z + 1,
	SCALE: 0.8,
	ANGLE: Math.PI,
};

export const MOUSE: ScenePosition = {
	X: DESK.X + 0.3,
	Y: DESK.Y + 0.05,
	Z: DESK.Z - 1.6,
	SCALE: 1.6,
	ANGLE: Math.PI * 1.5,
};

export const MUG: ScenePosition = {
	X: DESK.X - 0.5,
	Y: DESK.Y - 1.724,
	Z: DESK.Z - 2.7,
	SCALE: 0.07,
	ANGLE: Math.PI * 1.5,
};

export const COASTER: ScenePosition = {
	X: MUG.X + 0.55,
	Y: MUG.Y + 1.77,
	Z: MUG.Z + 0.6,
	SCALE: 0.2,
	ANGLE: Math.PI * 0.8,
};

export const OFFICE_CHAIR: ScenePosition = {
	X: DESK.X + 1.4,
	Y: DESK.Y - 1,
	Z: DESK.Z - 1,
	SCALE: 0.015,
	ANGLE: Math.PI * 1.6,
};

export const TREE_POT: ScenePosition = {
	X: PERGOLA.X - 1,
	Y: PERGOLA.Y - 2.18,
	Z: PERGOLA.Z + 1,
	SCALE: 1.5,
};

export const TREE: ScenePosition = {
	X: TREE_POT.X + 0.25,
	Y: TREE_POT.Y + 2.2,
	Z: PERGOLA.Z + 0.7,
	SCALE: 0.25,
	ANGLE: -Math.PI * 1.5,
};

export const COFFEE_TABLE: ScenePosition = {
	X: PERGOLA.X - 4,
	Y: PERGOLA.Y + 0.01,
	Z: PERGOLA.Z + 4,
	SCALE: 2,
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