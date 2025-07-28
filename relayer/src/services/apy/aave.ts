import { gql, request } from "graphql-request";

type AaveGraphResponse = {
  markets: {
    id: string;
    name: string;
    inputToken: {
      symbol: string;
      id: string;
    };
    rates: {
      rate: string;
      side: string;
      type: string;
    }[];
  }[];
};

const endpoint =
  "https://api.thegraph.com/subgraphs/name/messari/aave-v3-ethereum";

const query = gql`
  {
    markets(first: 50) {
      id
      name
      inputToken {
        symbol
        id
      }
      rates {
        rate
        side
        type
      }
    }
  }
`;

export async function fetchAaveAPYs() {
  try {
    const data = await request<AaveGraphResponse>(endpoint, query);

    return data.markets.map((market: any) => {
      const rate = market.rates.find(
        (r: any) => r.side === "LENDER" && r.type === "VARIABLE"
      );
      const apy = rate ? parseFloat(rate.rate) * 100 : 0;
      return {
        token: market.inputToken.symbol,
        tokenAddress: market.inputToken.id,
        apy: +apy.toFixed(2),
        platform: "Aave",
        chain: "Ethereum",
      };
    });
  } catch (error) {
    console.error("Error fetching Aave APYs:", error);
    return [];
  }
}
