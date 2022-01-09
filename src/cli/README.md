# Goki CLI

A convenience CLI to interact with the Goki Smart Wallet. Built on top of the Goki SDK and [commander.js](https://github.com/tj/commander.js/). Inspired by the [Metaplex NFT ClIs](https://github.com/metaplex-foundation/metaplex/tree/master/js/packages/cli).

SmartWallet docs can be found [here](https://docs.tribeca.so/goki/smart-wallet).

## Commands

Every command supports three standard inputs.

Always required:

- `-k, --keypair <path>`): The Solana keypair used as authority & payer in the CLI commands. Requires a filepath.

Optional:

- `-e, --env <string>`: The Solana cluster environment name.

  - Supports:
    - `'mainnet-beta'`
    - `'devnet'`
    - `'testnet'`
  - Default: `'devnet'`

- `-r, --rpc-url <string>`: An opportunity to run commands with arbitrary RPC resoruces. Commands in this CLI are not compute-intensive so this is not considered required, but included here as an option for extensibility.

### `create_wallet`

Creates a new Goki SmartWallet.

Required inputs:

- `-o, --owners <string[]>`: All public keys involved in the multisig.
- `-t, --threshold <number>`: `m`, or the number of signers that are required to execute a transaction with the multisig.
- `-n, --num-owners <number>`: `n`, or the total number of owners in the multisig.
- `-b, --base`:

Optional inputs:

- `-d, --delay <number>`: The timelock delay in seconds on any multisig action.

Example:

```bash
$ cli-goki create_new_wallet \
    --keypair ./wallet.json  \
    --env "devnet" \
    --rpc-url "https://solana.genesysgo.net/" \
    --owners "2igGpqggosXWeQydpqv4VMdEfoqgK75EUw8V4dT1rC6s" "Fa7PYwe597YzTPASWvc6WBvGeYQfgQzfisg7yzDAiEu4" "J37GNpGDev8x9r6hPD6jLyyHGu3XVjHWJkQ9zMEkKunq" \
    --threshold 2 \
    --num-owners 3 \
    --base "./base.json" \
    --delay 10
```

### `create_subaccount`

Creates a new subaccount for a Smart Wallet. Read more about Smart Wallet subaccounts [here](https://docs.tribeca.so/goki/smart-wallet#subaccounts).

Required inptus:

- `-s, --smart-wallet <string>`: The Smart Wallet public key.
- `-i, --index <number>`:
- `-t, --type <string>`: Must be either `derived` or `ownerInvoker`. Read more about this input [in the Goki documentation](https://docs.tribeca.so/goki/smart-wallet#subaccounts).

Optional inputs:

- `-p, --payer <string>`: Supports an arbitrary payer for this transaction.

Example:

```bash
cli-goki create_subaccount
    --keypair ./wallet.json  \
    --env "devnet" \
    --rpc-url "https://solana.genesysgo.net/" \
    --smart-wallet "2igGpqggosXWeQydpqv4VMdEfoqgK75EUw8V4dT1rC6s"
    --index 0
    --type "derived"
    --payer "Fa7PYwe597YzTPASWvc6WBvGeYQfgQzfisg7yzDAiEu4"
```
