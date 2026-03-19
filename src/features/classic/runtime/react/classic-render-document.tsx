import type { ReactNode } from "react";
import type {
  ClassicActionBlock,
  ClassicCardGridBlock,
  ClassicFactListBlock,
  ClassicLinkListBlock,
  ClassicQuoteListBlock,
  ClassicRenderBlock,
  ClassicRenderDocument,
  ClassicRenderSection,
  ClassicTagGroupsBlock,
  ClassicTimelineBlock,
} from "@features/classic";
import { classicSectionRegistry } from "@features/classic";
import { Eyebrow, Grid, Heading, Inline, Panel, Stack, Surface, Text } from "@shared/ui/react";

const sectionMetaById = new Map(classicSectionRegistry.map((section) => [section.id, section]));

const renderLinks = (block: ClassicLinkListBlock | ClassicActionBlock): ReactNode => {
  if (!block.links.length) {
    return null;
  }

  return (
    <Stack gap="xs">
      {block.links.map((link) => (
        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="classic-react-link">
          {link.label}
        </a>
      ))}
    </Stack>
  );
};

const renderFactList = (block: ClassicFactListBlock): ReactNode => (
  <div className="classic-react-facts">
    {block.items.map((item) => (
      <div key={item.label} className="classic-react-facts__item">
        <Eyebrow>{item.label}</Eyebrow>
        <Text>{item.value}</Text>
      </div>
    ))}
  </div>
);

const renderCardGrid = (block: ClassicCardGridBlock): ReactNode => (
  <Grid minItemWidth="16rem">
    {block.items.map((item) => (
      <Panel key={item.title} as="article" padding="sm" tone="strong">
        <Stack gap="xs">
          {item.eyebrow ? <Eyebrow>{item.eyebrow}</Eyebrow> : null}
          <Heading as="h4" size="card">
            {item.title}
          </Heading>
          <Text>{item.text}</Text>
          {item.tags.length ? (
            <Inline gap="xs" wrap>
              {item.tags.map((tag) => (
                <Text key={tag} size="sm" tone="muted" className="classic-react-tag">
                  {tag}
                </Text>
              ))}
            </Inline>
          ) : null}
          {item.bullets.length ? (
            <ul className="classic-react-list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>
                  <Text size="sm">{bullet}</Text>
                </li>
              ))}
            </ul>
          ) : null}
          {renderLinks({ type: "link-list", links: item.links })}
        </Stack>
      </Panel>
    ))}
  </Grid>
);

const renderTagGroups = (block: ClassicTagGroupsBlock): ReactNode => (
  <Grid minItemWidth="14rem">
    {block.groups.map((group) => (
      <Panel key={group.label} as="section" padding="sm">
        <Stack gap="xs">
          <Heading as="h4" size="card">
            {group.label}
          </Heading>
          <Inline gap="xs" wrap>
            {group.items.map((item) => (
              <Text key={item} size="sm" tone="muted" className="classic-react-tag">
                {item}
              </Text>
            ))}
          </Inline>
        </Stack>
      </Panel>
    ))}
  </Grid>
);

const renderTimeline = (block: ClassicTimelineBlock): ReactNode => (
  <Stack gap="sm">
    {block.items.map((item) => (
      <Panel key={`${item.label ?? ""}-${item.title}`} as="article" padding="sm">
        <Stack gap="xs">
          {item.label ? <Eyebrow>{item.label}</Eyebrow> : null}
          <Heading as="h4" size="card">
            {item.title}
          </Heading>
          <Text>{item.text}</Text>
          {item.bullets.length ? (
            <ul className="classic-react-list">
              {item.bullets.map((bullet) => (
                <li key={bullet}>
                  <Text size="sm">{bullet}</Text>
                </li>
              ))}
            </ul>
          ) : null}
        </Stack>
      </Panel>
    ))}
  </Stack>
);

const renderQuotes = (block: ClassicQuoteListBlock): ReactNode => (
  <Stack gap="sm">
    {block.items.map((item) => (
      <Panel key={item.title} as="article" padding="sm" tone="strong">
        <Stack gap="xs">
          <Heading as="h4" size="card">
            {item.title}
          </Heading>
          <Text>{item.text}</Text>
        </Stack>
      </Panel>
    ))}
  </Stack>
);

const renderBlock = (block: ClassicRenderBlock): ReactNode => {
  switch (block.type) {
    case "lede":
      return <Text size="lg">{block.text}</Text>;
    case "fact-list":
      return renderFactList(block);
    case "bullet-list":
      return (
        <ul className="classic-react-list">
          {block.items.map((item) => (
            <li key={item}>
              <Text>{item}</Text>
            </li>
          ))}
        </ul>
      );
    case "card-grid":
      return renderCardGrid(block);
    case "tag-groups":
      return renderTagGroups(block);
    case "timeline":
      return renderTimeline(block);
    case "link-list":
      return (
        <Stack gap="sm">
          {block.text ? <Text tone="muted">{block.text}</Text> : null}
          {renderLinks(block)}
        </Stack>
      );
    case "quote-list":
      return renderQuotes(block);
    case "action":
      return (
        <Panel as="article" padding="sm" tone="strong">
          <Stack gap="sm">
            <Heading as="h4" size="card">
              {block.title}
            </Heading>
            <Text>{block.text}</Text>
            {renderLinks(block)}
          </Stack>
        </Panel>
      );
    default:
      return null;
  }
};

const renderSection = (section: ClassicRenderSection): ReactNode => (
  <Surface key={section.id} as="section" padding="lg" className="classic-react-section">
    <Stack gap="md">
      <Stack gap="xs">
        {section.kicker ? <Eyebrow>{section.kicker}</Eyebrow> : null}
        <Heading as="h3" size="section">
          {section.title}
        </Heading>
        {section.summary ? <Text tone="muted">{section.summary}</Text> : null}
      </Stack>
      <Stack gap="md">{section.blocks.map((block, index) => <div key={`${section.id}-${index}`}>{renderBlock(block)}</div>)}</Stack>
    </Stack>
  </Surface>
);

export function ClassicRenderDocumentView({ document }: { document: ClassicRenderDocument }) {
  return (
    <Stack gap="lg">
      <Surface as="section" padding="lg" tone="strong">
        <Stack gap="sm">
          <Eyebrow>Classic portfolio mode</Eyebrow>
          <Heading as="h2" size="hero">
            {document.title}
          </Heading>
          <Text tone="muted" size="lg">
            {document.subtitle}
          </Text>
          <Inline gap="xs" wrap>
            {document.sections.map((section) => {
              const meta = sectionMetaById.get(section.id);

              return (
                <Text key={section.id} size="sm" tone="muted" className="classic-react-tag">
                  {meta?.scanPriority ?? "secondary"}: {section.title}
                </Text>
              );
            })}
          </Inline>
        </Stack>
      </Surface>
      <Stack gap="md">{document.sections.map(renderSection)}</Stack>
    </Stack>
  );
}
