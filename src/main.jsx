import ReactDOM from "react-dom/client";
import { Suspense } from "react";
import { Stats } from "@react-three/drei";
import { Leva } from "leva";
import "./styles.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={null}>
    <App />
    <Stats />
    <Leva collapsed />
  </Suspense>
);
