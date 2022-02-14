import * as anchor from "@project-serum/anchor";
import type { Provider as SaberProvider } from "@saberhq/solana-contrib";
import { SignerWallet, SolanaProvider } from "@saberhq/solana-contrib";
import type { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import { program } from "commander";
import fs from "fs";
import log from "loglevel";

import { GokiSDK } from "../sdk";
import { CLUSTERS, DEFAULT_CLUSTER_URL } from "./constants";

function getCluster(name: string): string {
  for (const cluster of CLUSTERS) {
    if (cluster.name === name) {
      return cluster.url;
    }
  }

  return DEFAULT_CLUSTER_URL;
}

function getProvider({
  keypair,
  env,
  rpcUrl,
}: {
  keypair: Keypair;
  env: string;
  rpcUrl?: string;
}): SaberProvider {
  if (rpcUrl) log.info("USING CUSTOM URL", rpcUrl);

  const connStr: string = rpcUrl || getCluster(env);
  const solConnection = new anchor.web3.Connection(connStr);

  const walletWrapper = new SignerWallet(keypair);

  const saberProvider = SolanaProvider.load({
    connection: solConnection,
    wallet: walletWrapper,
    opts: { preflightCommitment: "recent" },
  });

  return saberProvider;
}

export function loadWalletKey(keypair: string): Keypair {
  if (!keypair || keypair === "") {
    throw new Error("Keypair is required!");
  }

  function loadPK(): Array<number> {
    return JSON.parse(fs.readFileSync(keypair).toString()) as Array<number>;
  }
  const loaded: Keypair = Keypair.fromSecretKey(new Uint8Array(loadPK()));
  log.info(`wallet public key: ${loaded.publicKey.toString()}`);

  return loaded;
}

export function loadSDK({
  keypair,
  env,
  rpcUrl,
}: {
  keypair: Keypair;
  env: string;
  rpcUrl?: string;
}) {
  const provider = getProvider({
    keypair,
    env,
    rpcUrl,
  });

  return GokiSDK.load({ provider });
}

export async function loadSmartWallet({
  goki,
  pubkey,
}: {
  goki: GokiSDK;
  pubkey: PublicKey;
}) {
  const smartWallet = await goki.loadSmartWallet(pubkey);
  return smartWallet;
}

export async function loadSmartWalletFromScratch({
  keypair,
  smartWalletPubkey,
  env,
  rpcUrl,
}: {
  keypair: string;
  smartWalletPubkey: string;
  env: string;
  rpcUrl?: string;
}) {
  const walletKeyPair: Keypair = loadWalletKey(keypair);
  const goki = loadSDK({
    keypair: walletKeyPair,
    env,
    rpcUrl,
  });
  const smartWallet = await loadSmartWallet({
    goki,
    pubkey: smartWalletPubkey,
  });
  return smartWallet;
}

export function programCommand(name: string) {
  return program
    .command(name)
    .option(
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet" //mainnet-beta, testnet, devnet
    )
    .requiredOption("-k, --keypair <path>", "Solana wallet location")
    .option("-r, --rpc-url <string>", "custom rpc", "");
}
