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
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all w-full justify-center"
          >
            <img
              src={wallet.icon}
              alt={wallet.name}
              className="w-5 h-5 rounded"
            />
            Connect with {wallet.name}
          </button>
        ))
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-green-400 break-all">
            ✅ Aptos Connected:
            {/* {account?.address} */}
          </p>
          <button
            onClick={disconnect}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
