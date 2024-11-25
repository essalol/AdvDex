import { useState } from "react";
import useFunctions from "../hooks/useWeb3Functions";
import TokenSelectorModal from "./token-selector-modal";
import { Token } from "../types/Token";
import useCurrentChain from "../hooks/useCurrentChain";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import TokenAvatar from "./token-avatar";

type Props = {
  tokenSelected: Token | undefined;
  selectedToken: (token: Token) => void;
  showMetaMaskImport?: boolean;
  disabled?: boolean;
  className?: string;
};

const TokenSelector = ({
  tokenSelected,
  selectedToken,
  disabled,
  showMetaMaskImport,
  className,
}: Props) => {
  const chain = useCurrentChain();
  const { addTokenAsset } = useFunctions();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleTokenModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const sendSelectedToken = (token: Token) => {
    setIsOpenModal(false);
    selectedToken(token);
    setTimeout(() => {
      setIsOpenModal(false);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center gap-2 w-36">
        <Button
          className={cn(
            "py-2 px-3 h-12 gap-2 justify-between rounded-xl w-full",
            className
          )}
          variant={"secondary"}
          onClick={() => !disabled && toggleTokenModal()}
        >
          {tokenSelected ? (
            <div className="flex items-center gap-2">
              <TokenAvatar token={tokenSelected} size={28} />

              <span>{tokenSelected.symbol}</span>
            </div>
          ) : (
            <p className="text-sm">Select token</p>
          )}

          {!disabled && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 fill-current"
              viewBox="0 0 512 512"
            >
              <title>Open modal</title>
              <path d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z" />
            </svg>
          )}
        </Button>

        {showMetaMaskImport &&
          tokenSelected &&
          chain.nativeCurrency.symbol !== tokenSelected?.symbol && (
            <img
              src="/images/metamask.svg"
              className="h-5 cursor-pointer"
              alt="Import token to metamask"
              title="Import token to metamask"
              onClick={() => addTokenAsset(tokenSelected)}
            />
          )}
      </div>
      <TokenSelectorModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        selectedToken={(token) => sendSelectedToken(token)}
      />
    </>
  );
};

export default TokenSelector;
