import { cn } from "@/lib/utils";
import { Token } from "@/types/Token";

type Props = {
  token: Token;
  size?: number;
  className?: string;
};

export default function TokenAvatar({ token, size = 40, className }: Props) {
  const style = {
    width: size,
    height: size,
  };
  if (!token.logoURI)
    return (
      <div
        style={style}
        className={cn(
          "flex items-center justify-center font-bold uppercase rounded-full bg-secondary p-1.5 text-[8px]",
          className
        )}
      >
        {token.symbol}
      </div>
    );
  return (
    <img
      src={token.logoURI}
      alt={`${token.symbol} logo`}
      width={size}
      height={size}
      style={style}
      className={cn("p-1.5 rounded-full bg-secondary", className)}
      loading="lazy"
    />
  );
}
