"use client";
import React from "react";
import { formatUnits } from "ethers";

type TokenItem = {
  contract_display_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  contract_decimals: number;
  balance: string;
  quote: number;
  logo_url: string;
  bestApy?: number;
};

type TokenTilesProps = {
  tokens: TokenItem[];
  label?: string;
};

const formatBalance = (raw: string, decimals: number): string => {
  try {
    return parseFloat(formatUnits(raw, decimals)).toFixed(4);
  } catch (e) {
    return "0.0000";
  }
};

const TokenTiles: React.FC<TokenTilesProps> = ({ tokens, label }) => {
  return (
    <div className="px-4 py-10 max-w-6xl mx-auto">
      {label && (
        <h2 className="text-center text-2xl font-semibold text-white mb-6">
          {label}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token, idx) => (
          <div
            key={`${token.contract_address}-${idx}`}
            className="bg-[#121212] border border-gray-700 rounded-xl p-5 shadow-md flex flex-col justify-between hover:bg-[#1A1A1A] transition duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={token.logo_url}
                alt={token.contract_ticker_symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold text-white">
                  {token.contract_ticker_symbol}
                </h3>
                <p className="text-sm text-gray-400">
                  {token.contract_display_name}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-300 font-mono">
                Balance:{" "}
                <span className="text-blue-400 font-semibold">
                  {formatBalance(token.balance, token.contract_decimals)}
                </span>
              </div>
              <div className="text-sm text-green-400 font-semibold">
                ${token.quote.toFixed(2)}
              </div>
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-purple-400">
                APY:{" "}
                <span className="font-semibold">
                  {token.bestApy ? `${token.bestApy.toFixed(2)}%` : "--"}
                </span>
              </div>
              <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenTiles;
