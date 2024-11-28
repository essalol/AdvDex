import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import useCurrentChain from "@/hooks/useCurrentChain";
import { useTranslation } from "react-i18next";

const links = [
  { label: "home", to: "/" },
  { label: "liquidity", to: "/pools" },
  { label: "analytics", to: "/analytics" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const chain = useCurrentChain();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  return (
    <div className="flex justify-between items-center h-16 text-[rgb(117,121,133)] backdrop-blur-lg text-card-foreground">
      <div className="container flex flex-wrap items-center justify-between h-full gap-6">
        <Link to="/" className="flex items-center ">
         
          <h2 className="hidden font-bold text-center text-white lg:inline-block lg:text-2xl">
            *
          </h2>
        </Link>
        <Button
          className="ml-auto lg:hidden"
          variant={"ghost"}
          size="icon"
          onClick={() => setOpenMenu((state) => !state)}
        >
          <MenuIcon />
        </Button>
        <div
          className={cn("items-center flex-1 max-lg:gap-6 gap-12 flex h-full", {
            "max-lg:flex-col max-lg:min-w-full bg-[#131c25] w-full h-42 absolute p-4 top-16 left-0":
              openMenu,
            "max-lg:hidden": !openMenu,
          })}
        >
          <div className="flex items-center justify-center flex-1 w-full h-full lg:justify-start">
            {links.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "font-medium transition-colors px-4 py-2 h-full flex items-center justify-center gap-4",
                  "hover:text-[#c7f284]",
                  pathname === to &&
                    "text-[#ffffff]"
                )}
              >
                {/* <div className="flex h-10 w-10 items-center justify-center gap-2.5 rounded-lg bg-cyan-50 bg-opacity-5">
                  <div className="fill-current group-hover:text-v2-primary text-v2-primary">
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.17246 11.0054L7.49986 13.3336H1.66626V7.50005L3.99446 9.82744L11.6663 2.15485L12.8452 3.33375L5.17246 11.0054ZM18.3335 6.66645V12.5L16.0053 10.1726L8.33346 17.8452L7.15456 16.6663L14.8272 8.99455L12.4998 6.66635L18.3335 6.66645Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div> */}
                {t(label)}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 ml-auto text-[#c7f284] lg:justify-start">
            {address ? (
              <Button
                onClick={() => open()}
                className="py-5 text-white border-input"
                variant={"outline"}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            ) : (
              <Button className="py-5 border-input" onClick={() => open()}>
                Connect Wallet
              </Button>
            )}
            <Button
              onClick={() => open({ view: "Networks" })}
              variant={"outline"}
              className="py-5 border-input"
            >
              {/* <img
                src="/108554348.png"
                alt="logo"
                className="inline-block w-auto h-6"
              />{" "}
              &nbsp; */}
              {chain.name}
            </Button>

            {/* <Button asChild className="py-5 border-input">
              <a href="https://x.com/" target="_blank">
                <img
                  src="/32px-X_logo_2023_original.svg.png"
                  alt="logo"
                  className="inline-block w-auto h-6"
                />
              </a>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
