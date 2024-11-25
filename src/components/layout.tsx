import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

export default function Layout() {

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      {/* <Web3Modal /> */}
    </div>
  );
}
