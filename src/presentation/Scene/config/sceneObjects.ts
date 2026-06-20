import * as P from "./positions";
import type { SceneObject } from "../types";
import { shouldKeepOnMobile } from "./sceneDensity";
import { MOUNTAIN_PATH } from "./renderPolicy";

export const SCENE_OBJECTS: SceneObject[] = [
	{
		path: MOUNTAIN_PATH,
		label: "Mountain Peak",
		position: [P.MOUNTAIN.X, P.MOUNTAIN.Y, P.MOUNTAIN.Z],
		scale: [P.MOUNTAIN.SCALE, P.MOUNTAIN.SCALE * 0.7, P.MOUNTAIN.SCALE],
		rotationY: P.MOUNTAIN.ANGLE,
	},
	{
		path: "models_optimized/pergola_structure.glb",
		label: "Pergola Structure",
		position: [P.PERGOLA.X, P.PERGOLA.Y, P.PERGOLA.Z],
		scale: [P.PERGOLA.SCALE, P.PERGOLA.SCALE * 0.7, P.PERGOLA.SCALE],
		rotationY: P.PERGOLA.ANGLE,
	},
	{
		path: "models_optimized/pergola_floor.glb",
		label: "Pergola Floor",
		position: [P.PERGOLA_FLOOR.X, P.PERGOLA_FLOOR.Y, P.PERGOLA_FLOOR.Z],
		scale: [
			P.PERGOLA_FLOOR.SCALE,
			P.PERGOLA_FLOOR.SCALE * 4.2,
			P.PERGOLA_FLOOR.SCALE,
		],
		rotationY: P.PERGOLA_FLOOR.ANGLE,
	},

	{
		path: "models_optimized/office-chair.glb",
		label: "Office Chair",
		position: [P.OFFICE_CHAIR.X, P.OFFICE_CHAIR.Y, P.OFFICE_CHAIR.Z],
		scale: P.OFFICE_CHAIR.SCALE,
		rotationY: P.OFFICE_CHAIR.ANGLE,
	},
	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Left",
		position: [P.MONITOR_A.X, P.MONITOR_A.Y, P.MONITOR_A.Z],
		scale: P.MONITOR_A.SCALE,
		rotationY: P.MONITOR_A.ANGLE,
	},
	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Center",
		position: [P.MONITOR_B.X, P.MONITOR_B.Y, P.MONITOR_B.Z],
		scale: P.MONITOR_B.SCALE,
		rotationY: P.MONITOR_B.ANGLE,
	},
	{
		path: "models_optimized/monitor.glb",
		label: "Monitor Right",
		position: [P.MONITOR_C.X, P.MONITOR_C.Y, P.MONITOR_C.Z],
		scale: P.MONITOR_C.SCALE,
		rotationY: P.MONITOR_C.ANGLE,
	},
	{
		path: "models_optimized/code-text.glb",
		label: "Code Text",
		position: [P.CLICK_CODE.X, P.CLICK_CODE.Y, P.CLICK_CODE.Z],
		scale: P.CLICK_CODE.SCALE,
		rotationY: P.CLICK_CODE.ANGLE,
	},
	{
		path: "models_optimized/keyboard.glb",
		label: "Keyboard",
		position: [P.KEYBOARD.X, P.KEYBOARD.Y, P.KEYBOARD.Z],
		scale: P.KEYBOARD.SCALE,
		rotationY: P.KEYBOARD.ANGLE,
	},

	{
		path: "models_optimized/laptop.glb",
		label: "Laptop",
		position: [P.LAPTOP.X, P.LAPTOP.Y, P.LAPTOP.Z],
		scale: P.LAPTOP.SCALE,
		rotationY: P.LAPTOP.ANGLE,
	},
	{
		path: "models_optimized/desk-lamp.glb",
		label: "Desk Lamp",
		position: [P.DESK_LAMP.X, P.DESK_LAMP.Y, P.DESK_LAMP.Z],
		scale: P.DESK_LAMP.SCALE,
		rotationY: P.DESK_LAMP.ANGLE,
	},
	{
		path: "models_optimized/mouse.glb",
		label: "Mouse",
		position: [P.MOUSE.X, P.MOUSE.Y, P.MOUSE.Z],
		scale: P.MOUSE.SCALE,
		rotationY: P.MOUSE.ANGLE,
	},
	{
		path: "models_optimized/mug.glb",
		label: "Mug",
		position: [P.MUG.X, P.MUG.Y, P.MUG.Z],
		scale: P.MUG.SCALE,
		rotationY: P.MUG.ANGLE,
	},
	{
		path: "models_optimized/rug.glb",
		label: "Coaster",
		position: [P.COASTER.X, P.COASTER.Y, P.COASTER.Z],
		scale: [P.COASTER.SCALE, P.COASTER.SCALE * 0.05, P.COASTER.SCALE],
		rotationY: P.COASTER.ANGLE,
	},

	{
		path: "models_optimized/click-text.glb",
		label: "Click Text",
		position: [P.TABLET_TEXT.X, P.TABLET_TEXT.Y, P.TABLET_TEXT.Z],
		scale: P.TABLET_TEXT.SCALE,
		rotationY: P.TABLET_TEXT.ANGLE,
	},

	{
		path: "models_optimized/tablet.glb",
		label: "Tablet",
		position: [P.TABLET.X, P.TABLET.Y, P.TABLET.Z],
		scale: P.TABLET.SCALE,
		rotationY: P.TABLET.ANGLE,
	},
	{
		path: "models_optimized/floor-lamp.glb",
		label: "Floor Lamp",
		position: [P.FLOOR_LAMP.X, P.FLOOR_LAMP.Y, P.FLOOR_LAMP.Z],
		scale: P.FLOOR_LAMP.SCALE,
		rotationY: P.FLOOR_LAMP.ANGLE,
	},
	{
		path: "models_optimized/armchair.glb",
		label: "Armchair A",
		position: [P.ARMCHAIR_A.X, P.ARMCHAIR_A.Y, P.ARMCHAIR_A.Z],
		scale: P.ARMCHAIR_A.SCALE,
		rotationY: P.ARMCHAIR_A.ANGLE,
	},
	{
		path: "models_optimized/armchair.glb",
		label: "Armchair B",
		position: [P.ARMCHAIR_B.X, P.ARMCHAIR_B.Y, P.ARMCHAIR_B.Z],
		scale: P.ARMCHAIR_B.SCALE,
		rotationY: P.ARMCHAIR_B.ANGLE,
	},
	{
		path: "models_optimized/armchair.glb",
		label: "Armchair C",
		position: [P.ARMCHAIR_C.X, P.ARMCHAIR_C.Y, P.ARMCHAIR_C.Z],
		scale: P.ARMCHAIR_C.SCALE,
		rotationY: P.ARMCHAIR_C.ANGLE,
	},
	{
		path: "models_optimized/armchair.glb",
		label: "Armchair D",
		position: [P.ARMCHAIR_D.X, P.ARMCHAIR_D.Y, P.ARMCHAIR_D.Z],
		scale: P.ARMCHAIR_D.SCALE,
		rotationY: P.ARMCHAIR_D.ANGLE,
	},
	{
		path: "models_optimized/armchair.glb",
		label: "Armchair E",
		position: [P.ARMCHAIR_E.X, P.ARMCHAIR_E.Y, P.ARMCHAIR_E.Z],
		scale: P.ARMCHAIR_E.SCALE,
		rotationY: P.ARMCHAIR_E.ANGLE,
	},
	{
		path: "models_optimized/meeting-table.glb",
		label: "Coffee Table",
		position: [P.COFFEE_TABLE.X, P.COFFEE_TABLE.Y, P.COFFEE_TABLE.Z],
		scale: [
			P.COFFEE_TABLE.SCALE,
			P.COFFEE_TABLE.SCALE * 0.85,
			P.COFFEE_TABLE.SCALE,
		],
	},

	{
		path: "models_optimized/rug.glb",
		label: "Rug",
		position: [P.RUG_MEETING.X, P.RUG_MEETING.Y, P.RUG_MEETING.Z],
		scale: [
			P.RUG_MEETING.SCALE * 1.25,
			P.RUG_MEETING.SCALE * 0.002,
			P.RUG_MEETING.SCALE * 1.25,
		],
	},

	{
		path: "models_optimized/desk.glb",
		label: "Wall Desk",
		position: [P.DESK.X, P.DESK.Y, P.DESK.Z],
		scale: [P.DESK.SCALE * 1.5, P.DESK.SCALE * 0.5, P.DESK.SCALE * 1.5],
	},
	{
		path: "models_optimized/desk.glb",
		label: "Shelf",
		position: [P.SHELF.X, P.SHELF.Y, P.SHELF.Z],
		scale: [P.SHELF.SCALE * 1, P.SHELF.SCALE * 0.8, P.SHELF.SCALE * 1],
	},
	{
		path: "models_optimized/pot.glb",
		label: "Shelf Pot",
		position: [P.SHELF_PLANT_POT.X, P.SHELF_PLANT_POT.Y, P.SHELF_PLANT_POT.Z],
		scale: [
			P.SHELF_PLANT_POT.SCALE * 1.5,
			P.SHELF_PLANT_POT.SCALE * 0.8,
			P.SHELF_PLANT_POT.SCALE * 0.5,
		],
		rotationY: P.SHELF_PLANT_POT.ANGLE,
	},
	{
		path: "models_optimized/railing-plant.glb",
		label: "Shelf Plant",
		position: [P.SHELF_PLANT.X, P.SHELF_PLANT.Y, P.SHELF_PLANT.Z],
		scale: [
			P.SHELF_PLANT.SCALE * 1.5,
			P.SHELF_PLANT.SCALE,
			P.SHELF_PLANT.SCALE * 1,
		],
		rotationY: P.SHELF_PLANT.ANGLE,
	},

	{
		path: "models_optimized/tree.glb",
		label: "Indoor Tree",
		position: [P.TREE.X, P.TREE.Y, P.TREE.Z],
		scale: P.TREE.SCALE,
		rotationY: P.TREE.ANGLE,
	},
	{
		path: "models_optimized/pot.glb",
		label: "Tree Pot",
		position: [P.TREE_POT.X, P.TREE_POT.Y, P.TREE_POT.Z],
		scale: [P.TREE_POT.SCALE, P.TREE_POT.SCALE * 2.5, P.TREE_POT.SCALE],
	},
];

// ── Progressive Suspense tiers ────────────────────────────────────────────────
// Tier 1: models visible during intro orbit (mountain, structure, ground).
// Tier 2: near furniture visible right after intro completes.
// Tier 3: decorative plants/bushes far from camera — true lazy load (no preload).
const PRIMARY_LABELS = new Set([
	"Mountain Peak",
	"Pergola Structure",
	"Pergola Floor",
]);

const TERTIARY_LABELS = new Set([]);

export const SCENE_OBJECTS_PRIMARY = SCENE_OBJECTS.filter((obj) =>
	PRIMARY_LABELS.has(obj.label),
);

export const SCENE_OBJECTS_SECONDARY = SCENE_OBJECTS.filter(
	(obj) => !PRIMARY_LABELS.has(obj.label) && !TERTIARY_LABELS.has(obj.label),
);

export const SCENE_OBJECTS_TERTIARY = SCENE_OBJECTS.filter((obj) =>
	TERTIARY_LABELS.has(obj.label),
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
	SCENE_OBJECTS_PRIMARY,
);
export const SCENE_OBJECTS_SECONDARY_MOBILE = filterForMobile(
	SCENE_OBJECTS_SECONDARY,
);
export const SCENE_OBJECTS_TERTIARY_MOBILE = filterForMobile(
	SCENE_OBJECTS_TERTIARY,
);
