// app/login/page.tsx

import Header from "@/components/Header";
import PrivyLoginButton from "@/components/PrivyLoginButton";
import YieldOpportunities from "@/components/YieldOpportunities";

export default function LoginPage() {
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
          <PrivyLoginButton />
        </div>
      </section>

      <YieldOpportunities />
    </div>
  );
}
