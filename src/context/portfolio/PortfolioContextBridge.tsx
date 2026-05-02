import React from "react";

import { PortfolioContext } from "./PortfolioContext";
import { type PortfolioContextType } from "./types";

interface PortfolioContextBridgeProps {
  children: React.ReactNode;
  contextValue: PortfolioContextType;
}

/**
 * Portal-safe bridge: re-provides portfolio context inside <Html> portal.
 */
export function PortfolioContextBridge({
  children,
  contextValue,
}: PortfolioContextBridgeProps) {
  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
}
