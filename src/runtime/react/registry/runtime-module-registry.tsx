import type { ReactNode } from "react";
import { classicReactRuntimeModule } from "@features/classic/runtime/react";
import { interactiveReactRuntimeModule } from "@features/interactive/runtime/react";
import { HomeScreen } from "../screens/home-screen";
import type { RuntimeModuleRegistration } from "@shared/types/portfolio";

type ReactRuntimeRegistry = Record<string, ReactNode>;

const runtimeModules: Array<RuntimeModuleRegistration<ReactNode>> = [
  {
    entryModule: "@app/home",
    screen: <HomeScreen />,
  },
  interactiveReactRuntimeModule,
  classicReactRuntimeModule,
];

export const runtimeModuleRegistry = runtimeModules.reduce<ReactRuntimeRegistry>((registry, module) => {
  registry[module.entryModule] = module.screen;
  return registry;
}, {});
