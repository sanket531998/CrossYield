export {};

declare global {
  interface Window {
    aptos?: {
      isPetra?: boolean;
      isMartian?: boolean;
      connect?: () => Promise<any>;
      disconnect?: () => Promise<any>;
      account?: { address: string };
      network?: { name: string };
      [key: string]: any;
    };
  }
}
