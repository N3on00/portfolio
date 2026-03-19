import type { DesignTokens } from "@shared/types/portfolio";

export const designTokens: DesignTokens = {
  color: {
    background: "#f5f5f0",
    surface: "#fffdf8",
    surfaceMuted: "#f0eadf",
    surfaceStrong: "#e3dac9",
    foreground: "#111111",
    muted: "#5f5a52",
    accent: "#8a6a2f",
    accentSoft: "#d8c39a",
    border: "#d8d2c8",
    overlay: "rgba(17, 17, 17, 0.72)",
  },
  spacing: {
    "2xs": "0.125rem",
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "3rem",
    "2xl": "4.5rem",
  },
  radius: {
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    pill: "999px",
  },
  layout: {
    narrow: "42rem",
    content: "72rem",
    wide: "96rem",
  },
  typography: {
    display: "'Space Grotesk', 'Segoe UI', sans-serif",
    body: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    mono: "'IBM Plex Mono', 'Consolas', monospace",
    lineHeight: {
      snug: "1.1",
      body: "1.6",
    },
    scale: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2.5rem",
      "2xl": "3.5rem",
    },
  },
};
