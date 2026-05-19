import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useProgress, useGLTF } from "@react-three/drei";
import { useSceneContext } from "../../../context/scene/useSceneContext";

/**
 * Waits for assets + shaders + N stable frames, then sets sceneReady=true
 * and fires the onReady callback (used to start intro animation directly
 * without an intermediate useEffect).
 */
export function SceneReadyGate({ onReady }: { onReady?: () => void }) {
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

      // Dispose DRACO decoder workers + buffers now that all models are loaded.
      // The decoded geometry is already in GPU memory.
      try {
        const dracoLoader = (
          useGLTF as unknown as { dracoLoader?: { dispose(): void } }
        ).dracoLoader;
        if (dracoLoader) {
          dracoLoader.dispose();
        }
      } catch {
        // Silently ignore if drei internals change
      }

      onReady?.();
    }
  });

  return null;
}
