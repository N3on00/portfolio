import { NavLink } from "react-router-dom";
import { routeIds } from "@app/routing/route-ids";
import { appShell } from "@app/shell/app-shell";
import { portfolioContent } from "@shared/content/portfolio-content";
import {
  Eyebrow,
  Grid,
  Heading,
  Panel,
  Stack,
  Text,
  actionTriggerClassName,
} from "@shared/ui/react";

const rootPortfolio = portfolioContent.entities.find(
  (entity) => entity.id === portfolioContent.rootPortfolioId && entity.kind === "portfolio",
);

const projects = portfolioContent.entities.filter((entity) => entity.kind === "project");
const classicRoute = appShell.routes.find((route) => route.id === routeIds.classic);
const interactiveRoute = appShell.routes.find((route) => route.id === routeIds.interactive);

export function HomeScreen() {
  return (
    <Stack gap="lg">
      <Stack gap="sm">
        <Eyebrow>Choose your entry point</Eyebrow>
        <Heading as="h2" size="section">
          Do you want the direct portfolio or the room concept?
        </Heading>
        <Text tone="muted" size="lg">
          The normal portfolio is ready now. The interactive room stays as a deliberate concept page until it can create real value beyond novelty.
        </Text>
      </Stack>

      <Grid minItemWidth="18rem">
        <Panel as="article" tone="strong" className="entry-option entry-option--classic">
          <Stack gap="sm">
            <Eyebrow>Recommended now</Eyebrow>
            <Heading as="h3" size="card">
              Normal Portfolio View
            </Heading>
            <Text>
              A fast, professional portfolio page with curated projects, skills, experience, and contact links rendered from the shared content model.
            </Text>
            <Text tone="muted" size="sm">
              Best if you want the clearest version immediately.
            </Text>
            {classicRoute ? (
              <NavLink to={classicRoute.path} className={actionTriggerClassName({ active: false })}>
                Open portfolio
              </NavLink>
            ) : null}
          </Stack>
        </Panel>

        <Panel as="article" className="entry-option entry-option--interactive">
          <Stack gap="sm">
            <Eyebrow>Planned with purpose</Eyebrow>
            <Heading as="h3" size="card">
              Enter the Room Concept
            </Heading>
            <Text>
              A future interactive experience that should explain selected work, trade-offs, and technical thinking through a room metaphor instead of becoming a mini-game.
            </Text>
            <Text tone="muted" size="sm">
              Phaser is a likely option, but only if it serves clarity, pacing, and memorability.
            </Text>
            {interactiveRoute ? (
              <NavLink to={interactiveRoute.path} className={actionTriggerClassName({ active: false })}>
                View concept
              </NavLink>
            ) : null}
          </Stack>
        </Panel>
      </Grid>

      <Grid minItemWidth="16rem">
        <Panel as="article" padding="sm">
          <Stack gap="xs">
            <Eyebrow>Current direct value</Eyebrow>
            <Heading as="h3" size="card">
              {projects.length} curated projects
            </Heading>
            <Text tone="muted">The direct portfolio remains the primary path and should stand on its own even if the room concept never ships.</Text>
          </Stack>
        </Panel>

        <Panel as="article" padding="sm">
          <Stack gap="xs">
            <Eyebrow>Decision rule</Eyebrow>
            <Heading as="h3" size="card">
              Value over gimmicks
            </Heading>
            <Text tone="muted">The interactive mode should only exist if it improves understanding, trust, and recall for real projects.</Text>
          </Stack>
        </Panel>
      </Grid>

      <Text tone="muted" size="sm">
        {rootPortfolio?.summary}
      </Text>
    </Stack>
  );
}
