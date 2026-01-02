// script.ts
import {
  createWalletClient,
  custom,
  createPublicClient,
  defineChain,
  parseEther,
  formatEther,
} from "viem";

import type { Address, Chain, PublicClient, WalletClient } from "viem";
import { contractAddress, coffeeAbi } from "./constants";

console.log("TS Script loaded");

// ---- window.ethereum typing (EIP-1193-ish) ----
declare global {
  interface Window {
    ethereum?: unknown;
  }
}

// ---- DOM helpers ----
function getEl<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element with id="${id}"`);
  return el as T;
}

const connectButton = getEl<HTMLButtonElement>("connectButton");
const fundButton = getEl<HTMLButtonElement>("fundButton");
const balanceButton = getEl<HTMLButtonElement>("balanceButton");
const withdrawButton = getEl<HTMLButtonElement>("withdrawButton");
const ethAmountInput = getEl<HTMLInputElement>("ethAmount");

// ---- viem clients (typed) ----
let walletClient: WalletClient;
let publicClient: PublicClient;

function requireEthereum(): unknown {
  if (typeof window.ethereum === "undefined") {
    throw new Error("No wallet detected. Please install MetaMask (or a compatible wallet).");
  }
  return window.ethereum;
}

async function getCurrentChain(client: WalletClient): Promise<Chain> {
  const chainId = await client.getChainId();

  // NOTE: This describes the chain; the *transport* decides where requests go.
  // Here we keep your behavior, relying on MetaMask's provider.
  return defineChain({
    id: chainId,
    name: "Local Devnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: ["http://localhost:8545"] } },
  });
}

async function getBalance(): Promise<void> {
  try {
    requireEthereum();

    publicClient = createPublicClient({
      transport: custom(window.ethereum as any),
    });

    const balance = await publicClient.getBalance({
      address: contractAddress as Address,
    });

    console.log(`Current Balance: ${formatEther(balance)} ETH`);
  } catch (error) {
    console.error("Failed to get balance:", error);
  }
}

async function fund(): Promise<void> {
  const ethAmount = ethAmountInput.value;

  try {
    requireEthereum();

    walletClient = createWalletClient({
      transport: custom(window.ethereum as any),
    });

    const addresses = (await walletClient.requestAddresses()) as Address[];
    const [connectedAccount] = addresses;

    if (!connectedAccount) {
      console.log("No account connected.");
      return;
    }

    console.log(
      `Funding Account ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)} with ${ethAmount} ETH...`
    );

    publicClient = createPublicClient({
      transport: custom(window.ethereum as any),
    });

    try {
      console.log("Simulating transaction...");
      const currentChain = await getCurrentChain(walletClient);
      const value = parseEther(ethAmount);

      console.log("Parsed Ether Amount:", value);

      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        account: connectedAccount,
        abi: coffeeAbi,
        functionName: "fund",
        value,
        chain: currentChain,
      });

      const hash = await walletClient.writeContract(request);
      console.log("Transaction Hash:", hash);
      console.log("Funding successful!");
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  } catch (error) {
    console.error("Funding failed:", error);
  }
}

async function withdraw(): Promise<void> {
  try {
    requireEthereum();

    walletClient = createWalletClient({
      transport: custom(window.ethereum as any),
    });

    const addresses = (await walletClient.requestAddresses()) as Address[];
    const [connectedAccount] = addresses;

    if (!connectedAccount) {
      console.log("No account connected.");
      return;
    }

    console.log(
      `Withdrawing from contract as ${connectedAccount.slice(0, 6)}...${connectedAccount.slice(-4)}...`
    );

    publicClient = createPublicClient({
      transport: custom(window.ethereum as any),
    });

    try {
      console.log("Simulating withdraw transaction...");
      const currentChain = await getCurrentChain(walletClient);

      const { request } = await publicClient.simulateContract({
        address: contractAddress as Address,
        account: connectedAccount,
        abi: coffeeAbi,
        functionName: "withdraw",
        chain: currentChain,
      });

      console.log("Simulation succeeded. Sending transaction...");
      const hash = await walletClient.writeContract(request);

      console.log("Withdraw Transaction Hash:", hash);
      console.log("Withdraw successful!");
    } catch (error) {
      console.error("Withdraw simulation failed:", error);
    }
  } catch (error) {
    console.error("Withdraw failed:", error);
  }
}

async function connect(): Promise<void> {
  try {
    requireEthereum();

    console.log("MetaMask (or compatible wallet) is available!");
    console.log("Connecting using viem...");

    walletClient = createWalletClient({
      transport: custom(window.ethereum as any),
    });

    const addresses = (await walletClient.requestAddresses()) as Address[];
    console.log("Connected addresses:", addresses);

    if (addresses[0]) {
      connectButton.innerHTML = `Connected Address: ${addresses[0].slice(0, 6)}...${addresses[0].slice(-4)}`;
    } else {
      connectButton.innerHTML = "Try Again";
    }
  } catch (error) {
    console.error("Connection failed:", error);
    connectButton.innerHTML = "Try Again";
  }
}

// ---- wire up buttons ----
connectButton.onclick = () => void connect();
fundButton.onclick = () => void fund();
balanceButton.onclick = () => void getBalance();
withdrawButton.onclick = () => void withdraw();