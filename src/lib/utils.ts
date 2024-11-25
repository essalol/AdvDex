import { Token } from "@/types/Token";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const MAX_UINT256 = 2n ** 256n - 1n;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number | string | undefined) => {
  if (!num) return 0;
  return Number(num).toLocaleString(undefined, {
    maximumSignificantDigits: 6,
    notation: "compact",
  });
};

export const sortTokens = (a: Token, b: Token) =>
  a?.address && b?.address ? a.address?.localeCompare(b?.address) : 0;
