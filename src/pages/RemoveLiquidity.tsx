import BackButton from "@/components/back-button";
import LoadingBlock from "@/components/loading-block";
import { SettingModal } from "@/components/setting-modal";
import TransactionModal from "@/components/transaction-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import usePair from "@/hooks/usePair";
import useTokens from "@/hooks/useTokens";
import useWeb3Functions from "@/hooks/useWeb3Functions";
import { formatNumber } from "@/lib/utils";
import useStore from "@/store";
import { Token } from "@/types/Token";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { ArrowDown, Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "react-use";
import { Signature, formatUnits, zeroAddress } from "viem";
import { Address, useAccount } from "wagmi";

const percentOptions = [25, 50, 75, 100];

export default function RemoveLiquidty() {
  const { t } = useTranslation();
  const params = useParams<{ token0: Address; token1: Address }>();
  const navigate = useNavigate();
  const { findToken } = useTokens();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [openTxModal, setOpenTxModal] = useState(false);
  const [token0, setToken0] = useState<Token | undefined>(undefined);
  const [token1, setToken1] = useState<Token | undefined>(undefined);
  const { loading } = useStore();
  const { data: pair, refresh: refreshPair } = usePair({ token0, token1 });
  const [percent, setPercent] = useState(0);
  const { removeLiquidity, signPremitMessage } = useWeb3Functions();
  const [signture, setSignture] = useState<
    (Signature & { deadline: bigint }) | undefined
  >(undefined);

  const fetchTokens = async () => {
    const [token0, token1] = await Promise.all([
      params.token0
        ? findToken(params.token0).catch(() => undefined)
        : undefined,
      params.token1
        ? findToken(params.token1).catch(() => undefined)
        : undefined,
    ]);

    if (!token0 || !token1) return navigate("/pools");

    setToken0(token0);
    setToken1(token1);
  };

  const removeLiquidtyAction = async () => {
    if (!pair || !percent || !signture) return;
    useStore.setState({ loading: true });
    setOpenTxModal(true);
    const hash = await removeLiquidity(pair, signture, percent);
    if (hash) {
      setTxHash(hash);
      setPercent(0);
      refreshPair();
    }
    useStore.setState({ loading: false });
  };

  useDebounce(() => fetchTokens(), 200, [params]);

  useEffect(() => {
    if (pair && pair.address === zeroAddress) navigate("/pools");
  }, [pair]);

  useEffect(() => {
    if (!params.token1 || !params.token1) {
      navigate("/pools");
    }
  }, [params]);

  return (
    <div className="container py-12">
      <div className="w-full max-w-lg mx-auto">
        {pair ? (
          <>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between gap-3 mb-6">
                  <BackButton />
                  <CardTitle className="text-lg">
                    {t("remove")} {pair.token0.symbol}-{pair.token1.symbol}{" "}
                    {t("liquidity")}
                  </CardTitle>
                  <SettingModal />
                </div>
                <p className="mb-4">{t("amount")}</p>
                <div className="p-4 border rounded-lg">
                  <div className="space-y-6">
                    <Label className="text-4xl font-semibold">{percent}%</Label>
                    <Slider
                      max={100}
                      step={1}
                      value={[percent]}
                      onValueChange={(val) => setPercent(val[0])}
                    />
                    <div className="grid grid-cols-4 gap-1 lg:gap-8">
                      {percentOptions.map((percent, key) => (
                        <Button
                          key={key}
                          variant={"secondary"}
                          size={"sm"}
                          onClick={() => setPercent(percent)}
                        >
                          {percent}%
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowDown size={24} className="mx-auto my-4" />
                <p className="mb-4">{t("receive")}</p>
                <div className="p-4 mb-4 space-y-4 border rounded-lg bg-secondary text-secondary-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <img
                        src={pair.token0.logoURI}
                        alt={pair.token0.symbol}
                        className="object-contain w-6 h-6"
                      />
                      {pair.token0.symbol}
                    </span>
                    <span>
                      {formatNumber(
                        (+formatUnits(pair.amount0, pair.token0.decimals) *
                          percent) /
                          100
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <img
                        src={pair.token1.logoURI}
                        alt={pair.token1.symbol}
                        className="object-contain w-6 h-6"
                      />
                      {pair.token1.symbol}
                    </span>{" "}
                    <span>
                      {formatNumber(
                        (+formatUnits(pair.amount1, pair.token1.decimals) *
                          percent) /
                          100
                      )}
                    </span>
                  </div>
                </div>
                <p className="mb-4">{t("prices")}</p>
                <div className="p-4 mb-4 space-y-4 border rounded-lg bg-secondary text-secondary-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      1 = {pair.token0.symbol}
                    </span>
                    <span>
                      {formatNumber(
                        +formatUnits(pair.amount1, pair.token1.decimals) /
                          +formatUnits(pair.amount0, pair.token0.decimals)
                      )}{" "}
                      {pair.token1.symbol}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      1 = {pair.token1.symbol}
                    </span>
                    <span>
                      {formatNumber(
                        +formatUnits(pair.amount0, pair.token0.decimals) /
                          +formatUnits(pair.amount1, pair.token1.decimals)
                      )}{" "}
                      {pair.token0.symbol}
                    </span>
                  </div>
                </div>
                {isConnected ? (
                  <div className="flex items-center gap-2">
                    {!signture && (
                      <Button
                        className="flex-1"
                        onClick={() =>
                          signPremitMessage(pair, percent).then(setSignture)
                        }
                      >
                        {t("enabel")}
                      </Button>
                    )}
                    <Button
                      className="flex-1"
                      disabled={loading || !signture}
                      onClick={() => removeLiquidtyAction()}
                    >
                      {loading && (
                        <Loader2Icon className="mr-2 animate-spin" size={16} />
                      )}
                      {t("remove")}
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full" onClick={() => open()}>
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
          </>
        ) : (
          <LoadingBlock />
        )}
      </div>
    </div>
  );
}
