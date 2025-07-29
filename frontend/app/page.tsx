// app/login/page.tsx
"use client";

import Header from "@/components/Header";
import YieldOpportunities from "@/components/YieldOpportunities";
import RainbowKitWalletConnect from "@/components/RainbowkitWalletConnect";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import {
  ethTokensFromCovalentAPICall,
  selectEthTokensFromCovalentState,
} from "@/store/slices/EthTokensFromCovalentSlice";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store"; // Adjust path as needed

export default function LoginPage() {
  const { address, isConnected } = useAccount();
  const { state, data } = useSelector(selectEthTokensFromCovalentState);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const data = {
      address: address,
      chainId: "1", // Assuming Ethereum mainnet, change as needed
    };
    dispatch(ethTokensFromCovalentAPICall(data));
  }, [address, dispatch]);

  console.log("Covalent API state:", state);
  console.log("Covalent API data:", data?.data);

  return (
    <div className="bg-black text-white">
      <Header />

      <section className="px-4 py-20 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Welcome to CrossYield
        </h1>
        <p className="text-lg text-gray-300">
          One-click cross-chain yield farming powered by 1inch Fusion+. Gasless
          swaps, smart deposits, and yield strategies—all in one place.
        </p>

        <div className="pt-6">
          <RainbowKitWalletConnect></RainbowKitWalletConnect>
        </div>
        <div className="pt-6">
          {/* <AptosWalletConnect></AptosWalletConnect> */}
        </div>
      </section>

      <YieldOpportunities />
    </div>
  );
}
