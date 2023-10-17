import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "./Provider/Context.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider>
    <App />
  </ConfigProvider>,
);
