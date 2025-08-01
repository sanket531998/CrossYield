import e, { NextFunction, Request, Response } from "express";
import { getEthTokenBalancesService } from "../services/ui.service";
import axios from "axios";
import { COVALENT_API_KEY } from "../config";
import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { InternalException } from "../exceptions/internal-exception";

const prisma = new PrismaClient();

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
      },
    });

    return res.status(201).json({ success: true, intent });
  } catch (error) {
    console.error("Error recording intent:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
