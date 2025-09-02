import e, { NextFunction, Request, Response } from "express";
import { getEthTokenBalancesService } from "../services/ui.service";
import axios from "axios";
import { COVALENT_API_KEY } from "../config";
import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { InternalException } from "../exceptions/internal-exception";
import { GraphQLClient, gql } from "graphql-request";
import { randomBytes, keccak256, hexlify } from "ethers";

const prisma = new PrismaClient();
// src/data/mockPools.ts
export const mockPools = [
  {
    protocol: "liquidswap",
    assetSymbol: "USDC",
    apy: 8.75,
    tvlUsd: 1_200_000,
    chain: "aptos",
  },
  {
    protocol: "thala",
    assetSymbol: "USDT",
    apy: 12.3,
    tvlUsd: 900_000,
    chain: "aptos",
  },
  {
    protocol: "aries",
    assetSymbol: "APT",
    apy: 6.5,
    tvlUsd: 700_000,
    chain: "aptos",
  },
];

// Controller to add a wallet to a user or create a new user if not provided
export const addWalletToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, walletAddress, chain, chainId } = req.body;

    // Input validation
    if (
      !walletAddress ||
      !chain ||
      typeof chainId !== "number" ||
      isNaN(chainId)
    ) {
      return next(
        new BadRequestException(
          "Missing or invalid fields: walletAddress, chain, chainId",
          ErrorCodes.BAD_REQUEST
        )
      );
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findUnique({
      where: { address: normalizedAddress },
    });

    if (existingWallet) {
      return res.status(200).json({
        userId: existingWallet.userId,
        status: "Wallet already exists",
        wallet: existingWallet,
      });
    }

    let finalUserId = userId;

    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        return next(
          new BadRequestException(
            "Invalid userId provided",
            ErrorCodes.BAD_REQUEST
          )
        );
      } else {
        // creating a second wallet for the same user
        const createdSecondWallet = await prisma.wallet.create({
          data: {
            address: normalizedAddress,
            chain,
            chainId,
            userId: finalUserId,
          },
        });

        return res.status(200).json({
          userId: finalUserId,
          wallet: createdSecondWallet,
          status: "Second wallet added to existing user successfully",
        });
      }
    } else {
      const newUser = await prisma.user.create({ data: {} });
      finalUserId = newUser.id;
    }

    const createdWallet = await prisma.wallet.create({
      data: {
        address: normalizedAddress,
        chain,
        chainId,
        userId: finalUserId,
      },
    });

    return res.status(200).json({
      userId: finalUserId,
      wallet: createdWallet,
      status: userId
        ? "Wallet added to existing user successfully"
        : "New user and wallet created successfully",
    });
  } catch (error) {
    console.error("Error adding wallet:", error);

    next(
      new InternalException(
        "Unexpected error while adding wallet",
        ErrorCodes.INTERNAL_EXCEPTIONS,
        500
      )
    );
  }
};

export const createUserIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      userId,
      token,
      amount,
      riskTolerance,
      minApy,
      preferredChains,
      autoExecute,
      status, // optional
    } = req.body;

    // Input Validation
    if (
      !userId ||
      !token ||
      typeof amount !== "number" ||
      !riskTolerance ||
      typeof minApy !== "number" ||
      !Array.isArray(preferredChains) ||
      typeof autoExecute !== "boolean"
    ) {
      return next(
        new BadRequestException(
          "Missing or invalid fields: userId, token, amount, riskTolerance, minApy, preferredChains, autoExecute",
          ErrorCodes.BAD_REQUEST
        )
      );
    }

    // Optional: Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(
        new BadRequestException("User does not exist", ErrorCodes.BAD_REQUEST)
      );
    }

    // Create Intent
    const intent = await prisma.intent.create({
      data: {
        userId,
        token,
        amount,
        riskTolerance,
        minApy,
        preferredChains,
        autoExecute,
        status: status || "pending",
        fromChain: "ethereum", // default chain
        toChain: "aptos", // default chain
      },
    });

    return res.status(201).json({
      status: "Intent created successfully",
      intent,
    });
  } catch (error) {
    console.error("Error creating user intent:", error);

    next(
      new InternalException(
        "Failed to create user intent",
        ErrorCodes.INTERNAL_EXCEPTIONS,
        500
      )
    );
  }
};

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

// APIs to fetch APY data from DefiLlama and Aries Markets
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
    const topPools = sortedEthPools.slice(0, 100);

    res.json({
      count: sortedEthPools.length,
      data: sortedEthPools,
    });
  } catch (err: any) {
    console.error("Failed to get APY data from DefiLlama:", err.message);
    res.status(500).json({ error: "Failed to get APY data from DefiLlama" });
  }
};

interface LendingMarket {
  asset: {
    symbol: string;
    name: string;
    decimals: number;
  };
  supplyApy: string;
  borrowApy: string;
  totalSupplied: string;
  totalBorrowed: string;
}

interface AriesResponse {
  lendingMarkets: LendingMarket[];
}

/**
 * Fetches yield data from Aries Markets
 * @param req - Express request object
 * @param res - Express response object
 */

export const getAptosApys = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const useMock = true;

    if (useMock) {
      return res.status(200).json({ source: "mock", pools: mockPools });
    }

    const response = await axios.get(
      "https://api.kanalabs.io/v1/yield-aggregator/pools"
    );
    const pools = response.data?.pools || [];

    res.status(200).json({ source: "live", pools });
  } catch (err: any) {
    console.error("Error fetching APYs:", err.message);
    res.status(500).json({ error: "Failed to fetch APY data" });
  }
};
/////////////

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

export const recordUserIntent = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      token,
      amount,
      riskTolerance,
      minApy,
      preferredChains,
      autoExecute,
      expiresAt, // optional
    } = req.body;

    // Basic validation
    if (
      !userId ||
      !token ||
      typeof amount !== "number" ||
      !riskTolerance ||
      typeof minApy !== "number" ||
      !Array.isArray(preferredChains) ||
      typeof autoExecute !== "boolean"
    ) {
      throw new BadRequestException(
        "Missing or invalid required fields",
        ErrorCodes.BAD_REQUEST
      );
    }

    // Optional: Validate that user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(
        "User not found",
        ErrorCodes.USER_NOT_FOUND
      );
    }

    // Create Intent
    const intent = await prisma.intent.create({
      data: {
        userId,
        token,
        amount,
        riskTolerance,
        minApy,
        preferredChains,
        autoExecute,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        status: "pending", // default anyway
        fromChain: "ethereum", // default chain
        toChain: "aptos", // default chain
      },
    });

    return res.status(201).json({ success: true, intent });
  } catch (error) {
    console.error("Error recording intent:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const submitIntent = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      userId,
      fromChain,
      toChain,
      token,
      amount,
      riskTolerance,
      minApy,
      autoExecute,
      preferredChains,
    } = req.body;

    if (!userId || !fromChain || !toChain || !token || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Step 0: Generate preimage + hashlock
    const preimage = hexlify(randomBytes(32));
    const hashlock = keccak256(preimage);

    // Step 1: Create intent in DB
    const intent = await prisma.intent.create({
      data: {
        userId,
        fromChain,
        toChain,
        token,
        amount: parseFloat(amount), // ensure it's a float
        riskTolerance: riskTolerance || "medium",
        minApy: minApy || 0,
        autoExecute: autoExecute ?? false,
        preferredChains: preferredChains || [],
        hashlock,
        secret: preimage, // ⚠️ If you only want to store preimage later, remove this
      },
    });

    // Step 2: Respond to client
    res.status(200).json({
      intent,
      preimage,
      hashlock,
      message: "Intent created successfully",
    });
  } catch (error) {
    console.error("Failed to submit intent:", error);
    res.status(500).json({ message: "Server error while creating intent" });
  }
};
