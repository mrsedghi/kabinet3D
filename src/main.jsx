import ReactDOM from "react-dom/client";
import { Suspense } from "react";
import { Leva } from "leva";
import "./styles.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={null}>
    <App />
    <Leva oneLineLabels />
  </Suspense>
);
