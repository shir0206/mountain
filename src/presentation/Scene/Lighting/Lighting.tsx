import { useMemo } from "react";
import * as THREE from "three";

import { useDeviceContext } from "../../../context/device/useDeviceContext";
import {
	PERGOLA_X, PERGOLA_Y, PERGOLA_Z,
	DESK_LAMP_X, DESK_LAMP_Y, DESK_LAMP_Z,
	FLOOR_LAMP_X, FLOOR_LAMP_Y, FLOOR_LAMP_Z,
} from "../config/positions";

// Post-rain summer atmosphere — bright cloudy sky, warm sun aimed at pergola,
// two soft warm interior lamps. Every light that matters casts shadows.
export function Lighting() {
	const { renderSettings } = useDeviceContext();
	const shadowMapSize = renderSettings.shadowMapSize;

	// Directional sun needs an explicit target object so it behaves like a
	// natural spotlight pointing at the pergola area.
	const sunTarget = useMemo(() => {
		const o = new THREE.Object3D();
		o.position.set(PERGOLA_X, PERGOLA_Y + 8, PERGOLA_Z);
		return o;
	}, []);

	return (
		<>
			{/* Humid post-rain ambient — warm, slightly reduced so shadows read */}
			<ambientLight color='#fff1d6' intensity={0.55} />

			{/* Bright cloudy sky + warm earth bounce */}
			<hemisphereLight args={["#fff4dc", "#b89878", 1.2]} />

			{/* Primary sun — positioned above the initial camera point,
			    shining down toward the pergola. Casts shadows on pergola floor
			    and mountain surface below. */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#fff8e8'
				intensity={4}
				position={[-19.95, -5, -1.54]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
				shadow-bias={-0.0004}
				shadow-normalBias={0.03}
				shadow-camera-near={1}
				shadow-camera-far={120}
				shadow-camera-left={-35}
				shadow-camera-right={35}
				shadow-camera-top={35}
				shadow-camera-bottom={-35}
			/>

			{/* Secondary warm sun — wider angle, covers mountain slopes for
			    visible shadows on the terrain. */}
			<directionalLight
				color='#ffe3b8'
				intensity={2.5}
				position={[PERGOLA_X - 45, PERGOLA_Y + 55, PERGOLA_Z - 40]}
				target={sunTarget}
				castShadow
				shadow-mapSize-width={shadowMapSize}
				shadow-mapSize-height={shadowMapSize}
				shadow-bias={-0.0003}
				shadow-normalBias={0.04}
				shadow-camera-near={1}
				shadow-camera-far={150}
				shadow-camera-left={-50}
				shadow-camera-right={50}
				shadow-camera-top={50}
				shadow-camera-bottom={-50}
			/>

			{/* Soft opposite fill — lifts crushed shadows on turquoise chairs */}
			<directionalLight
				color='#dfeaff'
				intensity={0.6}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>

			{/* Desk lamp — warm, low. No shadow (point-light shadow = 6 cube passes). */}
			<pointLight
				color='#ffb870'
				intensity={6}
				distance={4}
				decay={2}
				position={[DESK_LAMP_X, DESK_LAMP_Y + 0.2, DESK_LAMP_Z]}
			/>

			{/* Coffee-table / floor lamp — warm, low. No shadow for same reason. */}
			<pointLight
				color='#ffb870'
				intensity={7}
				distance={5}
				decay={2}
				position={[FLOOR_LAMP_X, FLOOR_LAMP_Y + 2.2, FLOOR_LAMP_Z]}
			/>
		</>
	);
}