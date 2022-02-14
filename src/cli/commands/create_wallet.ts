import type * as anchor from "@project-serum/anchor";
import type { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import type { Command } from "commander";
import log from "loglevel";

import { loadSDK, loadWalletKey } from "../helpers";

export async function createWalletCmd(cmd: Command) {
  const {
    env,
    keypair,
    rpcUrl,
    owners,
    threshold,
    numOwners,
    base,
    delay,
  }: {
    env: string;
    keypair: string;
    rpcUrl?: string;
    owners: string[];
    threshold: anchor.BN;
    numOwners: number;
    base?: string;
    delay?: anchor.BN;
  } = cmd.opts();

  const walletKeyPair: Keypair = loadWalletKey(keypair);
  const baseKeyPair: Keypair | undefined = base
    ? loadWalletKey(base)
    : undefined;

  const goki = loadSDK({
    keypair: walletKeyPair,
    env,
    rpcUrl,
  });
  const ownerKeys = owners.map((k) => new PublicKey(k));
  const smartWallet = await goki.newSmartWallet({
    owners: ownerKeys,
    threshold,
    numOwners,
    base: baseKeyPair,
    delay,
  });
  log.info(
    `SmartWallet successfully created. PublicKey: ${smartWallet.smartWalletWrapper.key.toString()}`
  );
}
