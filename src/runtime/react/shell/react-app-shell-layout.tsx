import type { CSSProperties, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { appShell } from "@app/shell/app-shell";
import { siteConfig } from "@shared/config/site.config";
import { designTokenCssVariables } from "@shared/ui/design-tokens";
import {
  Container,
  Eyebrow,
  Heading,
  HintShell,
  Inline,
  Panel,
  Stack,
  Text,
  actionTriggerClassName,
} from "@shared/ui/react";
import type { AppRouteDefinition } from "@shared/types/portfolio";

interface ReactAppShellLayoutProps {
  route: AppRouteDefinition;
  children: ReactNode;
}

const shellStyle = designTokenCssVariables as CSSProperties;

export function ReactAppShellLayout({ route, children }: ReactAppShellLayoutProps) {
  const navigationRoutes = appShell.routes.filter((candidate) => candidate.id !== "home");

  return (
    <div className="app-shell" style={shellStyle}>
      <Container width="wide">
        <header className="shell-header">
          <Stack gap="xs">
            <Eyebrow>{siteConfig.owner.name}</Eyebrow>
            <Heading as="h1" size="hero">
              {appShell.appName}
            </Heading>
            <Text tone="muted">Shared shell, tokens and primitives stay mode-agnostic.</Text>
          </Stack>

          <nav aria-label="Mode switcher">
            <Inline gap="sm" wrap className="mode-switcher">
              {navigationRoutes.map((navigationRoute) => (
                <NavLink
                  key={navigationRoute.id}
                  to={navigationRoute.path}
                  className={({ isActive }) => actionTriggerClassName({ active: isActive })}
                >
                  {navigationRoute.mode}
                </NavLink>
              ))}
            </Inline>
          </nav>
        </header>

        <main className="shell-main">
          <Stack gap="md">
            <HintShell className="route-note" label="Current route">
              <Text>{route.path}</Text>
            </HintShell>
            <Panel as="section" padding="md">
              {children}
            </Panel>
          </Stack>
        </main>
      </Container>
    </div>
  );
}
