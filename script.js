// Import necessary functions from viem
import { createWalletClient, custom, createPublicClient, defineChain, parseEther } from "https://esm.sh/viem";
import { contractAddress, coffeeAbi } from "./constants.js";

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById("fundButton");
const ethAmountInput = document.getElementById("ethAmount");
// const balanceButton = document.getElementById("balanceButton");

let walletClient;
let publicKey;

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
      default: { http: ["http://localhost:5500"] },
    },
    // Add other chain-specific details if needed (e.g., blockExplorers)
  });
  return currentChain;
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
        const simulationResult = await publicKey.simulateContract({
          address: contractAddress, 
          account: connectedAccount,
          abi: coffeeAbi,
          functionName: 'fund',
          value: parseEther(ethAmount),
          chain: currentChain
        });
        console.log("Simulation successful:", simulationResult);

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
// balanceButton.onclick = getBalance;