import BackButton from "@/components/back-button";
import { SettingModal } from "@/components/setting-modal";
import TokenSelector from "@/components/token-selector";
import TransactionModal from "@/components/transaction-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useAllowance from "@/hooks/useAllownace";
import useApprove from "@/hooks/useApprove";
import useContracts from "@/hooks/useContracts";
import useCurrentChain from "@/hooks/useCurrentChain";
import usePair from "@/hooks/usePair";
import useTokens from "@/hooks/useTokens";
import useWeb3Functions from "@/hooks/useWeb3Functions";
import { MAX_UINT256, formatNumber, sortTokens } from "@/lib/utils";
import useStore from "@/store";
import useUserStore from "@/store/user-store";
import { Token } from "@/types/Token";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { formatEther } from "viem";
import { Address, useAccount, useBalance } from "wagmi";

export default function AddLiquidty() {
  const { t } = useTranslation();
  const params = useParams<{ token0: Address; token1: Address }>();
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const chain = useCurrentChain();
  const { swapContract } = useContracts();
  const { addLiquidity } = useWeb3Functions();
  const navigate = useNavigate();
  const [token0, setToken0] = useState<Token | undefined>(undefined);
  const [token1, setToken1] = useState<Token | undefined>(undefined);
  const [amount0, setAmount0] = useState<string>("");
  const [amount1, setAmount1] = useState<string>("");
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [openTxModal, setOpenTxModal] = useState(false);
  const { tokens, findToken } = useTokens();
  const { data: pair } = usePair({ token0, token1 });
  const balance0 = useBalance({ address, token: token0?.address });
  const balance1 = useBalance({ address, token: token1?.address });
  const allownace0 = useAllowance({
    address,
    token: token0,
    spender: swapContract.address,
    enabled: !!token0?.address,
  });
  const allownace1 = useAllowance({
    address,
    token: token1,
    spender: swapContract.address,
    enabled: !!token1?.address,
  });
  const approve0 = useApprove({
    token: token0,
    amount: MAX_UINT256,
    spender: swapContract.address,
    onSuccess: () => allownace0.refetch(),
  });
  const approve1 = useApprove({
    token: token1,
    amount: MAX_UINT256,
    spender: swapContract.address,
    onSuccess: () => allownace1.refetch(),
  });

  const liquidity = useMemo(() => {
    if (!amount0 || !amount1 || !pair) return 0;
    return Math.sqrt(+amount0 * +amount1);
  }, [amount0, amount1, pair]);

  const poolTokenPercentage = useMemo(
    () =>
      pair?.totalSupply
        ? (liquidity * 100) / (+formatEther(pair.totalSupply) + liquidity)
        : 100,
    [pair, liquidity]
  );

  const { loading } = useStore();

  const fetchTokens = async () => {
    const [token0, token1] = await Promise.all([
      params.token0
        ? findToken(params.token0).catch(() => undefined)
        : undefined,
      params.token1
        ? findToken(params.token1).catch(() => undefined)
        : undefined,
    ]);

    setToken0(token0 || tokens[0]);
    setToken1(token1);
  };

  useDebounce(
    () => {
      fetchTokens();

      setAmount0("");
      setAmount1("");
    },
    200,
    [params]
  );

  const onAmount0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount0(e.target.value);

    if (!pair) return;
    if (!e.target.value) return setAmount1("");

    setAmount1((+e.target.value * pair.price).toString());
  };

  const onAmount1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount1(e.target.value);

    if (!pair) return;
    if (!e.target.value) return setAmount0("");

    setAmount0((+e.target.value / pair.price).toString());
  };

  const insufficientBalance = useMemo(
    () =>
      balance0.data && balance1.data
        ? Number(balance0.data.formatted) < +amount0 ||
          Number(balance1.data.formatted) < +amount1
        : false,
    [balance0, balance1, amount0, amount1]
  );

  const disbaledActionButton = useMemo(
    () =>
      !amount0 ||
      !amount1 ||
      !token0 ||
      !token1 ||
      insufficientBalance ||
      (token0.address &&
        allownace0.data &&
        +allownace0.data.formatted < +amount0) ||
      (token1.address &&
        allownace1.data &&
        +allownace1.data.formatted < +amount1) ||
      loading,
    [
      amount0,
      amount1,
      token0,
      token1,
      insufficientBalance,
      loading,
      allownace0,
      allownace1,
    ]
  );

  const addLiquidtyAction = async () => {
    if (!token0 || !token1 || !amount0 || !amount1) return;

    useStore.setState({ loading: true });
    setOpenTxModal(true);
    const hash = await addLiquidity([token0, token1], [amount0, amount1]);
    setTxHash(hash);

    if (hash) {
      setAmount0("");
      setAmount1("");
      const tokens = [token0, token1].sort(sortTokens);
      const key = tokens
        .map((token) => token.address || token.symbol)
        .join(":");
      useUserStore.setState((state) => ({
        pairs: {
          [chain.id]: {
            [key]: [tokens[0], tokens[1]],
            ...state.pairs[chain.id],
          },
          ...state.pairs,
        },
      }));
    }
    useStore.setState({ loading: false });
  };
  return (
    <div className="container py-12">
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between gap-3">
            <BackButton />
            <CardTitle className="text-lg">{t("add-liquidity")}</CardTitle>
            <SettingModal />
          </div>
          <div className="p-4 text-muted-foreground bg-[#131c25] rounded-xl">
            <p className="text-sm">
              <strong>{t("tip")}:</strong>{" "}
              {t(
                "when-you-add-liquidity-you-will-receive-pool-tokens-representing-your-position-these-tokens-automatically-earn-fees-proportional-to-your-share-of-the-pool-and-can-be-redeemed-at-any-time"
              )}
            </p>
          </div>
          <div className="p-4 space-y-3 bg-[#131c25] rounded-xl">
            <div className="flex items-center">
              <Input
                className="flex-1 text-2xl bg-transparent border-0 focus-visible:ring-0"
                type="number"
                id="token0"
                value={amount0}
                onChange={onAmount0Change}
                placeholder="0"
                min={0}
              />
              <TokenSelector
                tokenSelected={token0}
                selectedToken={(token) =>
                  token.symbol !== token1?.symbol &&
                  navigate(
                    generatePath("/add/:token0?/:token1?", {
                      token0: token.address || token.symbol,
                      token1: token1?.address || token1?.symbol || null,
                    }),
                    { replace: true }
                  )
                }
              />
            </div>
            {token0 && (
              <div className="flex justify-end">
                <span className="flex items-center gap-1 text-sm">
                  {t("balance")}:{" "}
                  {balance0.isFetching ? (
                    <Loader2Icon className="animate-spin" size={14} />
                  ) : (
                    formatNumber(balance0.data?.formatted)
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <PlusIcon className="text-primary" size={20} />
          </div>
          <div className="p-4 space-y-3 bg-[#131c25] rounded-xl">
            <div className="flex items-center">
              <Input
                className="flex-1 text-2xl bg-transparent border-0 focus-visible:ring-0"
                type="number"
                id="token1"
                value={amount1}
                onChange={onAmount1Change}
                placeholder="0"
                min={0}
              />
              <TokenSelector
                tokenSelected={token1}
                selectedToken={(token) =>
                  token.symbol !== token0?.symbol &&
                  navigate(
                    generatePath("/add/:token0?/:token1?", {
                      token1: token.address || token.symbol,
                      token0: token0?.address || token0?.symbol || null,
                    }),
                    { replace: true }
                  )
                }
              />
            </div>
            {token1 && (
              <div className="flex justify-end">
                <span className="flex items-center gap-1 text-sm">
                  {t("balance")}:{" "}
                  {balance1.isFetching ? (
                    <Loader2Icon className="animate-spin" size={14} />
                  ) : (
                    formatNumber(balance1.data?.formatted)
                  )}
                </span>
              </div>
            )}
          </div>

          {amount0 && amount1 && token0 && token1 && (
            <div className="p-4 space-y-4 bg-[#131c25] rounded-xl">
              <p className="font-semibold">
                {t("initial-prices-and-pool-share")}
              </p>
              <hr />
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-3 font-semibold text-center">
                  <p>
                    {+amount0 === 0 ? 0 : formatNumber(+amount1 / +amount0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {token1.symbol} {t("per")} {token0.symbol}
                  </p>
                </div>
                <div className="space-y-3 font-semibold text-center">
                  <p>
                    {+amount1 === 0 ? 0 : formatNumber(+amount0 / +amount1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {token0.symbol} {t("per")} {token1.symbol}
                  </p>
                </div>
                <div className="space-y-3 font-semibold text-center">
                  <p>{poolTokenPercentage.toLocaleString()}%</p>
                  <p className="text-sm text-muted-foreground">
                    {t("share-of-pool")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isConnected ? (
            <div>
              <div className="flex items-center gap-4">
                {token0 &&
                  allownace0.data &&
                  +allownace0.data.formatted < +amount0 && (
                    <Button
                      className="w-full h-12 mb-6"
                      disabled={approve0.isLoading}
                      onClick={() => approve0.mutate()}
                    >
                      {approve0.isLoading && (
                        <Loader2Icon className="mr-2 animate-spin" size={16} />
                      )}
                      {t("approve")} {token0.symbol}
                    </Button>
                  )}
                {token1 &&
                  allownace1.data &&
                  +allownace1.data.formatted < +amount1 && (
                    <Button
                      className="w-full h-12 mb-6"
                      disabled={approve1.isLoading}
                      onClick={() => approve1.mutate()}
                    >
                      {approve1.isLoading && (
                        <Loader2Icon className="mr-2 animate-spin" size={16} />
                      )}
                      {t("approve")} {token1.symbol}
                    </Button>
                  )}
              </div>
              <Button
                className="w-full h-12 py-6"
                disabled={disbaledActionButton}
                onClick={() => addLiquidtyAction()}
              >
                {loading && (
                  <Loader2Icon className="mr-2 animate-spin" size={16} />
                )}
                {insufficientBalance ? t("insufficient-balance") : t("supply")}
              </Button>
            </div>
          ) : (
            <Button className="w-full h-12 py-6" onClick={() => open()}>
              {t("connect-wallet")}
            </Button>
          )}
        </CardContent>
      </Card>
      <TransactionModal
        open={openTxModal}
        txHash={txHash}
        setOpen={setOpenTxModal}
      />
    </div>
  );
}
