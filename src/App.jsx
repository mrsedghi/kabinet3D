import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kabinet from "./Kabinet";
import Kabinet1 from "./1/Kabinet1";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Kabinet1 />,
    },
    {
      path: "/1",
      element: <Kabinet />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
