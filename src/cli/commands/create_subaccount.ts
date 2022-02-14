import type { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import type { Command } from "commander";
import log from "loglevel";

import { loadSDK, loadWalletKey } from "../helpers";

export async function createSubAccountCmd(cmd: Command) {
  const {
    env,
    keypair,
    rpcUrl,
    smartWallet,
    index,
    type,
    payer,
  }: {
    env: string;
    keypair: string;
    rpcUrl?: string;
    smartWallet: string;
    index: number;
    type: string;
    payer?: string;
  } = cmd.opts();
  if (!(type === "derived" || type === "ownerInvoker")) {
    throw Error("`type` much be either 'derived' or 'ownerInvoker'");
  }
  const walletKeyPair: Keypair = loadWalletKey(keypair);
  const goki = loadSDK({
    keypair: walletKeyPair,
    env,
    rpcUrl,
  });

  await goki.createSubaccountInfo({
    smartWallet: new PublicKey(smartWallet),
    index,
    type,
    payer: payer ? new PublicKey(payer) : undefined,
  });
  // @todo improve logging here.
  log.info("New subaccount created.");
}
