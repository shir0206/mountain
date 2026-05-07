import type { LanguageType, TextStructure } from "./types";
import en from "./translations/en.json";
import he from "./translations/he.json";

const translations: Record<LanguageType, TextStructure> = {
  en: en as TextStructure,
  he: he as TextStructure,
};

export function getText(language: LanguageType): TextStructure {
  return translations[language];
}
