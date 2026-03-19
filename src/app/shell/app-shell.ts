import { appRoutes } from "../routing/routes";
import { siteConfig } from "@shared/config/site.config";
import type { AppShellDefinition } from "@shared/types/portfolio";

export const appShell: AppShellDefinition = {
  appName: siteConfig.siteName,
  ownerName: siteConfig.owner.name,
  defaultMode: "interactive",
  routes: appRoutes,
  layoutSlots: ["mode-switcher", "content", "overlay", "footer"],
};
