import { Token } from "@/types/Token";
import {bsc, bscTestnet, mainnet, polygon, arbitrum, avalanche, base, linea, opBNB, optimism, zora} from "viem/chains";

export const tokenList: Token[] = [
  {
    chainId: bsc.id,
    symbol: "BNB",
    name: "BNB",
    address: undefined,
    logoURI: "/images/tokens/bnb.svg",
    decimals: 18,
  },
  {
    chainId: polygon.id,
    symbol: "MATIC",
    name: "MATIC",
    address: undefined,
    logoURI: "/images/tokens/matic.svg",
    decimals: 18,
  },
  {
    chainId: arbitrum.id,
    symbol: "ETH",
    name: "ETH",
    address: undefined,
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
  {
    chainId: avalanche.id,
    symbol: "AVAX",
    name: "AVAX",
    address: undefined,
    logoURI: "/images/tokens/avalanche-avax-logo.svg",
    decimals: 18,
  },
  {
    chainId: base.id,
    symbol: "ETH",
    name: "ETH",
    address: undefined,
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
  {
    chainId: base.id,
    symbol: "USDC",
    name: "USDC",
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    logoURI: "/images/tokens/usdc.svg",
    decimals: 6,
  },
  {
    chainId: linea.id,
    symbol: "ETH",
    name: "ETH",
    address: undefined,
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
  {
    chainId: opBNB.id,
    symbol: "BNB",
    name: "BNB",
    address: undefined,
    logoURI: "/images/tokens/bnb.svg",
    decimals: 18,
  },
  {
    chainId: optimism.id,
    symbol: "OP",
    name: "OP",
    address: undefined,
    logoURI: "/images/tokens/optimism-ethereum-op-logo.svg",
    decimals: 18,
  },
  {
    chainId: zora.id,
    symbol: "ETH",
    name: "ETH",
    address: undefined,
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
  {
    chainId: bscTestnet.id,
    symbol: "tBNB",
    name: "Binance",
    address: undefined,
    logoURI: "/images/tokens/bnb.svg",
    decimals: 18,
  },
  {
    chainId: bscTestnet.id,
    symbol: "WBNB",
    name: "Binance",
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    logoURI: "/images/tokens/bnb.svg",
    decimals: 18,
  },
  {
    chainId: bscTestnet.id,
    symbol: "USDT",
    name: "Tether USD",
    address: "0x7A2A9e4C97D1f33196EAEA5D3887f4FfBa2831Dd",
    logoURI: "/images/tokens/usdt.svg",
    decimals: 18,
  },
  {
    chainId: bscTestnet.id,
    symbol: "USDC",
    name: "USD Coin",
    address: "0xE8d5864d5fb439b53e44a122540610401C2805C3",
    logoURI: "/images/tokens/usdc.svg",
    decimals: 18,
  },
  {
    chainId: bsc.id,
    symbol: "ETH",
    name: "Binance-Peg Ethereum Token",
    address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
  {
    chainId: bsc.id,
    symbol: "USDT",
    name: "Tether USD",
    address: "0x55d398326f99059ff775485246999027b3197955",
    logoURI: "/images/tokens/usdt.svg",
    decimals: 18,
  },
  {
    chainId: mainnet.id,
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logoURI: "/images/tokens/usdt.svg",
    decimals: 6,
  },
  {
    chainId: mainnet.id,
    symbol: "USDC",
    name: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logoURI: "/images/tokens/usdc.svg",
    decimals: 6,
  },
  {
    chainId: mainnet.id,
    symbol: "ETH",
    name: "ETH",
    address: undefined,
    logoURI: "/images/tokens/eth.svg",
    decimals: 18,
  },
 
  // {
  //   chainId: matic.id,
  //   symbol: "BNB",
  //   name: "BNB",
  //   address: undefined,
  //   logoURI: "/images/tokens/bnb.svg",
  //   decimals: 18,
  // },
];
