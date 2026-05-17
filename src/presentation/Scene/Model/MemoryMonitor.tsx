import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

/**
 * Dev-only: logs Three.js memory stats every 3 seconds.
 * Helps verify ArrayBuffer cleanup is working.
 * Only renders in development mode.
 */
export function MemoryMonitor() {
  const { gl } = useThree();
  const lastLog = useRef(0);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastLog.current < 3) return;
    lastLog.current = elapsed;

    const info = gl.info;
    console.table({
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      programs: info.programs?.length ?? "N/A",
    });

    if ("memory" in performance) {
      const mem = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory;
      console.log(
        "[Memory] JS Heap:",
        (mem.usedJSHeapSize / 1048576).toFixed(1),
        "MB"
      );
    }
  });

  return null;
}