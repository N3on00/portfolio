import type { ReactNode } from "react";
import { InteractiveModeScreen } from "./interactive-mode-screen";
import type { RuntimeModuleRegistration } from "@shared/types/portfolio";

export const interactiveReactRuntimeModule: RuntimeModuleRegistration<ReactNode> = {
  entryModule: "@features/interactive",
  screen: <InteractiveModeScreen />,
};
