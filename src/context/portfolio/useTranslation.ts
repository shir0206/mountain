import { useContext } from "react";

import { LANGUAGE } from "../../shared/i18n/language";
import { getText } from "../../shared/i18n/useTranslation";
import { PortfolioContext } from "./PortfolioContext";

/**
 * React hook that returns translations for the current portfolio language.
 * Falls back to English when no provider is mounted (e.g. unit tests).
 */
export function useTranslation() {
  const context = useContext(PortfolioContext);
  const language = context?.language ?? LANGUAGE.EN;
  return { t: getText(language), language };
}
