import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kabinet from "./Kabinet";
import Kabinet1 from "./1/Kabinet1";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Kabinet />,
    },
    {
      path: "/1",
      element: <Kabinet1 />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
