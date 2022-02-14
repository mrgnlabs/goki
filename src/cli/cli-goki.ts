#!/usr/bin/env ts-node
import type { Command } from "commander";
import { program } from "commander";
import log from "loglevel";

import {
  createSubAccountCmd,
  createWalletCmd,
  newSOLTransferTransaction,
} from "./commands";
import { programCommand } from "./helpers";

program.version("0.0.1");

log.setLevel(log.levels.INFO);

programCommand("create_wallet")
  .requiredOption("-o, --owners <strings...>", "Array of owner public keys")
  .requiredOption("-t, --threshold <number>", "m")
  .requiredOption("-n, --num-owners <number>", "n")
  .option("-b, --base <path>", "Base keypair")
  .option("-d, --delay <number>", "Timelock delay in seconds")
  .action(async (_, cmd: Command) => {
    await createWalletCmd(cmd);
  });

programCommand("create_subaccount")
  .requiredOption("-s, --smart-wallet <string>", "Smart Wallet PublicKey")
  .requiredOption("-i, --index <number>")
  .requiredOption("-t, --type <string>")
  .option("-p, --payer <string>", "Payer PublicKey")
  .action(async (_, cmd: Command) => {
    await createSubAccountCmd(cmd);
  });

programCommand("transfer_SOL")
  .requiredOption("-s, --smart-wallet <string>", "Smart Wallet PublicKey")
  .requiredOption("-t, --to <string>", "SOL Recipient PublicKey")
  .option("-o, --proposer <string>", "Proposer PublicKey")
  .option("-p, --payer <string>", "Payer PublicKey")
  .option("-a, --eta <number>", "Timelock delay") // @todo figure out how eta is represented and improve helper note
  .action(async (_, cmd: Command) => {
    await newSOLTransferTransaction(cmd);
  });

programCommand("transfer_SPL_token")
  .requiredOption("-s, --smart-wallet <string>", "Smart Wallet PublicKey")
  .requiredOption("-t, --to <string>", "SOL Recipient PublicKey")
  .requiredOption("-m, --mint <string>", "SPL token mint PublicKey")
  .option("-o, --proposer <string>", "Proposer PublicKey")
  .option("-p, --payer <string>", "Payer PublicKey")
  .option("-a, --eta <number>", "Timelock delay") // @todo figure out how eta is represented and improve helper note
  .action(async (_, cmd: Command) => {
    await newSOLTransferTransaction(cmd);
  });

// programCommand("new_transaction");

// programCommand("new_transaction_from_envelope");

// programCommand("fetch_transaction_by_index");

// programCommand("fetch_transaction");

// programCommand("approve_transaction");

// programCommand("execute_transaction");

// programCommand("find_wallet_derived_address");

// programCommand("findOwnerInvokerAddress");

// programCommand("execute_transaction_derived");

// programCommand("owner_invoke_instruction");

// programCommand("set_owners");

// programCommand("change_threshold");

program.parse(process.argv);
