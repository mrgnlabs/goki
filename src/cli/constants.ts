import { clusterApiUrl } from "@solana/web3.js";

type Cluster = {
  name: string;
  url: string;
};

export const CLUSTERS: Cluster[] = [
  {
    name: "mainnet-beta",
    url: "https://api.metaplex.solana.com/",
  },
  {
    name: "testnet",
    url: clusterApiUrl("testnet"),
  },
  {
    name: "devnet",
    url: clusterApiUrl("devnet"),
  },
];

export const DEFAULT_CLUSTER_URL = clusterApiUrl("devnet");
