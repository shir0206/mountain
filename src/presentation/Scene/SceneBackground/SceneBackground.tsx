import { useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BG_PATH = "images/background2.webp";
const BG_FOV = 75; // wider than main camera → shows more top/bottom of panorama

export function SceneBackground() {
  const { gl, camera, size } = useThree();
  const bgScene = useMemo(() => new THREE.Scene(), []);
  const bgCamera = useMemo(
    () => new THREE.PerspectiveCamera(BG_FOV, 1, 0.1, 10),
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(BG_PATH, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      bgScene.background = texture;
    });

    return () => {
      bgScene.background = null;
    };
  }, [bgScene]);

  useEffect(() => {
    gl.autoClear = false;
    return () => {
      gl.autoClear = true;
    };
  }, [gl]);

  useFrame(() => {
    bgCamera.aspect = size.width / size.height;
    bgCamera.updateProjectionMatrix();
    bgCamera.quaternion.copy(camera.quaternion);
    bgCamera.position.set(0, 0, 0);

    gl.clear();
    gl.render(bgScene, bgCamera);
  }, -1);

  return null;
}
