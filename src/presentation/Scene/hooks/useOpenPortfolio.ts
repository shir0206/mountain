import { useCallback } from "react";

import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { useSceneContext } from "../../../context/scene/useSceneContext";
import { BROWSER_MODE } from "../../../context/portfolio/types";

export const useOpenPortfolio = (): (() => void) => {
  const { setBrowserMode } = usePortfolioContext();
  const { setRunIntro } = useSceneContext();

  return useCallback(() => {
    setBrowserMode(BROWSER_MODE.OPEN);
    setRunIntro(false);
  }, [setBrowserMode, setRunIntro]);
};
