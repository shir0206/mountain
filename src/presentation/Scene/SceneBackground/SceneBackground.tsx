import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import * as THREE from "three";
const EXR_PATH = "textures/background.exr";

export function SceneBackground() {
	const { scene, gl } = useThree();

	useEffect(() => {
		const loader = new EXRLoader();
		const pmremGenerator = new THREE.PMREMGenerator(gl);
		pmremGenerator.compileEquirectangularShader();

		loader.load(EXR_PATH, (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			const envMap = pmremGenerator.fromEquirectangular(texture).texture;

			scene.background = envMap;

			texture.dispose();
			pmremGenerator.dispose();
		});

		return () => {
			scene.background = null;
		};
	}, [scene, gl]);

	return null;
}
