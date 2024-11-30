import { useEffect, useState } from "react";
import GraphComponent from "@/components/graph";

interface Transfer {
  hash: string;
  blockTimestamp?: string; // Made optional in case it's missing
  from: string;
  to: string;
  value: string;
  category: string;
  [key: string]: any; // For additional properties
}

interface GroupedTransactions {
  [date: string]: Transfer[];
}

const Analytics = () => {
  const [txs, setTxs] = useState<GroupedTransactions>({});
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
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: contractAddress,
            category: ["external", "erc20", "erc721"],
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

        for (const tx of transactions) {
          if (tx.blockNum) {
            const blockNumber = parseInt(tx.blockNum, 16); // Convert hex to decimal
            const blockResponse = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBlockByNumber",
                params: [`0x${blockNumber.toString(16)}`, false], // Block number in hex
              }),
            });

            const blockData = await blockResponse.json();
            if (blockData.result && blockData.result.timestamp) {
              tx.blockTimestamp = new Date(
                parseInt(blockData.result.timestamp, 16) * 1000
              ).toISOString(); // Convert timestamp to ISO string
            }
          }
        }

        // Group transactions by date
        const groupedByDate = transactions.reduce((acc: GroupedTransactions, tx: Transfer) => {
          if (!tx.blockTimestamp) return acc;

          const date = tx.blockTimestamp.split("T")[0]; // Extract date (YYYY-MM-DD)
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
      setTxs(allInfo);
      const labels = Object.keys(allInfo);
      setLabels(labels);
      const values = Object.values(allInfo);
      const dataValues = values.map(arr => arr.length);
      setData(dataValues);
    })();
  }, []);

  return (
    <div className="container py-12">
      <div className="flex justify-center items-center">
        <div className="w-full lg:w-1/2">
          <GraphComponent labels={labels} data={data} height={400} width={600} />
        </div>
      </div>
    </div>
  )
}

export default Analytics