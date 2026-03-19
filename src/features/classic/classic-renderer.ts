import { designTokens } from "@shared/ui/design-tokens";
import type { ContentLink } from "@shared/types/portfolio";
import { getClassicBlockPresentation } from "./classic-block-presentation";
import type { ClassicRenderBlock, ClassicRenderDocument } from "./classic-rendering-types";

export const renderClassicDocument = (document: ClassicRenderDocument): string => {
  const css = createClassicCss();
  const sections = document.sections.map(renderSection).join("");

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `  <title>${escapeHtml(document.title)} - Classic Mode</title>`,
    `  <style>${css}</style>`,
    "</head>",
    '<body class="classic-body">',
    '  <main class="classic-shell">',
    '    <header class="classic-header">',
    '      <p class="classic-mode-label">Classic portfolio mode</p>',
    `      <h1>${escapeHtml(document.title)}</h1>`,
    `      <p class="classic-subtitle">${escapeHtml(document.subtitle)}</p>`,
    "    </header>",
    sections,
    "  </main>",
    "</body>",
    "</html>",
  ].join("");
};

const renderSection = (section: ClassicRenderDocument["sections"][number]): string => {
  const blocks = section.blocks.map(renderBlock).join("");
  const summary = section.summary
    ? `<p class="classic-section-summary">${escapeHtml(section.summary)}</p>`
    : "";
  const kicker = section.kicker
    ? `<p class="classic-kicker">${escapeHtml(section.kicker)}</p>`
    : "";

  return [
    `<section class="classic-section" data-section="${escapeHtml(section.id)}">`,
    '  <div class="classic-section-heading">',
    `    ${kicker}`,
    `    <h2>${escapeHtml(section.title)}</h2>`,
    `    ${summary}`,
    "  </div>",
    `  <div class="classic-section-content">${blocks}</div>`,
    "</section>",
  ].join("");
};

const renderBlock = (block: ClassicRenderBlock): string => {
  const presentation = getClassicBlockPresentation(block);

  switch (block.type) {
    case "lede":
      return `<div class="classic-block ${presentation.htmlClassName}"><p class="classic-lede">${escapeHtml(block.text)}</p></div>`;
    case "fact-list":
      return `<div class="classic-block ${presentation.htmlClassName}"><dl class="classic-facts">${block.items
        .map(
          (item) =>
            `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`,
        )
        .join("")}</dl></div>`;
    case "bullet-list":
      return `<div class="classic-block ${presentation.htmlClassName}"><ul class="classic-bullets">${block.items
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul></div>`;
    case "card-grid":
      return `<div class="classic-block ${presentation.htmlClassName}"><div class="classic-grid">${block.items
        .map(
          (item) => `
            <article class="classic-card">
              ${item.eyebrow ? `<p class="classic-card-eyebrow">${escapeHtml(item.eyebrow)}</p>` : ""}
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
              ${renderTagList(item.tags)}
              ${renderBulletList(item.bullets)}
              ${renderLinks(item.links)}
            </article>`,
        )
        .join("")}</div></div>`;
    case "tag-groups":
      return `<div class="classic-block ${presentation.htmlClassName}"><div class="classic-groups">${block.groups
        .map(
          (group) => `
            <section class="classic-group">
              <h3>${escapeHtml(group.label)}</h3>
              ${renderTagList(group.items)}
            </section>`,
        )
        .join("")}</div></div>`;
    case "timeline":
      return `<div class="classic-block ${presentation.htmlClassName}"><div class="classic-timeline">${block.items
        .map(
          (item) => `
            <article class="classic-timeline-item">
              ${item.label ? `<p class="classic-card-eyebrow">${escapeHtml(item.label)}</p>` : ""}
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
              ${renderBulletList(item.bullets)}
            </article>`,
        )
        .join("")}</div></div>`;
    case "link-list":
      return `
        <div class="classic-block ${presentation.htmlClassName}">
          <p class="classic-block-label">${escapeHtml(presentation.label)}</p>
          <div class="classic-links-block">
          ${block.text ? `<p class="classic-links-copy">${escapeHtml(block.text)}</p>` : ""}
          ${renderLinks(block.links)}
          </div>
        </div>`;
    case "quote-list":
      return `<div class="classic-block ${presentation.htmlClassName}"><div class="classic-quotes">${block.items
        .map(
          (item) => `
            <article class="classic-quote">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.text)}</p>
            </article>`,
        )
        .join("")}</div></div>`;
    case "action":
      return `
        <div class="classic-block ${presentation.htmlClassName}">
          <p class="classic-block-label">${escapeHtml(presentation.label)}</p>
          <div class="classic-action">
          <h3>${escapeHtml(block.title)}</h3>
          <p>${escapeHtml(block.text)}</p>
          ${renderLinks(block.links)}
          </div>
        </div>`;
    default:
      return "";
  }
};

const renderTagList = (items: string[]): string => {
  if (!items.length) {
    return "";
  }

  return `<ul class="classic-tags">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
};

const renderBulletList = (items: string[]): string => {
  if (!items.length) {
    return "";
  }

  return `<ul class="classic-bullets classic-bullets-compact">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
};

const renderLinks = (links: ContentLink[]): string => {
  if (!links.length) {
    return "";
  }

  return `<ul class="classic-links">${links
    .map(
      (link) =>
        `<li><a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(
          link.label,
        )}</a></li>`,
    )
    .join("")}</ul>`;
};

const createClassicCss = (): string => {
  const { color, spacing, typography } = designTokens;

  return `
    :root {
      color-scheme: light;
      --background: ${color.background};
      --foreground: ${color.foreground};
      --muted: ${color.muted};
      --border: ${color.border};
      --space-sm: ${spacing.sm};
      --space-md: ${spacing.md};
      --space-lg: ${spacing.lg};
      --space-xl: ${spacing.xl};
      --display: ${typography.display};
      --body: ${typography.body};
      --text-sm: ${typography.scale.sm};
      --text-md: ${typography.scale.md};
      --text-lg: ${typography.scale.lg};
      --text-xl: ${typography.scale.xl};
      --surface: #ffffff;
    }

    * { box-sizing: border-box; }
    body.classic-body {
      margin: 0;
      background: linear-gradient(180deg, #fafaf7 0%, var(--background) 100%);
      color: var(--foreground);
      font-family: var(--body);
    }

    .classic-shell {
      width: min(100%, 72rem);
      margin: 0 auto;
      padding: 4rem 1.5rem 5rem;
    }

    .classic-header,
    .classic-section {
      border-top: 1px solid var(--border);
      padding-top: var(--space-xl);
    }

    .classic-header {
      border-top: 0;
      padding-top: 0;
      margin-bottom: 3rem;
    }

    .classic-mode-label,
    .classic-kicker,
    .classic-card-eyebrow {
      margin: 0 0 var(--space-sm);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.75rem;
      color: var(--muted);
    }

    h1,
    h2,
    h3,
    p,
    ul,
    dl {
      margin-top: 0;
    }

    h1,
    h2,
    h3 {
      font-family: var(--display);
      font-weight: 600;
      letter-spacing: -0.03em;
    }

    h1 {
      margin-bottom: var(--space-sm);
      font-size: clamp(2.6rem, 8vw, 5rem);
      line-height: 0.95;
    }

    h2 {
      margin-bottom: var(--space-sm);
      font-size: clamp(1.5rem, 3vw, 2.2rem);
    }

    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }

    .classic-subtitle,
    .classic-section-summary,
    .classic-lede,
    .classic-card p,
    .classic-timeline-item p,
    .classic-quote p,
    .classic-action p,
    .classic-links-copy {
      color: var(--muted);
      line-height: 1.6;
      max-width: 48rem;
      font-size: var(--text-md);
    }

    .classic-block {
      margin-bottom: var(--space-lg);
    }

    .classic-block-label {
      margin: 0 0 var(--space-sm);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-size: 0.75rem;
      color: var(--muted);
    }

    .classic-section {
      display: grid;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .classic-section-content {
      display: grid;
      gap: var(--space-lg);
    }

    .classic-facts {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
      gap: var(--space-md);
      margin-bottom: 0;
    }

    .classic-facts div,
    .classic-card,
    .classic-group,
    .classic-timeline-item,
    .classic-quote,
    .classic-action {
      padding: 1rem 1.1rem;
      border: 1px solid var(--border);
      background: color-mix(in srgb, var(--surface) 92%, transparent);
    }

    .classic-facts dt {
      margin-bottom: 0.35rem;
      color: var(--muted);
      font-size: var(--text-sm);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .classic-facts dd {
      margin: 0;
      font-size: var(--text-md);
      font-weight: 600;
    }

    .classic-bullets,
    .classic-tags,
    .classic-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      padding: 0;
      margin-bottom: 0;
      list-style: none;
    }

    .classic-bullets li,
    .classic-tags li,
    .classic-links a {
      border: 1px solid var(--border);
      padding: 0.45rem 0.7rem;
      font-size: var(--text-sm);
    }

    .classic-bullets li {
      background: #fff;
    }

    .classic-tags li {
      color: var(--muted);
      background: transparent;
    }

    .classic-links a {
      display: inline-flex;
      color: var(--foreground);
      text-decoration: none;
      background: #fff;
    }

    .classic-links a:hover,
    .classic-links a:focus-visible {
      background: var(--foreground);
      color: #fff;
      outline: none;
    }

    .classic-grid,
    .classic-groups,
    .classic-timeline,
    .classic-quotes {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: var(--space-md);
    }

    .classic-bullets-compact {
      margin-top: 1rem;
    }

    @media (max-width: 640px) {
      .classic-shell {
        padding: 2rem 1rem 3rem;
      }

      .classic-grid,
      .classic-groups,
      .classic-timeline,
      .classic-quotes {
        grid-template-columns: 1fr;
      }
    }
  `;
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttribute = (value: string): string => escapeHtml(value);
