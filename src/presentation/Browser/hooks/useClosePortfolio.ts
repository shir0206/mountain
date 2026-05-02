import { useCallback } from "react";

import { usePortfolioContext } from "../../../context/portfolio/usePortfolioContext";
import { BROWSER_MODE } from "../../../context/portfolio/types";

export const useClosePortfolio = (): (() => void) => {
  const { setBrowserMode, clearVisible } = usePortfolioContext();

  return useCallback(() => {
    clearVisible();
    setBrowserMode(BROWSER_MODE.CLOSED);
  }, [clearVisible, setBrowserMode]);
};
