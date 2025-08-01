import { useAccount } from "wagmi";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Header() {
  // For Ethereum wallet connection
  const { address: ethAccount, isConnected: ethConnected } = useAccount();

  // For Aptos wallet connection
  const { account: aptosAccount, connected: aptosConnected } = useWallet();

  const [walletConnectionStatus, setWalletConnectionStatus] = useState<string>(
    "❌ Not connected to any wallet"
  );

  useEffect(() => {
    if (ethConnected && aptosConnected) {
      setWalletConnectionStatus("✅ Connected via ETH & Aptos");
    } else if (ethConnected) {
      setWalletConnectionStatus("✅ Connected via ETH");
    } else if (aptosConnected) {
      setWalletConnectionStatus("✅ Connected via Aptos");
    } else {
      setWalletConnectionStatus("No wallet connected");
    }
  }, [ethConnected, aptosConnected]);

  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          CrossYield
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <div className="text-md font-bold text-green-400">
              {walletConnectionStatus}
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
}
