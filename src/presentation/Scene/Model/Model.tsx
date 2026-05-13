import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import type { SceneObject } from "../types";
import {
  SCENE_OBJECTS_PRIMARY,
  SCENE_OBJECTS_SECONDARY,
} from "../config/sceneObjects";
import { applyMaterialPolicy } from "./applyMaterialPolicy";

// Draco decoder needed for the optimized GLBs (geometry compressed with Draco).
useGLTF.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

// Only preload primary models (mountain, pergola, mud, fences) eagerly.
// Secondary models load via Suspense — avoids GPU texture upload spike during intro.
SCENE_OBJECTS_PRIMARY.forEach(({ path }) => {
  useGLTF.preload(import.meta.env.BASE_URL + path);
});

// Defer secondary preloads to after initial paint via idle callback.
if (typeof window !== "undefined") {
  const idlePreload = () => {
    SCENE_OBJECTS_SECONDARY.forEach(({ path }) => {
      useGLTF.preload(import.meta.env.BASE_URL + path);
    });
  };
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(idlePreload);
  } else {
    setTimeout(idlePreload, 100);
  }
}

export function Model({
  path,
  position,
  scale,
  rotationY = 0,
}: Omit<SceneObject, "label">) {
  const url = import.meta.env.BASE_URL + path;
  const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    applyMaterialPolicy(c, path);
    return c;
  }, [scene, path]);

  return (
    <primitive
      object={cloned}
      position={position}
      scale={scale}
      rotation-y={rotationY}
    />
  );
}
