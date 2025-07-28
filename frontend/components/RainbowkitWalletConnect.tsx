// src/components/WalletConnect.tsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function RainbowKitWalletConnect() {
  return (
    <div>
      <ConnectButton label="Connect via Ethereum" />
    </div>
  );
}
