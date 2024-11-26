import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import config from "./config";

export default function App() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (chain && chain.unsupported) {
      switchNetwork?.(config.chains[0].id);
    }
  }, [chain]);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
