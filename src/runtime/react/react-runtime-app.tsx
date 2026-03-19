import { BrowserRouter } from "react-router-dom";
import { ReactAppRouter } from "./router/react-app-router";

export function ReactRuntimeApp() {
  return (
    <BrowserRouter>
      <ReactAppRouter />
    </BrowserRouter>
  );
}
