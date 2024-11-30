import { useEffect, useState } from "react";
import GraphComponent from "@/components/graph";

const Analytics = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    document.title = "Analytics | CryptoSwap";
    const fetchData = () => {
      const sampleLabels = ["2024-11-25", "2024-11-26", "2024-11-27", "2024-11-28"];
      const sampleData = [500, 700, 400, 600];
      setLabels(sampleLabels);
      setData(sampleData);
    };

    fetchData();
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