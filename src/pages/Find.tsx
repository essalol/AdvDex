import BackButton from "@/components/back-button";
import TokenSelector from "@/components/token-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import useCurrentChain from "@/hooks/useCurrentChain";
import usePair from "@/hooks/usePair";
import useTokens from "@/hooks/useTokens";
import { formatNumber, sortTokens } from "@/lib/utils";
import useUserStore from "@/store/user-store";
import { Token } from "@/types/Token";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, generatePath, useNavigate } from "react-router-dom";
import { formatEther, formatUnits } from "viem";
import { useAccount } from "wagmi";

export default function FindPool() {
  const { t } = useTranslation();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const chain = useCurrentChain();
  const [token0, setToken0] = useState<Token | undefined>(undefined);
  const [token1, setToken1] = useState<Token | undefined>(undefined);
  const { data: pair, isLoading } = usePair({ token0, token1 });
  const { tokens } = useTokens();
  const navigate = useNavigate();

  const addLiquidityPath = useMemo(
    () =>
      token0 && token1
        ? generatePath("/add/:token0?/:token1?", {
            token0: token0.address || token0.symbol,
            token1: token1.address || token1.symbol,
          })
        : "/add",
    [token0, token1]
  );

  const importPool = async () => {
    if (!token0 || !token1) return;
    const tokens = [token0, token1].sort(sortTokens);
    const key = tokens.map((token) => token.address || token.symbol).join(":");
    useUserStore.setState((state) => ({
      pairs: {
        [chain.id]: {
          [key]: [tokens[0], tokens[1]],
          ...state.pairs[chain.id],
        },
        ...state.pairs,
      },
    }));
    navigate("/pools");
  };

  useEffect(() => {
    if (tokens.length > 0) {
      setToken0(tokens[0]);
      setToken1(undefined);
    }
  }, [chain]);

  return (
    <div className="container py-12">
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between gap-3">
            <BackButton />
            <CardTitle className="text-lg">
              {t("import")} V2 {t("pool")}
            </CardTitle>
            <div></div>
          </div>
          <div className="p-4 text-muted-foreground bg-[#131c25] rounded-xl">
            <p className="text-sm">
              <strong>{t("tip")}:</strong>{" "}
              {t(
                "use-this-tool-to-find-v2-pools-that-dont-automatically-appear-in-the-interface"
              )}
            </p>
          </div>
          <TokenSelector
            tokenSelected={token0}
            className="bg-[#131c25]"
            selectedToken={(token) => {
              if (token1?.address === token.address) setToken1(token0);
              setToken0(token);
            }}
          />
          <div className="flex justify-center">
            <PlusIcon className="text-primary" size={20} />
          </div>
          <TokenSelector
            tokenSelected={token1}
            className="bg-[#131c25]"
            selectedToken={(token) => {
              if (token0?.address === token.address) setToken0(token1);
              setToken1(token);
            }}
          />

          {isConnected ? (
            <div>
              <div className="p-4 text-muted-foreground bg-[#131c25] rounded-xl">
                {!isLoading ? (
                  !token0 || !token1 ? (
                    <p className="text-sm text-center">
                      {t("select-a-token-to-find-your-v2-liquidity")}
                    </p>
                  ) : pair ? (
                    pair.liquidity > 0n ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>{t("your-total-pool-tokens")}:</span>
                          <span>
                            {formatNumber(formatEther(pair.liquidity))}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>
                            {t("pooled")} {pair.token0.symbol}:
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="">
                              {formatNumber(
                                formatUnits(pair.amount0, pair.token0.decimals)
                              )}
                            </span>

                            <img
                              src={pair.token0.logoURI}
                              alt={pair.token0.symbol}
                              className="object-contain w-4 h-4 rounded-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>
                            {t("pooled")} {pair.token1.symbol}:
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="">
                              {formatNumber(
                                formatUnits(pair.amount1, pair.token1.decimals)
                              )}
                            </span>

                            <img
                              src={pair.token1.logoURI}
                              alt={pair.token1.symbol}
                              className="object-contain w-4 h-4 rounded-full"
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>{t("your-pool-share")}:</span>
                          <span>
                            {Number(
                              (BigInt(pair.liquidity) * 100n) /
                                BigInt(pair.totalSupply)
                            )}
                            %
                          </span>
                        </div>
                        <Button onClick={() => importPool()}>
                          {t("import-pool")}
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        <p className="text-sm text-center">
                          {t("you-dont-have-liquidity-in-this-pool")}
                        </p>
                        <Button className="w-full" asChild>
                          <Link to={addLiquidityPath}>
                            {t("add-liquidity")}
                          </Link>
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="grid gap-4">
                      <p className="text-sm text-center">
                        {t("no-pool-found")}
                      </p>
                      <Button className="w-full" asChild>
                        <Link to={addLiquidityPath}>{t("create-pool")}</Link>
                      </Button>
                    </div>
                  )
                ) : (
                  <Loader2Icon className="mx-auto animate-spin" size={24} />
                )}
              </div>
            </div>
          ) : (
            <Button className="w-full h-12 py-6" onClick={() => open()}>
              {t("connect-wallet")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
