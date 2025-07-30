// app/login/page.tsx
"use client";

import Header from "@/components/Header";
import YieldOpportunities from "@/components/YieldOpportunities";
import RainbowKitWalletConnect from "@/components/RainbowkitWalletConnect";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import {
  ethTokensFromCovalentAPICall,
  selectEthTokensFromCovalentState,
} from "@/store/slices/EthTokensFromCovalentSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store"; // Adjust path as needed
import AptosConnectButton from "@/components/AptosConnectButton";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function LoginPage() {
  // For Ethereum wallet connection
  const { address, isConnected } = useAccount();
  const { state, data } = useSelector(selectEthTokensFromCovalentState);
  const [selectedChain, setSelectedChain] = useState<"eth" | "aptos" | null>(
    null
  );

  // For Aptos wallet connection
  const { account: aptosAccount, connected: aptosConnected } = useWallet();
  // console.log("Aptos Account:", aptosAccount?.address?.toString());
  // console.log("Aptos Connected:", aptosConnected);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const data = {
      address: address,
      chainId: "1", // Assuming Ethereum mainnet, change as needed
    };
    dispatch(ethTokensFromCovalentAPICall(data));
  }, [address, dispatch]);

  // console.log("Covalent API state:", state);
  // console.log("Covalent API data:", data?.data);

  if (typeof window !== "undefined" && window.ethereum?.isMetaMask) {
    console.log("MetaMask is available");
  }

  if (typeof window !== "undefined" && window.aptos?.isPetra) {
    console.log("Petra is available");
  }

  if (typeof window !== "undefined" && window.aptos?.isMartian) {
    console.log("Martian is available");
  }

  return (
    <div className="bg-black text-white">
      <Header />

      <section className="px-4 py-20 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Welcome to CrossYield
        </h1>
        <p className="text-lg text-gray-300">
          Seamless Cross-Chain Yield Farming on Ethereum & Aptos. Intent-based,
          HTLC-secured swaps powered by 1inch Fusion+ — with gasless execution
          and smart DeFi strategies.
        </p>

        {/* Step 1: Chain Selection */}
        {!selectedChain && (
          <div className="pt-8 space-x-4">
            <button
              onClick={() => setSelectedChain("eth")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all"
            >
              🔗 Connect for Ethereum
            </button>
            <button
              onClick={() => setSelectedChain("aptos")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              🚀 Connect for Aptos
            </button>
          </div>
        )}

        {/* Step 2: Show corresponding wallet connect */}
        {selectedChain === "eth" && (
          <div className="pt-6">
            <RainbowKitWalletConnect />
            <button
              onClick={() => setSelectedChain(null)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-all"
            >
              ← Back to Chain Selection
            </button>
          </div>
        )}

        {selectedChain === "aptos" && (
          <div className="pt-6">
            <AptosConnectButton />
            <button
              onClick={() => setSelectedChain(null)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-all"
            >
              ← Back to Chain Selection
            </button>
          </div>
        )}
      </section>

      <YieldOpportunities />
    </div>
  );
}
