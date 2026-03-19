import type { ContentLink } from "@shared/types/portfolio";

export interface ClassicRenderDocument {
  mode: "classic";
  title: string;
  subtitle: string;
  sections: ClassicRenderSection[];
}

export interface ClassicRenderSection {
  id: string;
  title: string;
  kicker?: string;
  summary?: string;
  blocks: ClassicRenderBlock[];
}

export type ClassicRenderBlock =
  | ClassicLedeBlock
  | ClassicFactListBlock
  | ClassicBulletListBlock
  | ClassicCardGridBlock
  | ClassicTagGroupsBlock
  | ClassicTimelineBlock
  | ClassicLinkListBlock
  | ClassicQuoteListBlock
  | ClassicActionBlock;

export interface ClassicLedeBlock {
  type: "lede";
  text: string;
}

export interface ClassicFactListBlock {
  type: "fact-list";
  items: Array<{ label: string; value: string }>;
}

export interface ClassicBulletListBlock {
  type: "bullet-list";
  items: string[];
}

export interface ClassicCardGridBlock {
  type: "card-grid";
  items: Array<{
    eyebrow?: string;
    title: string;
    text: string;
    tags: string[];
    bullets: string[];
    links: ContentLink[];
  }>;
}

export interface ClassicTagGroupsBlock {
  type: "tag-groups";
  groups: Array<{
    label: string;
    items: string[];
  }>;
}

export interface ClassicTimelineBlock {
  type: "timeline";
  items: Array<{
    label?: string;
    title: string;
    text: string;
    bullets: string[];
  }>;
}

export interface ClassicLinkListBlock {
  type: "link-list";
  text?: string;
  links: ContentLink[];
}

export interface ClassicQuoteListBlock {
  type: "quote-list";
  items: Array<{
    title: string;
    text: string;
  }>;
}

export interface ClassicActionBlock {
  type: "action";
  title: string;
  text: string;
  links: ContentLink[];
}
