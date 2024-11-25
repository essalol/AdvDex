import { useMemo, useState } from "react";
import { Token } from "../types/Token";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Loader2Icon, SearchIcon } from "lucide-react";
import useTokens from "@/hooks/useTokens";
import { isAddress } from "viem";
import TokenAvatar from "./token-avatar";
import { useDebounce } from "react-use";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedToken: (token: Token) => void;
};

const TokenSelectorModal = ({ open, setOpen, selectedToken }: Props) => {
  const { tokens, findToken } = useTokens();
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const filteredTokens = useMemo(
    () =>
      tokens.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address?.toLowerCase() === searchQuery.toLowerCase() ||
          !searchQuery
      ),
    [tokens, searchQuery]
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
        <div className="max-h-[60vh] overflow-y-auto">
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
