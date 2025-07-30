// src/components/WalletConnect.tsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function RainbowKitWalletConnect() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all w-full justify-center"
              >
                <img
                  src="/eth-icon.svg" // Place Ethereum icon in /public folder
                  alt="Ethereum"
                  className="w-5 h-5 rounded"
                />
                Connect with Ethereum
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all w-full justify-center"
              >
                ✅ {account.displayName}
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
