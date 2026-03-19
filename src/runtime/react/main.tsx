import React from "react";
import ReactDOM from "react-dom/client";
import { ReactRuntimeApp } from "./react-runtime-app";
import "./styles/global.css";
import "@shared/ui/react/primitives.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReactRuntimeApp />
  </React.StrictMode>,
);
