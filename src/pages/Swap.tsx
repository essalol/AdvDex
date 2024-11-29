import SwapForm from "@/components/swap-form";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Swap | CryptoSwap";
  }, []);
  return (
    <div className="container py-12">
      <div className="w-full max-w-lg mx-auto">
        <SwapForm />
      </div>
    </div>
  );
}
