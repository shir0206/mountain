import { useMemo } from "react";
import * as THREE from "three";

import { useDeviceContext } from "../../../context/device/useDeviceContext";
import {
	PERGOLA_X, PERGOLA_Y, PERGOLA_Z,
	DESK_LAMP_X, DESK_LAMP_Y, DESK_LAMP_Z,
	FLOOR_LAMP_X, FLOOR_LAMP_Y, FLOOR_LAMP_Z,
} from "../config/positions";

// Mid-morning alpine summer — cool blue-sky ambient, single strong sun from upper-left,
// mountain bounce from right, warm interior lamps as accent contrast.
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
			{/* Cool alpine sky ambient */}
			<ambientLight color='#d0e4f4' intensity={0.4} />

			{/* Alpine sky dome — blue above, dry-rock ground bounce below */}
			<hemisphereLight args={["#a8c8e8", "#8a7a5a", 0.9]} />

			{/* Primary sun — upper-left, ~38° elevation, mid-morning summer */}
			<primitive object={sunTarget} />
			<directionalLight
				color='#fff4e0'
				intensity={3.5}
				position={[-25, 20, -15]}
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

			{/* Mountain face bounce — cool blue-grey fill from right-back */}
			<directionalLight
				color='#c8d8e8'
				intensity={0.5}
				position={[PERGOLA_X + 40, PERGOLA_Y + 30, PERGOLA_Z + 20]}
				target={sunTarget}
			/>

			{/* Sky fill — reinforces cool upper hemisphere */}
			<directionalLight
				color='#c8ddf4'
				intensity={0.4}
				position={[PERGOLA_X + 30, PERGOLA_Y + 40, PERGOLA_Z + 30]}
			/>

			{/* Desk lamp — warm point, accent contrast against cool ambient */}
			<pointLight
				color='#ffb870'
				intensity={4}
				distance={4}
				decay={2}
				position={[DESK_LAMP_X, DESK_LAMP_Y + 0.2, DESK_LAMP_Z]}
			/>

			{/* Floor lamp — warm point */}
			<pointLight
				color='#ffb870'
				intensity={5}
				distance={5}
				decay={2}
				position={[FLOOR_LAMP_X, FLOOR_LAMP_Y + 2.2, FLOOR_LAMP_Z]}
			/>
		</>
	);
}