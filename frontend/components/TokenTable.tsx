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

type TokenTableProps = {
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

const TokenTable: React.FC<TokenTableProps> = ({ tokens, label }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-6xl mt-8 px-4 overflow-x-auto">
        {label && (
          <h2 className="text-center text-2xl font-semibold text-white mb-4">
            {label}
          </h2>
        )}
        <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <thead>
            <tr className="text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
              <th className="px-5 py-4 text-left">Token</th>
              <th className="px-5 py-4 text-left">Name</th>
              <th className="px-5 py-4 text-left">Symbol</th>
              <th className="px-5 py-4 text-left">Balance</th>
              <th className="px-5 py-4 text-left">Value (USD)</th>
              <th className="px-5 py-4 text-left">Best APY</th>
              <th className="px-5 py-4 text-left">Explore</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tokens.map((token, idx) => (
              <tr
                key={`${token.contract_address}-${idx}`}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={token.logo_url}
                      alt={token.contract_ticker_symbol}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {token.contract_ticker_symbol}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {token.contract_display_name}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {token.contract_ticker_symbol}
                </td>
                <td className="px-5 py-4 font-mono text-sm text-blue-600 dark:text-blue-400">
                  {formatBalance(token.balance, token.contract_decimals)}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                  ${token.quote.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {/* {token.bestApy ? `${token.bestApy.toFixed(2)}%` : "--"} */}
                  {`11.3%`}
                </td>
                <td className="px-5 py-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                    Explore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TokenTable;
