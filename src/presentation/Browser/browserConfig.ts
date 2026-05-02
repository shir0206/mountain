import { SECTION_IDS } from "./types";
import About from "./Sections/About/About";
import Contact from "./Sections/Contact/Contact";
import Overview from "./Sections/Overview/Overview";
import Service from "./Sections/Service/Service";

// Section configuration
export const SECTIONS = [
  { id: SECTION_IDS.OVERVIEW, Screen: Overview },
  { id: SECTION_IDS.ABOUT, Screen: About },
  { id: SECTION_IDS.SERVICE, Screen: Service },
  { id: SECTION_IDS.CONTACT, Screen: Contact },
] as const;
