import type { LanguageType } from "./types";

export const LANGUAGE = {
  EN: "en" as LanguageType,
  HE: "he" as LanguageType,
} as const;

const RTL_LANGUAGES: ReadonlySet<LanguageType> = new Set([LANGUAGE.HE]);

const DISPLAY_NAMES: Record<LanguageType, string> = {
  en: "English",
  he: "עברית",
};

export function isRTL(language: LanguageType): boolean {
  return RTL_LANGUAGES.has(language);
}

export function displayName(language: LanguageType): string {
  return DISPLAY_NAMES[language];
}
