import SwapForm from "@/components/swap-form";

export default function Home() {
  return (
    <div className="container py-12">
      <div className="lg:flex lg:justify-between w-full max-w-5xl mx-auto">
        <div className="bg-gradient-to-r text-transparent from-white to-green-500 bg-clip-text text-3xl ml-6 lg:ml-0 lg:mt-32 lg:text-7xl">
          <p>Effortless,&nbsp;</p>
          <p>Decentralized&nbsp;</p>
          <p>Trading</p>
        </div>
        <SwapForm />
      </div>
    </div>
  );
}