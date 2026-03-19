import { portfolioContent } from "@shared/content/portfolio-content";
import { createClassicRenderDocument } from "./classic-render-flow";
import { renderClassicDocument } from "./classic-renderer";

export const classicRenderDocument = createClassicRenderDocument(portfolioContent);

export const classicModeHtml = renderClassicDocument(classicRenderDocument);
