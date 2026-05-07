import { createContext } from "react";

import { type PortfolioContextType } from "./types";

export const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);
