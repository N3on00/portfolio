import type { CSSProperties, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { appShell } from "@app/shell/app-shell";
import { siteConfig } from "@shared/config/site.config";
import { designTokens } from "@shared/ui/design-tokens";
import type { AppRouteDefinition } from "@shared/types/portfolio";

interface ReactAppShellLayoutProps {
  route: AppRouteDefinition;
  children: ReactNode;
}

const shellStyle = {
  "--color-background": designTokens.color.background,
  "--color-foreground": designTokens.color.foreground,
  "--color-muted": designTokens.color.muted,
  "--color-accent": designTokens.color.accent,
  "--color-border": designTokens.color.border,
  "--space-xs": designTokens.spacing.xs,
  "--space-sm": designTokens.spacing.sm,
  "--space-md": designTokens.spacing.md,
  "--space-lg": designTokens.spacing.lg,
  "--space-xl": designTokens.spacing.xl,
  "--font-display": designTokens.typography.display,
  "--font-body": designTokens.typography.body,
  "--font-size-sm": designTokens.typography.scale.sm,
  "--font-size-md": designTokens.typography.scale.md,
  "--font-size-lg": designTokens.typography.scale.lg,
  "--font-size-xl": designTokens.typography.scale.xl,
} as CSSProperties;

export function ReactAppShellLayout({ route, children }: ReactAppShellLayoutProps) {
  const navigationRoutes = appShell.routes.filter((candidate) => candidate.id !== "home");

  return (
    <div className="app-shell" style={shellStyle}>
      <header className="shell-header">
        <div>
          <p className="shell-eyebrow">{siteConfig.owner.name}</p>
          <h1 className="shell-title">{appShell.appName}</h1>
        </div>
        <nav className="mode-switcher" aria-label="Mode switcher">
          {navigationRoutes.map((navigationRoute) => (
            <NavLink
              key={navigationRoute.id}
              to={navigationRoute.path}
              className={({ isActive }) => (isActive ? "mode-link is-active" : "mode-link")}
            >
              {navigationRoute.mode}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="shell-main">
        <section className="mode-frame">
          <div className="mode-frame__meta">
            <p className="mode-frame__label">Current route</p>
            <p className="mode-frame__value">{route.path}</p>
          </div>
          {children}
        </section>
      </main>
    </div>
  );
}
