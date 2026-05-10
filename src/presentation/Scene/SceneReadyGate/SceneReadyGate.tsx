import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import { useSceneContext } from "../../../context/scene/useSceneContext";

/**
 * Waits for assets + shaders + N stable frames, then sets sceneReady=true.
 * Ensures intro animation never starts before renderer is visibly active.
 */
export function SceneReadyGate() {
  const { active, progress } = useProgress();
  const { setSceneReady } = useSceneContext();
  const frameCountRef = useRef(0);
  const readyRef = useRef(false);

  useFrame(() => {
    if (readyRef.current) return;
    if (active || progress < 100) return;

    // Count 3 frames after assets load to ensure GPU has flushed
    // (ShaderWarmup runs once at progress=100, so frames 1–3 are post-compile)
    frameCountRef.current++;
    if (frameCountRef.current >= 3) {
      readyRef.current = true;
      setSceneReady(true);
    }
  });

  return null;
}
