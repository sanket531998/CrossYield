// src/lib/walletConfig.ts
"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const chains = [mainnet, sepolia];

export const wagmiConfig = getDefaultConfig({
  appName: "CrossYield",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [mainnet, sepolia],
  ssr: true,
});
