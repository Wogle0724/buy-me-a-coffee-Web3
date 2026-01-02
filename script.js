// Import necessary functions from viem
import { createWalletClient, custom, createPublicClient, defineChain, parseEther, formatEther } from "https://esm.sh/viem";
import { contractAddress, coffeeAbi } from "./constants.js";

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

let walletClient;
let publicKey;

async function getBalance(){
  if (typeof walletClient == "undefined") {
    console.log("No wallet detected. Please connect!");
    return;
  } else {
    try {
      publicKey = createPublicClient({
            transport: custom(window.ethereum),
      });
      const balance = await publicKey.getBalance({
        address: contractAddress
      });
      console.log(`Current Balance: ${formatEther(balance)} ETH`);
    }
    catch (error) {
      console.error("Failed to get balance:", error);
    }
  }
}

async function getCurrentChain(client){
  const chainId = await client.getChainId();
  const currentChain = defineChain({
    id: chainId,
    name: "Local Devnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      // Use the RPC URL of your local node
      default: { http: ["http://localhost:8545"] },
    },
    // Add other chain-specific details if needed (e.g., blockExplorers)
  });
  return currentChain;
}

async function withdraw(){
  if (typeof walletClient == "undefined") {
    console.log("No wallet detected. Please connect!");
    return;
  } else {
    try {
      // Wallet client for signing/sending the transaction
      walletClient = createWalletClient({
        transport: custom(window.ethereum),
      });

      // Request account access
      const addresses = await walletClient.requestAddresses();
      const [connectedAccount] = addresses;

      console.log(`Withdrawing from contract as ${connectedAccount.slice(0,6) + "..." + connectedAccount.slice(-4)}...`);

      // Public client for simulation / call
      publicKey = createPublicClient({
        transport: custom(window.ethereum),
      });

      try {
        console.log("Simulating withdraw transaction...");
        const currentChain = await getCurrentChain(walletClient);

        // Simulate the contract call (no value sent for withdraw)
        const { request } = await publicKey.simulateContract({
          address: contractAddress,
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
}


async function fund(){
  const ethAmount = ethAmountInput.value;
  if (typeof walletClient == "undefined") {
    console.log("No wallet detected. Please connect!");
    return;
  } else {
    try {
      walletClient = createWalletClient({
            transport: custom(window.ethereum),
      });
      // Request account access (important step!)
      const addresses = await walletClient.requestAddresses();
      const [connectedAccount] = addresses;
      console.log(`Funding Account ${connectedAccount.slice(0,6) + "..." + connectedAccount.slice(-4)} with ${ethAmount} ETH...`);
      publicKey = createPublicClient({
        transport: custom(window.ethereum)
      })
      console.log("Public Key:", publicKey);
      // Attempting simulated transaction
      try{
        console.log("Simulating transaction...");
        const currentChain = await getCurrentChain(walletClient);
        console.log("Parsed Ether Amount:", parseEther(ethAmount));
        // Makes a request on the public client to simulate the contract call
        const { request } = await publicKey.simulateContract({
          address: contractAddress, 
          account: connectedAccount,
          abi: coffeeAbi,
          functionName: 'fund',
          value: parseEther(ethAmount),
          chain: currentChain
        });
        console.log(request);
        // Once it has the contract, calls the actual wallet and asks to send the transaction
        const hash = await walletClient.writeContract(request);
        console.log("Transaction Hash:", hash);
        console.log("Funding successful!");

      }
      catch(error){
        console.error("Simulation failed:", error);
      }
  
    }
    catch (error) {
      console.error("Funding failed:", error);
    }
  }

}

async function connect() {
  // Check if window.ethereum is present
  if (typeof window.ethereum !== "undefined") {
    // Wallet is likely installed
    console.log("MetaMask (or compatible wallet) is available!");
    console.log("Connecting using viem...");
    // Create a Wallet Client
    walletClient = createWalletClient({
      transport: custom(window.ethereum) // Use the browser's injected provider
    });

    try {
        // Request wallet connection (account addresses)
        const addresses = await walletClient.requestAddresses();
        console.log("Connected addresses:", addresses);

        connectButton.innerHTML = `Connected Address: ${addresses[0].slice(0,6)}...${addresses[0].slice(-4)}`; 

    } catch (error) {
        console.error("Connection failed:", error);
        connectButton.innerHTML = "Try Again"; // Update button text
    }
  } else {
    // Wallet is not installed
    console.log("No wallet detected.");
    connectButton.innerHTML = "Please install MetaMask!"; // Update button text
  }
}

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;