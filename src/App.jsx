import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kabinet from "./Kabinet";
import Kabinet1 from "./1/Kabinet1";
import Panel from "./controlPanel/Panel";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Panel />,
    },
    {
      path: "/1",
      element: <Kabinet />,
    },
    {
      path: "/2",
      element: <Kabinet1 />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
