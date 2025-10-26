import { Chain } from "viem";

export const statusSepolia: Chain = {
  id: 1660990954,
  name: "Status Network Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://public.sepolia.rpc.status.network"],
    },
    public: {
      http: ["https://public.sepolia.rpc.status.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Status Sepolia Explorer",
      url: "https://sepoliascan.status.network",
    },
  },
  testnet: true,
};
