import { useEffect } from "react";

const Analytics = () => {
  useEffect(() => {
    document.title = "Analytics | CryptoSwap";
  }, []);
  return (
    <div>Analytics</div>
  )
}

export default Analytics