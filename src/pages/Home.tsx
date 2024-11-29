import SwapForm from "@/components/swap-form";
import Marquee from "react-fast-marquee";
import TokenAvatar from "@/components/token-avatar";
import { tokenList } from "@/config/scroll-list";
import { useEffect, useState } from "react";

export default function Home() {
  const [tokenPrices, setTokenPrices] = useState<{ [key: number]: number }>({});
  const networkToId: { [key: string]: number } = { 'ethereum': 1, 'wrapped-usdc': 55555, 'base': 8453, 'wbnb': 56, 'wrapped-usdt': 666666, 'wrapped-avax': 43114, 'weth': 7777777, 'wmatic': 137, 'optimism': 10, 'arbitrum': 42161 };

  const getCoinUSDprice = (coinId: string) => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-fn1QNCfAnMAB4yccJY3J5raa",
        },
      };

      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        options
      )
        .then((response) => response.json())
        .then((data) => {
          const parts = coinId.toLowerCase().split(',');
          parts.map((symbol) => {
            setTokenPrices((prevPrices) => ({
              ...prevPrices,
              [networkToId[symbol]]: data[symbol]["usd"]
            }));
          });
        })
        .catch((err) => console.error(err));
    }
    catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getCoinUSDprice("ethereum,wrapped-usdc,base,wbnb,wrapped-usdt,wrapped-avax,weth,wmatic,optimism,arbitrum");
    document.title = "CryptoSwap | Effortless, Decentralized Trading";
  }, []);
  return (
    <div className="py-12">
      <div className="lg:flex lg:justify-between w-full max-w-5xl mx-auto">
        <div className="bg-gradient-to-r text-transparent from-white to-green-500 bg-clip-text text-3xl ml-6 lg:ml-0 lg:mt-32 lg:text-7xl">
          <p>Effortless,&nbsp;</p>
          <p>Decentralized&nbsp;</p>
          <p>Trading</p>
        </div>
        <SwapForm />
      </div>
      <div className="absolute py-2 w-full bottom-44 flex items-center">
        <Marquee>
          {tokenList.map((token, index) => (
            <button
              key={index}
              className="flex items-center w-full px-6 py-3 gap-x-4 hover:bg-[rgba(28, 42, 55,0.2)] disabled:pointer-events-none disabled:opacity-50"
            >
              <TokenAvatar token={token} size={35} />
              <p className="flex flex-col items-start font-medium">
                {token.symbol}
                <span className="text-sm font-light">${tokenPrices[token.chainId]}</span>
              </p>
            </button>
          ))}
        </Marquee>
      </div>
    </div>
  );
}