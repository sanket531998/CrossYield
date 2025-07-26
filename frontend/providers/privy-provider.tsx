// providers/privy-provider.tsx
"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";

export const PrivyProviderWrapper = ({ children }: { children: ReactNode }) => {
  console.log("Privy APP ID: ", process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        embeddedWallets: {
          //   createOnLogin: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
