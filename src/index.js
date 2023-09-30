import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "./Provider/Context.js";
import { SharePointProvider } from "./Provider/SharePointContext.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SharePointProvider>
  <ConfigProvider>
    <App />
  </ConfigProvider>,
  </SharePointProvider>
);
