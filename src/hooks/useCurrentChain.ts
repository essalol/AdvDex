import { useNetwork } from "wagmi";
import config from "../config";
// import { useEffect, useState } from "react";

const useCurrentChain = () => {
  const { chain } = useNetwork();
  // const [currentChain, setCurrentChain] = useState<Chain>(config.chains[0]);

  // useEffect(() => {
  //   setCurrentChain(!chain || chain.unsupported ? config.chains[0] : chain);
  // }, [chain]);

  return !chain || chain.unsupported ? config.chains[0] : chain;
};

export default useCurrentChain;
