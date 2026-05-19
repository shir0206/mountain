import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { drainPendingTextures } from "../Model/applyMaterialPolicy";

const BATCH_SIZE = 3; // textures per idle callback to avoid jank

/**
 * After the intro animation completes, upgrades deferred textures to full
 * quality (mipmaps + anisotropy 16) in small batches during idle time.
 * This spreads GPU upload cost across multiple frames.
 */
export function useUploadTexturesOnIdle(enabled: boolean) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    function processBatch() {
      if (cancelled) return;

      const textures = drainPendingTextures();
      if (textures.length === 0) return;

      // Process in batches across multiple idle callbacks
      let idx = 0;

      function uploadNextBatch(_deadline?: IdleDeadline) {
        if (cancelled) return;

        const end = Math.min(idx + BATCH_SIZE, textures.length);
        for (; idx < end; idx++) {
          const texture = textures[idx];
          texture.anisotropy = 16;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;
          // Force GPU upload now
          gl.initTexture(texture);
        }

        if (idx < textures.length) {
          scheduleNext(uploadNextBatch);
        }
      }

      scheduleNext(uploadNextBatch);
    }

    // Small delay to let the intro finish rendering smoothly
    const timer = setTimeout(processBatch, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, gl]);
}

function scheduleNext(cb: (deadline?: IdleDeadline) => void) {
  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: (d: IdleDeadline) => void) => void })
      .requestIdleCallback(cb);
  } else {
    setTimeout(() => cb(), 32);
  }
}