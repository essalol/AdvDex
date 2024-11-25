import { Token } from "@/types/Token";
import { erc20ABI, useMutation } from "wagmi";
import useWeb3Clients from "./useWeb3Clients";
import { toast } from "react-toastify";
import { MutationOptions } from "@tanstack/react-query";

type UseApproveProps = {
  amount?: bigint;
  token?: Token;
  spender?: `0x${string}`;
} & MutationOptions;

const useApprove = ({ token, amount, spender, ...props }: UseApproveProps) => {
  const { walletClient, publicClient } = useWeb3Clients();
  return useMutation({
    mutationFn: async () => {
      if (!token?.address || !amount || !walletClient || !spender) return;
      const hash = await walletClient.writeContract({
        abi: erc20ABI,
        address: token.address,
        functionName: "approve",
        args: [spender, amount],
      });
      await publicClient.waitForTransactionReceipt({ hash });
      return hash;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(
        error?.walk?.().message ||
          error?.message ||
          "Signing failed, please try again!"
      );
    },
    ...props,
  });
};

export default useApprove;
