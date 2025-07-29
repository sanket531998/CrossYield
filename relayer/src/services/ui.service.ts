// services/alchemy.ts
import axios from "axios";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export async function getEthTokenBalancesService(address: string) {
  const { data } = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getTokenBalances",
    params: [address],
  });

  return data.result.tokenBalances;
}
