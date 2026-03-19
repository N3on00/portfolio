import { classicModeDefinition } from "@features/classic";
import { interactiveModeDefinition } from "@features/interactive";
import { routeIds } from "./route-ids";
import type { AppRouteDefinition } from "@shared/types/portfolio";

export const appRoutes: AppRouteDefinition[] = [
  {
    id: routeIds.home,
    path: "/",
    mode: "classic",
    entryModule: "@app/home",
    status: "ready-for-shell",
  },
  {
    id: routeIds.interactive,
    path: "/interactive",
    mode: interactiveModeDefinition.key,
    entryModule: "@features/interactive",
    status: "ready-for-shell",
  },
  {
    id: routeIds.classic,
    path: "/classic",
    mode: classicModeDefinition.key,
    entryModule: "@features/classic",
    status: "ready-for-shell",
  },
];
