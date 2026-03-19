import { Navigate, Route, Routes } from "react-router-dom";
import { appShell } from "@app/shell/app-shell";
import { ReactAppShellLayout } from "../shell/react-app-shell-layout";
import { runtimeModuleRegistry } from "../registry/runtime-module-registry";

export function ReactAppRouter() {
  return (
    <Routes>
      {appShell.routes.map((route) => {
        const screen = runtimeModuleRegistry[route.entryModule];

        if (!screen) {
          return (
            <Route
              key={route.id}
              path={route.path}
              element={<Navigate replace to={`/${appShell.defaultMode}`} />}
            />
          );
        }

        return (
          <Route
            key={route.id}
            path={route.path}
            element={<ReactAppShellLayout route={route}>{screen}</ReactAppShellLayout>}
          />
        );
      })}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
