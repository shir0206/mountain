export type LanguageType = "en" | "he";

export interface HeroAction {
  label: string;
  href: string;
  style: "primary" | "ghost";
}

export interface ServiceCard {
  num: string;
  name: string;
  desc: string;
}

export interface ProcessStep {
  icon: string;
  name: string;
  desc: string;
}

export interface AIPillar {
  icon: string;
  title: string;
  text: string;
  items: string[];
}

export interface ExploreArea {
  label: string;
  subtitle: string;
}

export interface TextStructure {
  browser: {
    windowControls: {
      close: string;
      minimize: string;
      maximize: string;
    };
    title: string;
  };
  navigation: {
    overview: string;
    about: string;
    service: string;
    process: string;
    ai: string;
    contact: string;
    cta: string;
    logo: string;
    logoSeparator: string;
    logoLastName: string;
    logoShort: string;
    logoShortLastName: string;
  };
  hero: {
    name: string;
    titleLine: string;
    titleEmphasis: string;
    sub: string;
    actions: HeroAction[];
  };
  about: {
    label: string;
    titleLine: string;
    titleEmphasis: string;
    paragraphs: string[];
    photoHint: string;
  };
  service: {
    label: string;
    titleLine: string;
    titleEmphasis: string;
    cardsLabel: string;
    cards: ServiceCard[];
    processLabel: string;
    processTitle: string;
    processIntro: string;
    steps: ProcessStep[];
  };
  ai: {
    label: string;
    titleLine: string;
    titleEmphasis: string;
    introText: string;
    introSub: string;
    pillars: AIPillar[];
    footerText: string;
  };
  contact: {
    titleLine: string;
    titleLine2: string;
    sub: string;
    email: string;
    form: {
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      submit: string;
      successMsg: string;
    };
  };
  footer: {
    name: string;
    copy: string;
  };
  overlay: {
    identity: {
      name: string;
      email: string;
      emailSubject: string;
    };
    welcome: {
      title: string;
      subtitle: string;
    };
    dragHint: {
      title: string;
      subtitle: string;
    };
    portalCta: {
      label: string;
    };
    exploreBar: {
      ariaLabel: string;
      areas: ExploreArea[];
    };
    contactPill: {
      ariaLabel: string;
      email: string;
    };
  };
}
