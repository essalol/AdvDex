import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { Providers } from "./providers.tsx";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
