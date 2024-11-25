import { toast } from "react-toastify";
import useCurrentChain from "./useCurrentChain";
import { Token } from "../types/Token";
import { erc20ABI, useAccount } from "wagmi";
import {
  getContract,
  parseUnits,
  formatUnits,
  zeroAddress,
  SimulateContractReturnType,
  Signature,
  hexToSignature,
} from "viem";
import useWeb3Clients from "./useWeb3Clients";
import useContracts from "./useContracts";
import useUserStore from "@/store/user-store";
import { MAX_UINT256 } from "@/lib/utils";
import config from "@/config";
import { Pair } from "@/types/Pair";
import pairAbi from "@/contracts/pairAbi";

const useWeb3Functions = () => {
  const chain = useCurrentChain();
  const { address } = useAccount();
  const { publicClient, walletClient } = useWeb3Clients();
  const { swapContract, routerV2Contract } = useContracts();
  const { slippageTolerance, txDeadline } = useUserStore();

  const getAmountFromTo = async (
    amount: string,
    tokenFrom: Token,
    tokenTo: Token
  ) => {
    if (!tokenFrom || !tokenTo) return 0;
    const weth = config.WETH[chain.id];
    try {
      const tokenAmount = await swapContract.read.getOutputTokenAmount([
        parseUnits(amount, tokenFrom.decimals),
        [tokenFrom.address || weth, tokenTo.address || weth],
      ]);

      return formatUnits(tokenAmount, tokenTo.decimals);
    } catch (e: any) {
      console.log(e?.message);
    }
  };

  const checkAllowance = async (token: Token, amount: bigint) => {
    if (!address || !walletClient || !token.address) return;

    const tokenContract = getContract({
      abi: erc20ABI,
      address: token.address,
      publicClient: publicClient,
      walletClient: walletClient || undefined,
    });
    const allowance = await tokenContract.read.allowance([
      address,
      swapContract.address,
    ]);

    if (allowance < amount) {
      const hash = await tokenContract.write.approve(
        [swapContract.address, MAX_UINT256],
        { account: address }
      );

      await publicClient.waitForTransactionReceipt({ hash });
      toast.success(`${token.symbol} spend approved successfully`);
    }
  };

  const checkIfTokenHaveFeeOnTransfer = async (
    args: readonly [`0x${string}`, `0x${string}`, bigint, bigint, bigint],
    options: { account: `0x${string}`; value: bigint | undefined }
  ) => {
    const estimateGas = await Promise.all([
      swapContract.estimateGas
        .swapTokens([...args, false], options)
        .then(() => false)
        .catch(() => undefined),
      swapContract.estimateGas
        .swapTokens([...args, true], options)
        .then(() => true)
        .catch(() => undefined),
    ]);

    return estimateGas.find((g) => g !== undefined);
  };

  const swap = async (
    valueFrom: string,
    valueTo: string,
    tokenFrom: Token,
    tokenTo: Token
  ) => {
    if (!address || !walletClient) return;

    try {
      const block = await publicClient.getBlock();
      const deadline = BigInt(Number(block.timestamp) + 60 * txDeadline);
      const amount = parseUnits(valueFrom, tokenFrom.decimals);
      const amountOutMin =
        (parseUnits(valueTo, tokenTo.decimals) *
          BigInt(slippageTolerance * 100)) /
        10000n;

      const fromAddress =
        !tokenFrom.address || tokenFrom.symbol === chain.nativeCurrency.symbol
          ? zeroAddress
          : tokenFrom.address;
      const toAddress =
        !tokenTo.address || tokenTo.symbol === chain.nativeCurrency.symbol
          ? zeroAddress
          : tokenTo.address;

      if (tokenFrom.symbol !== chain.nativeCurrency.symbol) {
        checkAllowance(tokenFrom, amount);
      }

      const args = [
        fromAddress,
        toAddress,
        amount,
        amountOutMin,
        deadline,
      ] as const;

      const options = {
        account: address,
        value:
          tokenFrom.symbol === chain.nativeCurrency.symbol ? amount : undefined,
      };

      const feeOnTransfer = await checkIfTokenHaveFeeOnTransfer(args, options);
      if (feeOnTransfer === undefined) {
        toast.error("Something went wrong, please try again!");
        return;
      }

      const { request } = await swapContract.simulate.swapTokens(
        [...args, feeOnTransfer],
        options
      );

      const hash = await walletClient.writeContract(request);

      return hash;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.walk?.().message ||
          error?.message ||
          "Signing failed, please try again!"
      );
    }
  };

  const addTokenAsset = async (token?: Token) => {
    if (!token || !walletClient || !token.address) return;
    try {
      await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token?.symbol,
          decimals: token.decimals ?? 18,
          image:
            token.logoURI &&
            (token.logoURI.includes("http")
              ? token.logoURI
              : `${window.location.origin}${token.logoURI}`),
        },
      });
      toast.success("Token imported to metamask successfully");
    } catch (e) {
      toast.error("Token import failed");
    }
  };

  const addLiquidity = async (
    [tokenA, tokenB]: Token[],
    [valueA, valueB]: string[]
  ) => {
    if (!address || !walletClient) return;

    try {
      const amountA = parseUnits(valueA, tokenA.decimals);
      const amountB = parseUnits(valueB, tokenB.decimals);

      let simulate: SimulateContractReturnType | undefined;
      const block = await publicClient.getBlock();
      const deadline = BigInt(Number(block.timestamp) + 60 * txDeadline);
      const amountAMin = (amountA * BigInt(slippageTolerance * 100)) / 10000n;
      const amountBMin = (amountB * BigInt(slippageTolerance * 100)) / 10000n;
      const fee = await swapContract.read.addLiquidityFee();

      if (tokenB.address && tokenA.symbol === chain.nativeCurrency.symbol) {
        simulate = await swapContract.simulate.addLiquidityETH(
          [tokenB.address, amountB, amountBMin, amountAMin, deadline],
          { account: address, value: amountA + fee }
        );
      } else if (
        tokenA.address &&
        tokenB.symbol === chain.nativeCurrency.symbol
      ) {
        simulate = await swapContract.simulate.addLiquidityETH(
          [tokenA.address, amountA, amountAMin, amountBMin, deadline],
          { account: address, value: amountB + fee }
        );
      } else if (tokenA.address && tokenB.address) {
        simulate = await swapContract.simulate.addLiquidity(
          [
            tokenA.address,
            tokenB.address,
            amountA,
            amountB,
            amountAMin,
            amountBMin,
            deadline,
          ],
          { account: address, value: fee }
        );
      }
      if (!simulate?.request) return;
      const hash = await walletClient.writeContract(simulate.request);

      publicClient.waitForTransactionReceipt({ hash });

      return hash;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.walk?.().message ||
          error?.message ||
          "Signing failed, please try again!"
      );
    }
  };

  const removeLiquidity = async (
    pair: Pair,
    signature: Signature & { deadline: bigint },
    percent: number
  ) => {
    if (!address || !walletClient) return;

    try {
      let simulate: SimulateContractReturnType | undefined;

      const liquidity = (pair.liquidity * BigInt(percent)) / 100n;
      const amountMin0 = BigInt((liquidity * pair.reserve0) / pair.totalSupply);
      const amountMin1 = BigInt((liquidity * pair.reserve1) / pair.totalSupply);

      const params = [
        address,
        signature.deadline,
        false,
        Number(signature.v),
        signature.r,
        signature.s,
      ] as const;

      if (
        pair.token1.address &&
        pair.token0.symbol === chain.nativeCurrency.symbol
      ) {
        simulate = await routerV2Contract.simulate.removeLiquidityETHWithPermit(
          [pair.token1.address, liquidity, amountMin1, amountMin0, ...params],
          { account: address }
        );
      } else if (
        pair.token0.address &&
        pair.token1.symbol === chain.nativeCurrency.symbol
      ) {
        simulate = await routerV2Contract.simulate.removeLiquidityETHWithPermit(
          [pair.token0.address, liquidity, amountMin0, amountMin1, ...params],
          { account: address }
        );
      } else if (pair.token0.address && pair.token1.address) {
        simulate = await routerV2Contract.simulate.removeLiquidityWithPermit(
          [
            pair.token0.address,
            pair.token1.address,
            liquidity,
            amountMin0,
            amountMin1,
            ...params,
          ],
          { account: address }
        );
      }

      if (!simulate?.request) return;

      const hash = await walletClient.writeContract(simulate.request);

      publicClient.waitForTransactionReceipt({ hash });

      return hash;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        error?.walk?.().message ||
          error?.message ||
          "Signing failed, please try again!"
      );
    }
  };

  const signPremitMessage = async (pair: Pair, percent: number) => {
    if (!walletClient || !pair || !address) return;

    const deadline = BigInt(Math.round(Date.now() / 1000) + 60 * txDeadline);

    try {
      const nonce = await publicClient.readContract({
        abi: pairAbi,
        address: pair.address,
        functionName: "nonces",
        args: [address],
      });

      const signature = await walletClient.signTypedData({
        account: address,
        primaryType: "Permit",
        types: {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        domain: {
          chainId: chain.id,
          name: pair.name || "Uniswap V2",
          verifyingContract: pair.address,
          version: "1",
        },
        message: {
          owner: address,
          spender: routerV2Contract.address,
          value: (pair.liquidity * BigInt(percent)) / 100n,
          nonce,
          deadline,
        },
      });

      return { ...hexToSignature(signature), deadline };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      toast.error(
        e?.walk?.().message || e?.message || "Signing failed, please try again!"
      );
    }
  };

  return {
    swap,
    addTokenAsset,
    checkAllowance,
    getAmountFromTo,
    addLiquidity,
    removeLiquidity,
    signPremitMessage,
  };
};

export default useWeb3Functions;
