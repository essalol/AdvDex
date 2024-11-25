import LoadingBlock from "@/components/loading-block";
import TokenAvatar from "@/components/token-avatar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import config from "@/config";
import useContracts from "@/hooks/useContracts";
import pairAbi from "@/contracts/pairAbi";
import useCurrentChain from "@/hooks/useCurrentChain";
import useWeb3Clients from "@/hooks/useWeb3Clients";
import { formatNumber } from "@/lib/utils";
import useUserStore from "@/store/user-store";
import { Pair } from "@/types/Pair";
import { useEffect, useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { formatEther, formatUnits, getContract, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { useTranslation } from "react-i18next";

export default function Pools() {
  const { t } = useTranslation();
  const [loadingPage, setLoadingPage] = useState(true);
  const chain = useCurrentChain();
  const { address } = useAccount();
  const { publicClient } = useWeb3Clients();
  const { pairs: pairTokens } = useUserStore();
  const { factoryV2Contract } = useContracts();
  const [pairs, setPairs] = useState<Pair[]>([]);

  const loadMyPools = async () => {
    if (!address) return;

    setLoadingPage(true);

    const WETH = config.WETH[chain.id];
    const pairAddresses = await Promise.all(
      Object.values(pairTokens[chain.id] || {}).map(([token0, token1]) =>
        factoryV2Contract.read.getPair([
          token0.address || WETH,
          token1.address || WETH,
        ])
      )
    );

    const pairs = await Promise.all(
      pairAddresses.map((pairAddress, index) => {
        if (pairAddress === zeroAddress) return Promise.resolve(undefined);
        const pair = getContract({
          address: pairAddress,
          abi: pairAbi,
          publicClient,
        });
        const tokens = Object.values(pairTokens[chain.id] || {})[index];
        return Promise.all([
          pairAddress,
          tokens[0],
          tokens[1],
          pair.read.getReserves(),
          pair.read.balanceOf([address]),
          pair.read.totalSupply(),
        ]);
      })
    );

    setPairs(
      pairs
        .filter((pair) => pair && pair[4] > 0n)
        .map(
          (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            [pairAddress, token0, token1, reserves, liquidity, totalSupply]
          ) => ({
            address: pairAddress,
            token0,
            token1,
            liquidity,
            reserve0: reserves[0],
            reserve1: reserves[1],
            amount0: BigInt((liquidity * reserves[0]) / totalSupply),
            amount1: BigInt((liquidity * reserves[1]) / totalSupply),
            totalSupply,
          })
        ) as Pair[]
    );

    setLoadingPage(false);
  };

  useEffect(() => {
    loadMyPools();
  }, [address, chain]);

  return (
    <div className="container py-12">
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>{t("your-v2-liquidity")}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={"outline"}
                className="rounded-full lg:py-6"
                asChild
              >
                <Link to="/add">{t("create-pair")}</Link>
              </Button>
              <Button className="rounded-full lg:py-6" asChild>
                <Link to="/find">{t("import-pool")}</Link>
              </Button>
              <Button className="rounded-full lg:py-6" asChild>
                <Link to="/add">{t("add-v2-liquidity")}</Link>
              </Button>
            </div>
          </div>
          {loadingPage ? (
            <LoadingBlock />
          ) : (
            <Accordion type="single" collapsible className="grid w-full gap-6">
              {pairs.length > 0 ? (
                pairs.map((pair, index) => (
                  <AccordionItem
                    key={index}
                    className="px-4 border rounded-xl bg-muted"
                    value={`pair-$${index + 1}`}
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div
                        key={index}
                        className="flex items-center space-x-2 transition-all rounded-md"
                      >
                        <div className="flex">
                          <TokenAvatar
                            token={pair.token0}
                            size={40}
                            className="bg-secondary"
                          />
                          <TokenAvatar
                            token={pair.token1}
                            size={40}
                            className="-translate-x-3 bg-secondary"
                          />
                        </div>
                        <div className="">
                          <p className="text-lg font-semibold">
                            {pair.token0.symbol} / {pair.token1.symbol}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-1 gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span>{t("your-total-pool-tokens")}:</span>
                        <span>{formatNumber(formatEther(pair.liquidity))}</span>
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
                      <div className="flex items-center justify-end gap-2">
                        <Button className="w-32 rounded-full" asChild>
                          <Link
                            to={generatePath("/add/:token0?/:token1?", {
                              token0: pair.token0.address || pair.token0.symbol,
                              token1: pair.token1.address || pair.token1.symbol,
                            })}
                          >
                            {t("add")}
                          </Link>
                        </Button>
                        <Button className="w-32 rounded-full" asChild>
                          <Link
                            to={generatePath("/remove/:token0?/:token1?", {
                              token0: pair.token0.address || pair.token0.symbol,
                              token1: pair.token1.address || pair.token1.symbol,
                            })}
                          >
                            {t("remove")}
                          </Link>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="py-6 text-lg text-center">
                  {t("no-liquidity-found")}
                </p>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
