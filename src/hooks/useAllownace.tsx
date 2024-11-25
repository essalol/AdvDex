import { erc20ABI, useQuery } from "wagmi";
import useWeb3Clients from "./useWeb3Clients";
import { Token } from "@/types/Token";
import { formatUnits } from "viem";
import useCurrentChain from "./useCurrentChain";

type UseAllowanceProps = {
  token?: Token;
  address?: `0x${string}`;
  spender?: `0x${string}`;
  enabled?: boolean;
};

const useAllowance = ({
  token,
  address,
  spender,
  enabled,
}: UseAllowanceProps) => {
  const chain = useCurrentChain();
  const { publicClient } = useWeb3Clients();
  return useQuery(["allownace", token?.address, address, chain.id], {
    queryFn: async () => {
      if (!token?.address || !spender || !address) return;
      const allowance = await publicClient?.readContract({
        abi: erc20ABI,
        address: token.address,
        args: [address, spender],
        functionName: "allowance",
      });
      return {
        value: allowance,
        formatted: formatUnits(allowance, token.decimals),
      };
    },
    enabled: !!token && !!address && !!enabled,
  });
};

export default useAllowance;
