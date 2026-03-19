import type { ReactNode } from "react";
import { ClassicModeScreen } from "./classic-mode-screen";
import type { RuntimeModuleRegistration } from "@shared/types/portfolio";

export const classicReactRuntimeModule: RuntimeModuleRegistration<ReactNode> = {
  entryModule: "@features/classic",
  screen: <ClassicModeScreen />,
};
