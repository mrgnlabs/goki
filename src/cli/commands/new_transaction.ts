import { PublicKey } from "@solana/web3.js";
import type { Command } from "commander";

import { loadSmartWalletFromScratch } from "../helpers";

async function newTransferTransaction({
  instructions,
  cmd,
}: {
  instructions: Array<string>; //@todo figure out instructions type
  cmd: Command;
}) {
  const {
    env,
    keypair,
    rpcUrl,
    smartWallet,
    proposer,
    payer,
    eta,
  }: {
    env: string;
    keypair: string;
    rpcUrl?: string;
    smartWallet: string;
    proposer?: string;
    payer?: string;
    instructions: Array<string>; // @todo figure out type
    eta: number;
  } = cmd.opts();

  const wallet = await loadSmartWalletFromScratch({
    keypair,
    smartWalletPubkey: smartWallet,
    env,
    rpcUrl,
  });

  await wallet.newTransaction({
    proposer: proposer ? new PublicKey(proposer) : undefined,
    payer: payer ? new PublicKey(payer) : undefined,
    instructions,
    eta,
  });
}

export async function newSOLTransferTransaction(cmd: Command) {
  const {
    to,
  }: {
    to: string;
  } = cmd.opts();

  const toPubkey: PublicKey = new PublicKey(to);

  // @todo construct instruction
  const instructions = [toPubkey];

  await newTransferTransaction({
    instructions,
    cmd,
  });
}

export async function newSPLTransferTransaction(cmd: Command) {
  const {
    to,
    mint,
  }: {
    to: string;
    mint: string;
  } = cmd.opts();

  const toPubkey: PublicKey = new PublicKey(to);
  const mintPubkey: PublicKey = new PublicKey(mint);

  // @todo construct instruction
  const instructions = [toPubkey, mintPubkey];

  await newTransferTransaction({
    instructions,
    cmd,
  });
}
