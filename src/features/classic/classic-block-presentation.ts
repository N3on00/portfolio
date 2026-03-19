import type { ClassicRenderBlock } from "./classic-rendering-types";

export interface ClassicBlockPresentation {
  label: string;
  htmlClassName: string;
  reactClassName: string;
}

const blockPresentationRegistry: Record<ClassicRenderBlock["type"], ClassicBlockPresentation> = {
  lede: { label: "Intro", htmlClassName: "classic-block-lede", reactClassName: "classic-react-block is-lede" },
  "fact-list": { label: "Facts", htmlClassName: "classic-block-facts", reactClassName: "classic-react-block is-facts" },
  "bullet-list": {
    label: "Bullets",
    htmlClassName: "classic-block-bullets",
    reactClassName: "classic-react-block is-bullets",
  },
  "card-grid": { label: "Highlights", htmlClassName: "classic-block-grid", reactClassName: "classic-react-block is-grid" },
  "tag-groups": { label: "Groups", htmlClassName: "classic-block-groups", reactClassName: "classic-react-block is-groups" },
  timeline: {
    label: "Timeline",
    htmlClassName: "classic-block-timeline",
    reactClassName: "classic-react-block is-timeline",
  },
  "link-list": { label: "Links", htmlClassName: "classic-block-links", reactClassName: "classic-react-block is-links" },
  "quote-list": {
    label: "References",
    htmlClassName: "classic-block-quotes",
    reactClassName: "classic-react-block is-quotes",
  },
  action: { label: "Action", htmlClassName: "classic-block-action", reactClassName: "classic-react-block is-action" },
};

export const getClassicBlockPresentation = (block: ClassicRenderBlock): ClassicBlockPresentation =>
  blockPresentationRegistry[block.type];
