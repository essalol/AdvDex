import SwapForm from "@/components/swap-form";
import Marquee from "react-fast-marquee";
import TokenAvatar from "@/components/token-avatar";
import { tokenList } from "@/config/token-list";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
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
              <span className="text-sm font-light">{token.name}</span>
            </p>
          </button>
          ))}
        </Marquee>
      </div>
    </div>
  );
}