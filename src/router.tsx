/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/Home";
import Pools from "./pages/Pools";
import FindPool from "./pages/Find";
import AddLiquidty from "./pages/AddLiquidity";
import RemoveLiquidty from "./pages/RemoveLiquidity";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Swap from "./pages/Swap";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "swap",
        element: <Swap />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "pools",
        element: <Pools />,
      },
      {
        path: "find",
        element: <FindPool />,
      },
      {
        path: "add/:token0?/:token1?",
        element: <AddLiquidty />,
      },
      {
        path: "remove/:token0/:token1",
        element: <RemoveLiquidty />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
