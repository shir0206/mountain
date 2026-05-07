import { useCallback } from "react";

import { usePortfolioContext } from "../../../../../context/portfolio/usePortfolioContext";
import { type LanguageType } from "../../../../../shared/i18n/types";

export const useSwitchLanguage = (): ((language: LanguageType) => void) => {
  const { setLanguage } = usePortfolioContext();

  return useCallback(
    (language: LanguageType) => {
      setLanguage(language);
    },
    [setLanguage]
  );
};
