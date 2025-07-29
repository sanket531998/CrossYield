// "use client";

// import React from "react";
// import { WagmiProvider } from "wagmi";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { wagmiConfig } from "@/lib/walletConfig";
// import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import { PetraWallet, PetraWalletName } from "petra-plugin-wallet-adapter";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

// export default function WalletProviders({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const plugins = [new PetraWallet()];

//   return (
//     <QueryClientProvider client={queryClient}>
//       <WagmiProvider config={wagmiConfig}>
//         <RainbowKitProvider>
//           <AptosWalletAdapterProvider
//             autoConnect={true}
//             dappConfig={{ network: "testnet" }}
//             // plugins={plugins}
//             optInWallets={[PetraWalletName]}
//           >
//             {children}
//           </AptosWalletAdapterProvider>
//         </RainbowKitProvider>
//       </WagmiProvider>
//     </QueryClientProvider>
//   );
// }
