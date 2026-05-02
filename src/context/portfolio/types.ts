import { type LanguageType } from "../../shared/i18n/types";

export const BROWSER_MODE = {
  OPEN: "open",
  MINIMIZED: "minimized",
  MAXIMIZED: "maximized",
  CLOSED: "closed",
} as const;

export type BrowserModeType =
  (typeof BROWSER_MODE)[keyof typeof BROWSER_MODE];

// Section identifiers are shared state (visibleSectionIds lives here);
// presentation/Browser/types.ts re-exports them so Browser modules keep
// their current import paths without context → presentation dependency.
export const SECTION_IDS = {
  OVERVIEW: "overview",
  ABOUT: "about",
  SERVICE: "service",
  CONTACT: "contact",
} as const;

export type SectionIdType = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export interface PortfolioState {
  browserMode: BrowserModeType;
  visibleSectionIds: Set<SectionIdType>;
  language: LanguageType;
}

export type PortfolioAction =
  | { type: "SET_BROWSER_MODE"; mode: BrowserModeType }
  | { type: "SET_VISIBLE_SECTIONS"; sections: Set<SectionIdType> }
  | { type: "CLEAR_VISIBLE" }
  | { type: "SET_LANGUAGE"; language: LanguageType };

export interface PortfolioContextType extends PortfolioState {
  setBrowserMode: (
    mode: BrowserModeType | ((prev: BrowserModeType) => BrowserModeType)
  ) => void;
  setVisibleSectionIds: (sections: Set<SectionIdType>) => void;
  clearVisible: () => void;
  setLanguage: (language: LanguageType) => void;
}
