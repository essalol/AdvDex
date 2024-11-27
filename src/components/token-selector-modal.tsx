import { useEffect, useMemo, useRef, useState } from "react";
import { Token } from "../types/Token";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Loader2Icon, SearchIcon } from "lucide-react";
import useTokens from "@/hooks/useTokens";
import { isAddress } from "viem";
import TokenAvatar from "./token-avatar";
import { useDebounce } from "react-use";
// import useTokenStore from "@/store/token-store";
import useCurrentChain from "@/hooks/useCurrentChain";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedToken: (token: Token) => void;
};

const chainIdToName: { [key: number]: string } = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'polygon-pos',
  59144: 'linea',
  8453: 'base',
  42161: 'arbitrum-one',
  10: 'optimistic-ethereum',
  43114: 'avalanche',
}

const TokenSelectorModal = ({ open, setOpen, selectedToken }: Props) => {
  const { tokens, findToken } = useTokens();
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  // const [chunkSize] = useState(10); // Number of tokens to load per batch
  // const [currentIndex, setCurrentIndex] = useState(0); // Track how many tokens are displayed
  const modalRef = useRef<HTMLDivElement | null>(null); // Ref for the modal
  const chain = useCurrentChain();


  const fetchAllTokens = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://tokens.coingecko.com/${chainIdToName[chain.id]}/all.json`,
        { cache: "force-cache" }
      ).then((res) => res.json());

      const tokensLocal = response.tokens.map((token: Token) => ({
        chainId: token.chainId,
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        logoURI: token.logoURI,
        decimals: token.decimals,
      }));

      setAllTokens([...tokens, ...tokensLocal]);
      // useTokenStore.setState({
      //   tokens: [...useTokenStore.getState().tokens, ...tokensLocal.slice(0, chunkSize)],
      // });
      // setCurrentIndex(chunkSize);
    } catch (error) {
      setAllTokens(tokens);
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleScroll = () => {
  //   if (!modalRef.current) return;

  //   const { scrollTop, scrollHeight, clientHeight } = modalRef.current;

  //   if (scrollTop + clientHeight >= scrollHeight - 200 && currentIndex < allTokens.length) {
  //     const nextIndex = Math.min(currentIndex + chunkSize, allTokens.length);
  //     useTokenStore.setState({
  //       tokens: [...useTokenStore.getState().tokens, ...allTokens.slice(currentIndex, nextIndex)],
  //     });
  //     setCurrentIndex(nextIndex);
  //   }
  // };

  useEffect(() => {
    fetchAllTokens();
  }, [chain]);

  // useEffect(() => {
  //   const modalElement = modalRef.current;
  //   if (modalElement) {
  //     modalElement.addEventListener("scroll", handleScroll);
  //   }
  //   return () => {
  //     if (modalElement) {
  //       modalElement.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  // }, [handleScroll, currentIndex, allTokens]);

  const filteredTokens = useMemo(
    () =>
      allTokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address?.toLowerCase() === searchQuery.toLowerCase() ||
          !searchQuery
      ),
    [allTokens, searchQuery]
  );

  useDebounce(
    () => {
      if (isAddress(searchQuery)) {
        setLoading(true);
        findToken(searchQuery as `0x${string}`).catch(() => null);
        setLoading(false);
      }
    },
    200,
    [searchQuery]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 pb-6 sm:max-w-lg bg-[#304256] text-white border-none">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-medium">
            Select token
          </DialogTitle>
        </DialogHeader>
        <div className="relative mx-6">
          <Input
            type="text"
            className="w-full pl-12 text-black bg-[#202f42]"
            placeholder="Search name or paste address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon
            className="absolute -translate-y-1/2 top-1/2 left-4 text-muted-foreground text-black"
            size={20}
          />
        </div>
        <hr />
        <div ref={modalRef} className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-16">
              <Loader2Icon className="animate-spin" size={28} />
            </div>
          ) : filteredTokens.length > 0 ? (
            filteredTokens.map((token, index) => (
              <button
                key={index}
                className="flex items-center w-full px-6 py-3 gap-x-4 hover:bg-[rgba(28, 42, 55,0.2)] disabled:pointer-events-none disabled:opacity-50"
                onClick={() => selectedToken(token)}
              >
                <TokenAvatar token={token} size={40} />
                <p className="flex flex-col items-start font-medium">
                  {token.symbol}
                  <span className="text-sm font-light">{token.name}</span>
                </p>
              </button>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-16 px-6">
              <p className="text-xl font-medium break-all">
                No tokens found with the name{" "}
                <span className="font-bold">{searchQuery}</span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectorModal;
