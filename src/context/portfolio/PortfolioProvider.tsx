import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import { isRTL, LANGUAGE } from "../../shared/i18n/language";
import type { LanguageType } from "../../shared/i18n/types";
import { PortfolioContext } from "./PortfolioContext";
import {
  BROWSER_MODE,
  type BrowserModeType,
  type PortfolioAction,
  type PortfolioState,
  type SectionIdType,
} from "./types";

const initialState: PortfolioState = {
  browserMode: BROWSER_MODE.CLOSED,
  visibleSectionIds: new Set(),
  language: LANGUAGE.EN,
};

function reducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case "SET_BROWSER_MODE":
      return { ...state, browserMode: action.mode };
    case "SET_VISIBLE_SECTIONS":
      return { ...state, visibleSectionIds: action.sections };
    case "CLEAR_VISIBLE":
      return { ...state, visibleSectionIds: new Set() };
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    default:
      return state;
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.documentElement.setAttribute("lang", state.language);
    document.documentElement.setAttribute(
      "dir",
      isRTL(state.language) ? "rtl" : "ltr"
    );
  }, [state.language]);

  const setBrowserMode = useCallback(
    (
      mode: BrowserModeType | ((prev: BrowserModeType) => BrowserModeType)
    ) => {
      dispatch({
        type: "SET_BROWSER_MODE",
        mode: typeof mode === "function" ? mode(state.browserMode) : mode,
      });
    },
    [state.browserMode]
  );

  const setVisibleSectionIds = useCallback((sections: Set<SectionIdType>) => {
    dispatch({ type: "SET_VISIBLE_SECTIONS", sections });
  }, []);

  const clearVisible = useCallback(() => {
    dispatch({ type: "CLEAR_VISIBLE" });
  }, []);

  const setLanguage = useCallback((language: LanguageType) => {
    dispatch({ type: "SET_LANGUAGE", language });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      setBrowserMode,
      setVisibleSectionIds,
      clearVisible,
      setLanguage,
    }),
    [state, setBrowserMode, setVisibleSectionIds, clearVisible, setLanguage]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
