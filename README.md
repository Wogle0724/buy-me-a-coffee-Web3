
# What are we making?
- Minimal HTML/JS site
- That has the following buttons which map to the solidity smart contract:
  - Connect
  - Buy Coffee
  - Get Balance
  - Withdraw

## Local Anvil + MetaMask Testing Checklist

## Local Anvil + MetaMask Testing Checklist

Use this checklist every time you test locally to avoid common issues.

### 1. Start Anvil with the saved state
Run Anvil using the provided state file so contracts and balances are restored:
```
anvil --load-state ./fundme-anvil.json
```

Confirm Anvil is running on:
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337

---

### 2. Import an Anvil account into MetaMask
From the Anvil console output, copy **Private Key (0)** and import it into MetaMask:
- MetaMask → Account menu → Import account
- Paste the private key

You should now see an account with **~10,000 ETH** on the local network.

---

### 3. Add / select the Local Anvil network in MetaMask
In MetaMask:
- Network name: Anvil (or Localhost 31337)
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency symbol: ETH

Make sure this network is **actively selected** before interacting with the app.

---

### 4. Confirm MetaMask is using the correct account
Before clicking any buttons:
- MetaMask account address should match the imported Anvil account
- The account should show a large ETH balance (not 0)

If MetaMask is on the wrong network or account, simulations and transactions will fail.

---

### 5. Refresh the page after switching networks
If you change:
- Network
- Account
- RPC
always **refresh the browser** so viem picks up the correct provider state.

---

### 6. Simulation notes (important)
- `simulateContract()` still checks balances when a `value` is supplied.
- Simulating a payable function **requires the sender to have enough ETH**.
- If MetaMask is connected to the wrong network, simulations may fail with
  `insufficient funds for gas * price + value` even though Anvil shows ETH.

---

### 7. Recommended setup
- Use **MetaMask only for signing/sending transactions**
- Use **direct HTTP RPC (http://127.0.0.1:8545)** for reads and simulations when possible
- Avoid relying on MetaMask’s provider for simulations

---

### 8. Quick debugging checks
If something fails:
- Confirm MetaMask chain ID === 31337
- Confirm account balance > value being sent
- Confirm contract address matches deployment
- Check Anvil logs for incoming RPC calls



## Mid-Point Review: Web3 Frontend Architecture

This project is a minimal HTML/JavaScript frontend that interacts with a Solidity smart contract. At this stage, the core end‑to‑end flow is complete.

### What’s working so far
- **Connect Wallet**  
  Users can connect a wallet (e.g. MetaMask) via `window.ethereum` and approve access to their account.

- **Buy Coffee (fund)**  
  The frontend successfully calls the contract’s payable `fund()` function and sends ETH.

- **Local Test Blockchain**  
  All development and testing is done against a local Anvil node for fast feedback.

- **Get Balance**  
  The frontend can read and display the ETH balance held by the smart contract.

---

### Core concepts to understand

#### 1. Wallet connection (`window.ethereum`)
- Wallets inject `window.ethereum` into the browser (EIP‑1193).
- The frontend checks for this object before attempting any blockchain interaction.
- A `walletClient` (via viem) is used to request addresses and sign transactions.
- UI feedback confirms when a wallet is connected.

#### 2. Reading data (publicClient)
- Read‑only blockchain operations do **not** change state and do not require gas.
- viem’s `publicClient` is used for reads.
- Example: `getBalance(contractAddress)`
- Balances are returned in **wei (BigInt)** and converted to ETH using `formatEther`.

#### 3. Writing data (transactions)
State‑changing calls require a signed transaction.

**Best‑practice flow:**
1. **Simulate first**  
   - Use `publicClient.simulateContract()`
   - Catches errors early (insufficient funds, bad args, contract reverts)
2. **Execute**  
   - Use `walletClient.writeContract()` with the simulation request
   - Prompts the user to approve the transaction in MetaMask
   - Returns a transaction hash

Always convert ETH → wei using `parseEther` when sending value.

#### 4. Local development with Anvil
- Anvil runs a local Ethereum node for instant confirmations.
- `--load-state fundme-anvil.json` restores deployed contracts and balances.
- MetaMask must be connected to the Anvil RPC (`localhost:8545`, chainId 31337).
- If Anvil is not running, the frontend cannot function.

---

### Key takeaways
- `publicClient` = reads & simulations  
- `walletClient` = signing & sending transactions  
- Always simulate before writing
- Wallet + node must be on the **same network**
- Local testing with Anvil dramatically speeds up development


## Local Anvil + MetaMask Testing Checklist

Use this checklist every time you test locally to avoid common issues.

### 1. Start Anvil with the saved state
Run Anvil using the provided state file so contracts and balances are restored:
```
anvil --load-state ./fundme-anvil.json
```

Confirm Anvil is running on:
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337

---

### 2. Import an Anvil account into MetaMask
From the Anvil console output, copy **Private Key (0)** and import it into MetaMask:
- MetaMask → Account menu → Import account
- Paste the private key

You should now see an account with **~10,000 ETH** on the local network.

---

### 3. Add / select the Local Anvil network in MetaMask
In MetaMask:
- Network name: Anvil (or Localhost 31337)
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency symbol: ETH

Make sure this network is **actively selected** before interacting with the app.

---

### 4. Confirm MetaMask is using the correct account
Before clicking any buttons:
- MetaMask account address should match the imported Anvil account
- The account should show a large ETH balance (not 0)

If MetaMask is on the wrong network or account, simulations and transactions will fail.

---

### 5. Refresh the page after switching networks
If you change:
- Network
- Account
- RPC
always **refresh the browser** so viem picks up the correct provider state.

---

### 6. Simulation notes (important)
- `simulateContract()` still checks balances when a `value` is supplied.
- Simulating a payable function **requires the sender to have enough ETH**.
- If MetaMask is connected to the wrong network, simulations may fail with
  `insufficient funds for gas * price + value` even though Anvil shows ETH.

---

### 7. Recommended setup
- Use **MetaMask only for signing/sending transactions**
- Use **direct HTTP RPC (http://127.0.0.1:8545)** for reads and simulations when possible
- Avoid relying on MetaMask’s provider for simulations

---

### 8. Quick debugging checks
If something fails:
- Confirm MetaMask chain ID === 31337
- Confirm account balance > value being sent
- Confirm contract address matches deployment
- Check Anvil logs for incoming RPC calls