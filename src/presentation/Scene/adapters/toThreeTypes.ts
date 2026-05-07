import * as THREE from "three";
import type { CameraPreset, Position3D } from "../types";

export function toVector3(p: Position3D): THREE.Vector3 {
	return new THREE.Vector3(p[0], p[1], p[2]);
}

export function toOrbitTarget(preset: CameraPreset): {
	position: THREE.Vector3;
	target: THREE.Vector3;
} {
	return { position: toVector3(preset.position), target: toVector3(preset.target) };
}
