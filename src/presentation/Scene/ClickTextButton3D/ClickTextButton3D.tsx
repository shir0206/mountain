import { useCallback } from "react";
import * as P from "../config/positions";
import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { useSceneContext } from "../../../context/scene/useSceneContext";
import { BROWSER_MODE } from "../../../context/portfolio/types";

/**
 * Transparent clickable plane over the "click text" on the tablet.
 * 50% of table width, opens browser on click.
 */
export function ClickTextButton3D() {
  const { setBrowserMode } = usePortfolioContext();
  const { setRunIntro } = useSceneContext();

  const onClick = useCallback(() => {
    setBrowserMode(BROWSER_MODE.OPEN);
    setRunIntro(false);
  }, [setBrowserMode, setRunIntro]);

  // 50% of table width (~1 unit wide, 0.6 deep)
  const width = P.TABLE.SCALE * 0.5;
  const depth = P.TABLE.SCALE * 0.3;

  return (
    <mesh
      position={[P.TABLET_TEXT.X, P.TABLET_TEXT.Y + 0.05, P.TABLET_TEXT.Z]}
      rotation-x={-Math.PI / 2}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
