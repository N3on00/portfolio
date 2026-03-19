import { classicModeDefinition } from "@features/classic/classic-mode.contract";
import { classicSectionRegistry } from "@features/classic/sections/section-registry";
import { portfolioContent } from "@shared/content/portfolio-content";
import {
  Eyebrow,
  Grid,
  Heading,
  HintShell,
  Panel,
  Stack,
  Surface,
  Text,
} from "@shared/ui/react";

const countEntities = (kind: string) =>
  portfolioContent.entities.filter((entity) => entity.kind === kind).length;

const rootPortfolio = portfolioContent.entities.find(
  (entity) => entity.id === portfolioContent.rootPortfolioId && entity.kind === "portfolio",
);

const sectionCounts = {
  projects: () => countEntities("project"),
  skills: () => countEntities("skill"),
  experience: () => countEntities("experience"),
  contact: () => rootPortfolio?.links?.length ?? 0,
};

export function ClassicModeScreen() {
  return (
    <Surface as="section" padding="lg" aria-labelledby="classic-mode-title">
      <Stack gap="lg">
        <Stack gap="sm">
          <Eyebrow>Classic runtime foundation</Eyebrow>
          <Heading as="h2" size="section" id="classic-mode-title">
            {classicModeDefinition.label}
          </Heading>
          <Text tone="muted" size="lg">
            The mode stays scan-friendly, while layout primitives, panels, typography and action styling all come from the shared layer.
          </Text>
        </Stack>

        <Grid>
          <Panel as="article" tone="strong">
            <Stack gap="sm">
              <Eyebrow>Section registry</Eyebrow>
              <Heading as="h3" size="card">
                Composable overview
              </Heading>
              <Text>
                Sections are registered structurally so layout work can evolve without changing route wiring.
              </Text>
            </Stack>
          </Panel>

          <Panel as="article" tone="strong">
            <Stack gap="sm">
              <Eyebrow>Shared content</Eyebrow>
              <Heading as="h3" size="card">
                Mapped, not duplicated
              </Heading>
              <Text>
                Identity source: {rootPortfolio?.title ?? "Portfolio root"}. Section data stays in shared content.
              </Text>
            </Stack>
          </Panel>
        </Grid>

        <HintShell label="Shared stays generic">
          <Text>
            Shared UI owns shells, spacing and typography helpers. Section ordering, scan priority and content mapping stay in the classic feature.
          </Text>
        </HintShell>

        <Stack gap="sm" aria-label="Classic sections">
          {classicSectionRegistry.map((section) => (
            <Panel key={section.id} as="article" padding="sm">
              <Stack gap="xs">
                <Eyebrow>Section</Eyebrow>
                <Heading as="h3" size="card">
                  {section.label}
                </Heading>
                <Text tone="muted">Connected entries: {sectionCounts[section.contentKey]()}.</Text>
              </Stack>
            </Panel>
          ))}
        </Stack>
      </Stack>
    </Surface>
  );
}
