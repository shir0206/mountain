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
    title: string;
    paragraphs: string[];
    photoHint: string;
  };
  service: {
    label: string;
    title: string;
    cardsLabel: string;
    cards: ServiceCard[];
    processLabel: string;
    processTitle: string;
    processIntro: string;
    steps: ProcessStep[];
  };
  ai: {
    label: string;
    title: string;
    introText: string;
    introSub: string;
    pillars: AIPillar[];
    footerText: string;
  };
  contact: {
    title: string;
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
}
