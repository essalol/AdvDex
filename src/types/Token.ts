import { Address } from "viem";

export type Token = {
  name: string;
  symbol: string;
  address?: Address;
  decimals: number;
  chainId: number;
  logoURI?: string;
};
