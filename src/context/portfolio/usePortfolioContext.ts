import { useContext } from "react";

import { PortfolioContext } from "./PortfolioContext";
import { type PortfolioContextType } from "./types";

export const usePortfolioContext = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error(
      "usePortfolioContext must be used within PortfolioProvider"
    );
  }
  return context;
};
