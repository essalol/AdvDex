import config from "@/config";
import useCurrentChain from "./useCurrentChain";
import useWeb3Clients from "./useWeb3Clients";
import { useMemo } from "react";
import { getContract } from "viem";
import swapAbi from "@/contracts/swapAbi";
import routerV2Abi from "@/contracts/routerV2Abi";
import factoryV2Abi from "@/contracts/factoryV2Abi";

const useContracts = () => {
  const chain = useCurrentChain();
  const { publicClient, walletClient } = useWeb3Clients();

  const swapContract = useMemo(
    () =>
      getContract({
        abi: swapAbi,
        address: config.swapAddress[chain.id],
        publicClient: publicClient,
        walletClient: walletClient || undefined,
      }),
    [chain, publicClient, walletClient]
  );

  const routerV2Contract = useMemo(
    () =>
      getContract({
        abi: routerV2Abi,
        address: config.routerV2Address[chain.id],
        publicClient: publicClient,
        walletClient: walletClient || undefined,
      }),
    [chain, publicClient, walletClient]
  );

  const factoryV2Contract = useMemo(
    () =>
      getContract({
        abi: factoryV2Abi,
        address: config.factoryV2Address[chain.id],
        publicClient: publicClient,
        walletClient: walletClient || undefined,
      }),
    [chain, publicClient, walletClient]
  );

  return { swapContract, routerV2Contract, factoryV2Contract };
};

export default useContracts;
