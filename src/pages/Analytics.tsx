import { useEffect, useState } from "react";
import GraphComponent from "@/components/graph";
import LoadingBlock from "@/components/loading-block";

interface Transfer {
  hash: string;
  blockNum: string,
  from: string;
  to: string;
  value: string;
  category: string;
  erc721TokenId: string,
  tokenId: string,
  asset: string,
  rawContract: {
    value: string,
    address: string,
    decimal: string
  },
  metadata: {
    blockTimestamp: string
  }
  [key: string]: any; // For additional properties
}

interface GroupedTransactions {
  [date: string]: Transfer[];
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState<Transfer[][]>([[]]);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const networkUrls: { [key: string]: string } = {
    ethereum: "https://eth-mainnet.g.alchemy.com/v2/", // Ethereum Mainnet
    arbitrum: "https://arb-mainnet.g.alchemy.com/v2/", // Arbitrum
    optimism: "https://opt-mainnet.g.alchemy.com/v2/", // Optimism
    bnb: "https://bnb-mainnet.g.alchemy.com/v2/", // Binance Smart Chain
    avalanche: "https://avax-mainnet.g.alchemy.com/v2/", // Avalanche
    base: "https://base-mainnet.g.alchemy.com/v2/", // Base
    polygon: "https://polygon-mainnet.g.alchemy.com/v2/", // Polygon
    linea: "https://linea-mainnet.g.alchemy.com/v2/", // Linea
  };

  const mergeObjects = (obj1: GroupedTransactions, obj2: GroupedTransactions) => {
    const result = { ...obj1 }; // Start with the first object

    for (let key in obj2) {
      if (result[key]) {
        result[key] = result[key].concat(obj2[key]);
      } else {
        result[key] = obj2[key];
      }
    }

    return result;
  };

  useEffect(() => {
    document.title = "Analytics | CryptoSwap";
  }, []);

  useEffect(() => {
    const fetchTransactions = async (apiUrl: string, contractAddress: string) => {
      const apiKey = "HiZWd\_lqrediQwyGWrbZJqiCrhDI0kqS"; // Replace with your Alchemy API key
      const url = `${apiUrl}${apiKey}`;
      const body = {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            withMetadata: true,
            // excludeZeroValue: false,
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: contractAddress,
            category: ["external", "erc20"],
          },
        ],
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!data.result || !data.result.transfers) {
          throw new Error("No transactions found.");
        }

        const transactions: Transfer[] = data.result.transfers;

        // Group transactions by date
        const groupedByDate = transactions.reduce((acc: GroupedTransactions, tx: Transfer) => {
          if (!tx.metadata.blockTimestamp) return acc;

          const date = tx.metadata.blockTimestamp.split("T")[0]; // Extract date (YYYY-MM-DD)
          if (!acc[date]) acc[date] = [];
          acc[date].push(tx);
          return acc;
        }, {});

        return groupedByDate;
      } catch (err) {
        console.error("Error fetching transactions:", err);
        throw err;
      }
    };

    (async () => {
      const ethInfo = await fetchTransactions(networkUrls['ethereum'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");
      const arbInfo = await fetchTransactions(networkUrls['arbitrum'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");
      const optInfo = await fetchTransactions(networkUrls['optimism'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");
      const bnbInfo = await fetchTransactions(networkUrls['bnb'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");
      const avaInfo = await fetchTransactions(networkUrls['avalanche'], "0x81F317ceF82b25437e4502d22c6F6Ac492e29505");
      const baseInfo = await fetchTransactions(networkUrls['base'], "0x81F317ceF82b25437e4502d22c6F6Ac492e29505");
      const polInfo = await fetchTransactions(networkUrls['polygon'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");
      const lineaInfo = await fetchTransactions(networkUrls['linea'], "0xeEA16fcFb1FAe5269d070F337073aa28f7442ED4");

      const allInfo = mergeObjects(mergeObjects(mergeObjects(mergeObjects(mergeObjects(mergeObjects(mergeObjects(ethInfo, arbInfo), optInfo), bnbInfo), avaInfo), baseInfo), polInfo), lineaInfo);
      const sortedKeys = Object.keys(allInfo).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      const sortedInfo: GroupedTransactions = {};
      for (const key of sortedKeys) {
        sortedInfo[key] = allInfo[key];
      }
      const labels = Object.keys(sortedInfo);
      setLabels(labels);
      const values = Object.values(sortedInfo);
      setTxs(values);
      const dataValues = values.map(arr => arr.length);
      setData(dataValues);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="container py-12">
      {!loading ?
        <>
          <div className="flex justify-center items-center">
            <div className="w-full lg:w-1/2">
              <GraphComponent labels={labels} data={data} height={400} width={600} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-[#c7f284] mt-20">
              Transaction History
            </h1>
            <br />
            <div>
              {labels.map((_tx, i) => (
                <div key={i} className="my-4">
                  <div className="text-xl text-[#c7f284] font-bold mb-2">{labels[labels.length - 1 - i]}</div>

                  <div className="border border-gray-300">
                    <div>
                      <div className="text-[#c7f284] grid grid-cols-2 text-center font-bold border-b border-gray-300 py-2">
                        <div>Address</div>
                        <div>Asset</div>
                      </div>
                    </div>
                    <div>
                      {txs[labels.length - 1 - i].map((eachtx, index) => (
                        <div key={index} className="grid grid-cols-2 text-center border-b border-gray-300">
                          <div className="overflow-x-auto whitespace-nowrap p-2 border-r">{eachtx.from}</div>
                          {/* <div className="truncate max-w-full p-2 border-r">{eachtx.tokenId}</div> */}
                          <div className="overflow-x-auto whitespace-nowrap p-2">{eachtx.value}&nbsp;{eachtx.asset}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
        : <div className="flex justify-center items-center text-2xl font-medium"><LoadingBlock /></div>
      }
    </div>
  )
}

export default Analytics
