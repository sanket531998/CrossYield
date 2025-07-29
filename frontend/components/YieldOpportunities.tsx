"use client";

import React from "react";

const yieldData = [
  {
    platform: "Yearn Finance",
    chain: "Ethereum",
    token: "USDT",
    apy: "6.20%",
    tvl: "$45.2M",
    risk: "low",
  },
  {
    platform: "Pontem Liquidity",
    chain: "Aptos",
    token: "USDT",
    apy: "12.40%",
    tvl: "$12.8M",
    risk: "medium",
    best: true,
  },
  {
    platform: "Aave",
    chain: "Ethereum",
    token: "USDC",
    apy: "4.80%",
    tvl: "$124.5M",
    risk: "low",
  },
  {
    platform: "Aptos DeFi",
    chain: "Aptos",
    token: "APT",
    apy: "15.70%",
    tvl: "$8.4M",
    risk: "high",
  },
];

const riskColors = {
  low: "text-green-400 border-green-400",
  medium: "text-yellow-400 border-yellow-400",
  high: "text-red-400 border-red-400",
};

export default function YieldOpportunities() {
  return (
    <section className="bg-black text-white py-12 px-4 md:px-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Best Yield Opportunities</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Compare yields across Ethereum and Aptos ecosystems. Our algorithm
          finds the best APY opportunities and handles cross-chain complexity
          automatically.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {yieldData.map((item, idx) => (
          <div
            key={idx}
            className={`bg-gray-900 rounded-xl p-6 border-2 border-gray-800 ${
              item.best ? "animate-glow border-transparent shadow-glow" : ""
            }`}
          >
            <div className="mb-2 text-sm text-gray-400">
              {item.chain} • {item.token}
            </div>
            <div className="text-xl font-semibold">{item.platform}</div>
            {item.best && (
              <div className="mt-1 text-sm text-white font-semibold">
                ✅ Best APY
              </div>
            )}
            <div className="mt-4 text-3xl font-bold text-green-400">
              {item.apy}
            </div>
            <div className="text-gray-400">TVL: {item.tvl}</div>
            <div
              className={`mt-3 inline-block text-xs font-medium px-2 py-1 rounded-full border ${
                riskColors[item.risk as keyof typeof riskColors]
              }`}
            >
              {item.risk} risk
            </div>
            <button className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold py-2 px-4 rounded-xl">
              Invest Now
            </button>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-xl font-semibold mb-2">
            ⚡ 1inch Fusion+ Powered
          </div>
          <p className="text-gray-400">
            Seamless cross-chain swaps with optimal routing and minimal fees
          </p>
        </div>
        <div>
          <div className="text-xl font-semibold mb-2">📈 Best APY Finder</div>
          <p className="text-gray-400">
            AI-powered yield discovery across multiple chains and protocols
          </p>
        </div>
        <div>
          <div className="text-xl font-semibold mb-2">🛡 Risk Assessment</div>
          <p className="text-gray-400">
            Comprehensive risk analysis for informed investment decisions
          </p>
        </div>
      </div>
    </section>
  );
}
