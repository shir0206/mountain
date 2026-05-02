// ─── Scene domain types ──────────────────────────────────────────────────────

// PresetKey is canonical in context/scene (shared state); re-exported here so
// Scene presentation modules keep their current import paths.
export { type PresetKey } from "../../context/scene/types";

/**
 * Position/target value object. Raw 3-tuple kept for config ergonomics;
 * convert via `Scene/adapters/toThreeTypes.ts` when a Vector3 is needed.
 */
export type Position3D = readonly [number, number, number];

export interface CameraPreset {
	position: Position3D;
	target: Position3D;
}

/** Per-frame hint for the intro choreography (consumed by IntroAnimation). */
export interface IntroPhase {
	duration: number;
}

/** Declarative scene object (GLB model + placement). */
export interface SceneObject {
	path: string;
	label: string;
	position: Position3D;
	scale: number | Position3D;
	rotationY?: number;
	noShadow?: boolean;
}
