// components/AptosWalletConnect.tsx
"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function AptosConnectButton() {
  const { connect, disconnect, connected, account, wallets } = useWallet();

  return (
    <div className="space-y-3">
      {!connected ? (
        wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => connect(wallet.name)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
            Connect {wallet.name}
          </button>
        ))
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-300">
            {/* ✅ Aptos Connected: {account?.address} */}
          </p>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
