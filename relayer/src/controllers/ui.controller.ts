import { Request, Response } from "express";
import { getEthTokenBalancesService } from "../services/ui.service";
import axios from "axios";
import { COVALENT_API_KEY } from "../config";

export const getEthUserTokensAndBalance = async (
  req: Request,
  res: Response
) => {
  const { address } = req.params;
  console.log("Fetching ETH token balances for address:", address);
  try {
    const balances = await getEthTokenBalancesService(address);
    res.json(balances);
  } catch (err) {
    // console.error("Error fetching token balances:", err);
    res.status(500).json({ error: "Failed to fetch token balances" });
  }
};

export const getAptosUserTokensAndBalances = async (
  req: Request,
  res: Response
) => {};

export const getEthTokenBalancesCovalent = async (
  req: Request,
  res: Response
) => {
  try {
    const { chainId, userAddress } = req.query;
    const url = `https://api.covalenthq.com/v1/${chainId}/address/${userAddress}/balances_v2/?key=cqt_rQccTbRRy6QcHVgfBPkKDB9VGyh8`;

    const response = await axios.get(url);
    const tokens = response.data;

    // const result = tokens
    //   .filter((t: any) => t.balance !== "0" && t.contract_decimals !== 0)
    //   .map((t: any) => ({
    //     name: t.contract_name,
    //     symbol: t.contract_ticker_symbol,
    //     balance: (Number(t.balance) / 10 ** t.contract_decimals).toFixed(4),
    //     isNative:
    //       t.contract_address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    //   }));

    res.json(tokens);
  } catch (err: any) {
    console.log(err);
    console.error("Failed to fetch token balances:", err.message);
    return err;
  }
};

// export const getAPYFromDefiLlama = async (req: Request, res: Response) => {
//   try {
//     const apyData = await axios.get("https://yields.llama.fi/pools");
//     res.json(apyData?.data);
//   } catch (err: any) {
//     console.error("Failed to get APY data from defillama:", err.message);
//     return err;
//   }
// };

export const getAPYFromDefiLlama = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get("https://yields.llama.fi/pools");

    // List of keywords that are ETH or ETH-based yield tokens
    const ethKeywords = [
      "ETH",
      "stETH",
      "wETH",
      "rETH",
      "cbETH",
      "frxETH",
      "ETHx",
      "ankrETH",
    ];

    // Filter pools where token symbol contains an ETH-based keyword
    const ethPools = data.data.filter((pool: any) => {
      const symbol = pool.symbol?.toUpperCase() || "";
      return ethKeywords.some((keyword) => symbol.includes(keyword));
    });

    // Optionally sort by APY descending
    const sortedEthPools = ethPools.sort((a: any, b: any) => b.apy - a.apy);

    // Limit to top 5-10 protocols
    const topPools = sortedEthPools.slice(0, 10);

    res.json({
      count: topPools.length,
      data: topPools,
    });
  } catch (err: any) {
    console.error("Failed to get APY data from DefiLlama:", err.message);
    res.status(500).json({ error: "Failed to get APY data from DefiLlama" });
  }
};

export const getAllAPYsForTokens = async (req: Request, res: Response) => {
  try {
    const { tokens } = req.body; // e.g., ["eth", "usdt", "usdc"]

    if (!Array.isArray(tokens) || tokens.length === 0) {
      return res
        .status(400)
        .json({ message: "Tokens array is required in body." });
    }

    const { data } = await axios.get("https://yields.llama.fi/pools");
    const allPools = data.data;

    const inputTokenSet = new Set(tokens.map((t: string) => t.toLowerCase()));

    // ✅ Only allow APTOS chain
    const allowedChains = new Set(["aptos", "ethereum"]);

    const allAPYs: Record<string, any[]> = {};

    for (const pool of allPools) {
      const symbol = pool.symbol?.toLowerCase();
      const chain = pool.chain?.toLowerCase();

      if (inputTokenSet.has(symbol) && allowedChains.has(chain)) {
        if (!allAPYs[symbol]) allAPYs[symbol] = [];

        allAPYs[symbol].push({
          symbol: pool.symbol,
          apy: pool.apy,
          chain: pool.chain,
          project: pool.project,
          tvlUsd: pool.tvlUsd,
          url: pool.url || `https://defillama.com/yield/${pool.project}`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      allAPYs,
    });
  } catch (error) {
    console.error("Error fetching APY data:", error);
    res.status(500).json({
      message: "Something went wrong while fetching APY data.",
    });
  }
};
