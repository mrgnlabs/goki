#!/usr/bin/env ts-node
import type * as anchor from "@project-serum/anchor";
import type { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import type { Command } from "commander";
import { program } from "commander";
import log from "loglevel";

import { loadSDK, loadWalletKey, programCommand } from "./helpers";

program.version("0.0.1");

log.setLevel(log.levels.INFO);

programCommand("create_wallet")
  .requiredOption("-o, --owners <strings...>", "Array of owner public keys")
  .requiredOption("-t, --threshold <number>", "m")
  .requiredOption("-n, --num-owners <number>", "n")
  .option("-b, --base <path>", "Base keypair")
  .option("-d, --delay <number>", "Timelock delay in seconds")
  .action(async (_, cmd: Command) => {
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
  });

programCommand("create_subaccount")
  .requiredOption("-s, --smart-wallet <string>", "SmartWallet PublicKey")
  .requiredOption("-i, --index <number>")
  .requiredOption("-t, --type <string>")
  .option("-p, --payer <string>", "Payer PublicKey")
  .action(async (_, cmd: Command) => {
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
  });

program.parse(process.argv);
