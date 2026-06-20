// ─── Scene domain types ──────────────────────────────────────────────────────

// PresetKey is canonical in context/scene (shared state); re-exported here so
// Scene presentation modules keep their current import paths.
export { type PresetKey } from "../../context/scene/types";

/**
 * Position/target value object. Raw 3-tuple kept for config ergonomics;
 * convert via `Scene/adapters/toThreeTypes.ts` when a Vector3 is needed.
 */
export type PositionTuple = readonly [number, number, number];
/** @deprecated Use PositionTuple */
export type Position3D = PositionTuple;

export interface ScenePosition {
	X: number;
	Y: number;
	Z: number;
	SCALE: number;
	ANGLE?: number;
}

export interface CameraPreset {
	position: PositionTuple;
	target: PositionTuple;
}

/** Per-frame hint for the intro choreography (consumed by IntroAnimation). */
export interface IntroPhase {
	duration: number;
}

/** Declarative scene object (GLB model + placement). */
export interface SceneObject {
	path: string;
	label: string;
	position: PositionTuple;
	scale: number | PositionTuple;
	rotationY?: number;
	noShadow?: boolean;
}
