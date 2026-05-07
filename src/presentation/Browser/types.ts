import React from "react";

// Re-exported from canonical location in context/portfolio. SECTION_IDS is
// shared state (visibleSectionIds set) so it lives in context; re-exported
// here to keep presentation/Browser import paths stable.
export {
  BROWSER_MODE,
  type BrowserModeType,
  SECTION_IDS,
  type SectionIdType,
} from "../../context/portfolio/types";

import { type SectionIdType } from "../../context/portfolio/types";

export interface SectionConfig {
  id: SectionIdType;
  title: string;
  component: React.ComponentType;
}
