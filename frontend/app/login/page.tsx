// app/login/page.tsx
import PrivyLoginButton from "@/components/PrivyLoginButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-black text-white">
      <div className="text-center space-y-6 max-w-xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Welcome to CrossYield
        </h1>
        <p className="text-lg text-gray-300">
          One-click cross-chain yield farming powered by 1inch Fusion+. Gasless
          swaps, smart deposits, and yield strategies—all in one place.
        </p>
        <p>
          Connect your wallet to start exploring the best yield opportunities
          across Ethereum and Aptos networks.
        </p>

        <PrivyLoginButton />

        <p className="mt-10 text-sm text-gray-500">
          Built for the Unite DeFi Hackathon by sanket
        </p>
      </div>
    </div>
  );
}
