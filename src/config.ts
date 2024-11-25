import {
  arbitrum,
  avalanche,
  base,
  bsc,
  bscTestnet,
  linea,
  mainnet,
  opBNB,
  optimism,
  polygon,
  zora,
} from "viem/chains";

const config = {
  chains: [
    mainnet,
    bsc,
    polygon,
    linea,
    base,
    arbitrum,
    optimism,
    avalanche,
    zora,
    opBNB,
  ],

  routerV2Address: {
    [bscTestnet.id]: "0xd99d1c33f9fc3444f8101754abc46c52416550d1",

    [bsc.id]: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    [mainnet.id]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    [arbitrum.id]: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    [base.id]: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    [polygon.id]: "0xedf6066a2b290C185783862C7F4776A2C8077AD1",
    [opBNB.id]: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
    [linea.id]: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
    [optimism.id]: "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2",
    [avalanche.id]: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
    [zora.id]: "0xa00F34A632630EFd15223B1968358bA4845bEEC7",
  } as Record<number, `0x${string}`>,

  factoryV2Address: {
    [bscTestnet.id]: "0x6725F303b657a9451d8BA641348b6761A6CC7a17",

    [bsc.id]: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
    [mainnet.id]: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    [arbitrum.id]: "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
    [base.id]: "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
    [polygon.id]: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
    [opBNB.id]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [linea.id]: "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
    [optimism.id]: "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf",
    [avalanche.id]: "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C",
    [zora.id]: "0x0F797dC7efaEA995bB916f268D919d0a1950eE3C",
  } as Record<number, `0x${string}`>,

  swapAddress: {
    [bscTestnet.id]: "0xE960DD0785Ec63DF20c6000D382C9F04FEd85FD0",
    // update only these addresses with your swap contracts. deploy from the pdf.
    [bsc.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [mainnet.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [arbitrum.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [base.id]: "0x81F317ceF82b25437e4502d22c6F6Ac492e29505",
    [polygon.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [opBNB.id]: "0xfF12a4Dc0248d913844EDC3aE97E06838F76E321",
    [linea.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [optimism.id]: "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4",
    [avalanche.id]: "0xfF12a4Dc0248d913844EDC3aE97E06838F76E321",
    [zora.id]: "0xfF12a4Dc0248d913844EDC3aE97E06838F76E321",
  } as Record<number, `0x${string}`>,

  WETH: {
    [bscTestnet.id]: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",

    [bsc.id]: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    [mainnet.id]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    [arbitrum.id]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    [base.id]: "0x4200000000000000000000000000000000000006",
    [polygon.id]: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    [opBNB.id]: "0x4200000000000000000000000000000000000006",
    [linea.id]: "0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f",
    [optimism.id]: "0x4200000000000000000000000000000000000006",
    [avalanche.id]: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    [zora.id]: "0x4200000000000000000000000000000000000006",
  } as Record<number, `0x${string}`>,
};

export default config;
