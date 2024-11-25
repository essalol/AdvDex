import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import config from "./config";
import useTokens from "./hooks/useTokens";

export default function App() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { fetchTokens } = useTokens();

  useEffect(() => {
    if (chain && chain.unsupported) {
      switchNetwork?.(config.chains[0].id);
    }
  }, [chain]);

  useEffect(() => {
    fetchTokens();
  }, []);

  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
