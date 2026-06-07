import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

import type { SceneObject } from "../types";
import {
  SCENE_OBJECTS_PRIMARY,
  SCENE_OBJECTS_SECONDARY,
} from "../config/sceneObjects";
import { applyMaterialPolicy, type TextureTier } from "./applyMaterialPolicy";
import { disposeSceneGraph } from "./disposeSceneGraph";
import { releaseGeometryMemory } from "./releaseGeometryMemory";

// Draco decoder needed for the optimized GLBs (geometry compressed with Draco).
useGLTF.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

// Only preload primary models (mountain, pergola, mud, fences) eagerly.
// Secondary models preload on idle. Tertiary has NO preload — true lazy load.
SCENE_OBJECTS_PRIMARY.forEach(({ path }) => {
  useGLTF.preload(import.meta.env.BASE_URL + path);
});

// Defer secondary preloads to after initial paint via idle callback.
// Tertiary models are intentionally NOT preloaded — they fetch on mount only.
if (typeof window !== "undefined") {
  const idlePreload = () => {
    SCENE_OBJECTS_SECONDARY.forEach(({ path }) => {
      useGLTF.preload(import.meta.env.BASE_URL + path);
    });
  };
  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(idlePreload);
  } else {
    setTimeout(idlePreload, 100);
  }
}

/**
 * Renders nothing visible. Place inside a <Suspense> boundary — when this
 * component mounts it means the Suspense resolved. Fires `onResolved` once.
 */
export function OnSuspenseResolved({ onResolved }: { onResolved: () => void }) {
  const called = useRef(false);
  useEffect(() => {
    if (!called.current) {
      called.current = true;
      onResolved();
    }
  }, [onResolved]);
  return null;
}

/**
 * Clone the Object3D hierarchy without duplicating geometry/material data.
 * Each mesh gets its own Object3D node (for independent transform) but
 * references the SAME BufferGeometry and Material — saving ~100+ MB for
 * scenes with many repeated GLB instances.
 */
function shallowCloneScene(source: THREE.Object3D): THREE.Object3D {
  const cloned = source.clone(false);
  // clone(false) only clones the node itself; we need to walk children manually
  source.children.forEach((child) => {
    const childClone = shallowCloneScene(child);
    cloned.add(childClone);
  });

  // For meshes, share geometry & material by reference (not deep-copied)
  if ((source as THREE.Mesh).isMesh) {
    const srcMesh = source as THREE.Mesh;
    const dstMesh = cloned as THREE.Mesh;
    dstMesh.geometry = srcMesh.geometry; // shared — same ArrayBuffer
    dstMesh.material = srcMesh.material; // shared — same textures
  }
  return cloned;
}

export function Model({
  path,
  position,
  scale,
  rotationY = 0,
  tier = "primary",
}: Omit<SceneObject, "label"> & { tier?: TextureTier }) {
  const url = import.meta.env.BASE_URL + path;
  const { scene } = useGLTF(url) as GLTF & { scene: THREE.Group };

  const cloned = useMemo(() => {
    // Shallow-clone the Object3D hierarchy but SHARE geometry & material
    // references. This avoids duplicating ArrayBuffers for repeated models
    // (fences ×5, plants ×4-5, monitors ×3, etc.) — biggest memory win.
    const c = shallowCloneScene(scene);
    applyMaterialPolicy(c, path, tier);
    // Schedule CPU-side ArrayBuffer release once GPU has uploaded the data
    releaseGeometryMemory(c);
    // R3F calls .dispose() automatically when <primitive> unmounts
    (c as unknown as { dispose: () => void }).dispose = () => disposeSceneGraph(c);
    return c;
  }, [scene, path, tier]);

  return (
    <primitive
      object={cloned}
      position={position}
      scale={scale}
      rotation-y={rotationY}
    />
  );
}

