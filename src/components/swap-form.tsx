import { ArrowDownUpIcon, Loader2Icon, PencilLineIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useAccount, useBalance } from "wagmi";
import { useDebounce } from "react-use";
import { useEffect, useMemo, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import useWeb3Functions from "@/hooks/useWeb3Functions";
import useStore from "@/store";
import useTokens from "@/hooks/useTokens";
import TokenSelector from "./token-selector";
import { formatNumber } from "@/lib/utils";
import { SettingModal } from "./setting-modal";
import useUserStore from "@/store/user-store";
import TransactionModal from "./transaction-modal";
import useCurrentChain from "@/hooks/useCurrentChain";
import { Token } from "@/types/Token";

export default function SwapForm() {
  const chain = useCurrentChain();
  const { address, isConnected } = useAccount();
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>("0x0");
  const [openTxModal, setOpenTxModal] = useState(false);
  const { open } = useWeb3Modal();
  const { tokens } = useTokens();
  const { loading, token0, token1 } = useStore();
  const balance0 = useBalance({ address, token: token0?.address });
  const balance1 = useBalance({ address, token: token1?.address });
  const { getAmountFromTo, swap } = useWeb3Functions();
  const { slippageTolerance } = useUserStore();
  const setToken0 = (token?: Token) => useStore.setState({ token0: token });
  const setToken1 = (token?: Token) => useStore.setState({ token1: token });

  useDebounce(
    () => {
      if (amount0 && !isNaN(+amount0) && token0 && token1) {
        getAmountFromTo(amount0, token0, token1).then((val) =>
          setAmount1(val || "")
        );
      } else setAmount1("");
    },
    300,
    [amount0, token0, token1]
  );

  const insufficientBalance = useMemo(
    () => (balance0.data ? Number(balance0.data.formatted) < +amount0 : false),
    [balance0, amount0]
  );

  const disableButton = useMemo(
    () => loading || insufficientBalance || (isConnected && !amount0),
    [loading, insufficientBalance, isConnected, amount0]
  );

  const buttonTitle = useMemo(() => {
    if (loading) return "Processing...";
    if (!isConnected) return "Connect Wallet";
    if (!amount0) return "Enter an amount";
    if (insufficientBalance) return "Insufficient balance";
    return "Exchange";
  }, [loading, isConnected, amount0, insufficientBalance]);

  const invertTokens = () => {
    useStore.setState({ token0: token1, token1: token0 });
    setAmount0(amount1);
    setAmount1(amount0);
  };

  const submit = async () => {
    if (!isConnected) {
      open();
    } else if (token0 && token1 && amount1) {
      if (!+amount0) return;
      useStore.setState({ loading: true });
      setOpenTxModal(true);
      const hash = await swap(amount0, amount1, token0, token1);
      setTxHash(hash);

      if (hash) {
        setAmount0("");
        setAmount1("");
      }

      useStore.setState({ loading: false });
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (chain) {
      timeout = setTimeout(() => {
        useStore.setState({ token0: tokens[0], token1: undefined });
      }, 100);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [chain]);

  return (
    <Card>
      <CardContent className="grid gap-5">
        <div className="space-y-2 bg-[#2a2c3480] p-4 rounded-xl">
          <p className="text-[rgb(232,249,255)] mb-4">You're selling</p>
          <div className="flex">
            <div className="flex flex-col items-start justify-center gap-4">
              <TokenSelector
                showMetaMaskImport
                tokenSelected={token0}
                selectedToken={(token) => {
                  if (token1?.address === token.address) setToken1(token0);
                  setToken0(token);
                }}
              />
              {token0 && (
                <span className="flex items-center gap-1 text-sm">
                  Balance:{" "}
                  {balance0.isFetching ? (
                    <Loader2Icon className="animate-spin" size={14} />
                  ) : (
                    formatNumber(balance0.data?.formatted)
                  )}
                </span>
              )}
            </div>
            <Input
              type="number"
              min={0}
              id="token0"
              value={amount0}
              placeholder="0"
              onChange={(e) => setAmount0(e.currentTarget.value)}
              readOnly={!isConnected || !token0}
              className=
              "text-destructive !ring-destructive text-white bg-transparent border-none text-right text-lg"
            />
          </div>
          <div className="flex justify-end gap-1">
            <Button
              size={"sm"}
              className="bg-[#14151a] hover:bg-[#1b2937] hover:border hover:text-[#c7f284] hover:border-[#c7f284]"
              onClick={() =>
                setAmount0(
                  (Number(balance0.data?.formatted || 0) * 0.5).toString()
                )
              }
            >
              HALF
            </Button>
            <Button
              size={"sm"}
              className="bg-[#14151a] hover:bg-[#1b2937] hover:border hover:text-[#c7f284] hover:border-[#c7f284]"
              onClick={() => setAmount0(balance0.data?.formatted || "")}
            >
              MAX
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            className="border text-primary bg-[#2a2c3480] hover:bg-[rgb(28,41,54)] border-input rounded-full text-white/25 hover:text-[#c7f284] hover:border-[#c7f284] border-[#131c25] border-2 p-0"
            variant={"ghost"}
            size={"icon"}
            onClick={() => invertTokens()}
          >
            <ArrowDownUpIcon size={16} />
          </Button>
        </div>
        <div className="space-y-2 bg-[#2a2c3480] p-4 rounded-xl">
          <p className="text-[rgb(232,249,255)] mb-4">You're buying</p>
          <div className="flex">
            <div className="flex flex-col items-start justify-center gap-4">
              <TokenSelector
                tokenSelected={token1}
                showMetaMaskImport
                selectedToken={(token) => {
                  if (token0?.address === token.address) setToken0(token1);
                  setToken1(token);
                }}
              />
              {token1 && (
                <span className="flex items-center gap-1 text-sm">
                  Balance:{" "}
                  {balance1.isFetching ? (
                    <Loader2Icon className="animate-spin" size={14} />
                  ) : (
                    formatNumber(balance1.data?.formatted)
                  )}
                </span>
              )}
            </div>
            <Input value={amount1} readOnly={true} placeholder="0.0" className="text-white bg-transparent border-none text-right text-lg" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 font-medium text-sm">
          <SettingModal
            trigger={
              <button className="flex items-center gap-2 text-[#c7f284]">
                Slippage Tolerance <PencilLineIcon size={20} />
              </button>
            }
          />
          <span className="text-[#c7f284]">{slippageTolerance}%</span>
        </div>
        <Button className="h-12 py-8 bg-[#2d3d3d] hover:bg-[#2d3d3d] hover:border hover:border-[#c7f284] text-[#c7f284] text-lg rounded-xl" disabled={disableButton} onClick={submit}>
          {buttonTitle}
        </Button>
        <div className="grid">
          <div className="flex items-center justify-between gap-4 text-sm">
            Minimum received
            <span>{amount1 ? (parseFloat(amount1) * (1 - slippageTolerance / 100)).toFixed(2) : 0} {token1?.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            Trading Fee
            <span>0.2%</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm">
            Route
            <span>{token0?.name} &gt; {token1?.name}</span>
          </div>
        </div>

      </CardContent>

      <TransactionModal
        open={openTxModal}
        txHash={txHash}
        content={`Swapping ${amount0} ${token0?.symbol} for ${formatNumber(
          amount1
        )} ${token1?.symbol}`}
        setOpen={setOpenTxModal}
      />
    </Card>
  );
}
