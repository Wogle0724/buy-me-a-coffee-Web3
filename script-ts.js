"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// script.ts
var viem_1 = require("viem");
var constants_1 = require("./constants");
// ---- DOM helpers ----
function getEl(id) {
    var el = document.getElementById(id);
    if (!el)
        throw new Error("Missing element with id=\"".concat(id, "\""));
    return el;
}
var connectButton = getEl("connectButton");
var fundButton = getEl("fundButton");
var balanceButton = getEl("balanceButton");
var withdrawButton = getEl("withdrawButton");
var ethAmountInput = getEl("ethAmount");
// ---- viem clients (typed) ----
var walletClient;
var publicClient;
function requireEthereum() {
    if (typeof window.ethereum === "undefined") {
        throw new Error("No wallet detected. Please install MetaMask (or a compatible wallet).");
    }
    return window.ethereum;
}
function getCurrentChain(client) {
    return __awaiter(this, void 0, void 0, function () {
        var chainId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getChainId()];
                case 1:
                    chainId = _a.sent();
                    // NOTE: This describes the chain; the *transport* decides where requests go.
                    // Here we keep your behavior, relying on MetaMask's provider.
                    return [2 /*return*/, (0, viem_1.defineChain)({
                            id: chainId,
                            name: "Local Devnet",
                            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                            rpcUrls: { default: { http: ["http://localhost:8545"] } },
                        })];
            }
        });
    });
}
function getBalance() {
    return __awaiter(this, void 0, void 0, function () {
        var balance, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    requireEthereum();
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, publicClient.getBalance({
                            address: constants_1.contractAddress,
                        })];
                case 1:
                    balance = _a.sent();
                    console.log("Current Balance: ".concat((0, viem_1.formatEther)(balance), " ETH"));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to get balance:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fund() {
    return __awaiter(this, void 0, void 0, function () {
        var ethAmount, addresses, connectedAccount, currentChain, value, request, hash, error_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ethAmount = ethAmountInput.value;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    requireEthereum();
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 2:
                    addresses = (_a.sent());
                    connectedAccount = addresses[0];
                    if (!connectedAccount) {
                        console.log("No account connected.");
                        return [2 /*return*/];
                    }
                    console.log("Funding Account ".concat(connectedAccount.slice(0, 6), "...").concat(connectedAccount.slice(-4), " with ").concat(ethAmount, " ETH..."));
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, , 8]);
                    console.log("Simulating transaction...");
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 4:
                    currentChain = _a.sent();
                    value = (0, viem_1.parseEther)(ethAmount);
                    console.log("Parsed Ether Amount:", value);
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_1.contractAddress,
                            account: connectedAccount,
                            abi: constants_1.coffeeAbi,
                            functionName: "fund",
                            value: value,
                            chain: currentChain,
                        })];
                case 5:
                    request = (_a.sent()).request;
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 6:
                    hash = _a.sent();
                    console.log("Transaction Hash:", hash);
                    console.log("Funding successful!");
                    return [3 /*break*/, 8];
                case 7:
                    error_2 = _a.sent();
                    console.error("Simulation failed:", error_2);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_3 = _a.sent();
                    console.error("Funding failed:", error_3);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function withdraw() {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, connectedAccount, currentChain, request, hash, error_4, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    requireEthereum();
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 1:
                    addresses = (_a.sent());
                    connectedAccount = addresses[0];
                    if (!connectedAccount) {
                        console.log("No account connected.");
                        return [2 /*return*/];
                    }
                    console.log("Withdrawing from contract as ".concat(connectedAccount.slice(0, 6), "...").concat(connectedAccount.slice(-4), "..."));
                    publicClient = (0, viem_1.createPublicClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    console.log("Simulating withdraw transaction...");
                    return [4 /*yield*/, getCurrentChain(walletClient)];
                case 3:
                    currentChain = _a.sent();
                    return [4 /*yield*/, publicClient.simulateContract({
                            address: constants_1.contractAddress,
                            account: connectedAccount,
                            abi: constants_1.coffeeAbi,
                            functionName: "withdraw",
                            chain: currentChain,
                        })];
                case 4:
                    request = (_a.sent()).request;
                    console.log("Simulation succeeded. Sending transaction...");
                    return [4 /*yield*/, walletClient.writeContract(request)];
                case 5:
                    hash = _a.sent();
                    console.log("Withdraw Transaction Hash:", hash);
                    console.log("Withdraw successful!");
                    return [3 /*break*/, 7];
                case 6:
                    error_4 = _a.sent();
                    console.error("Withdraw simulation failed:", error_4);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_5 = _a.sent();
                    console.error("Withdraw failed:", error_5);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function connect() {
    return __awaiter(this, void 0, void 0, function () {
        var addresses, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    requireEthereum();
                    console.log("MetaMask (or compatible wallet) is available!");
                    console.log("Connecting using viem...");
                    walletClient = (0, viem_1.createWalletClient)({
                        transport: (0, viem_1.custom)(window.ethereum),
                    });
                    return [4 /*yield*/, walletClient.requestAddresses()];
                case 1:
                    addresses = (_a.sent());
                    console.log("Connected addresses:", addresses);
                    if (addresses[0]) {
                        connectButton.innerHTML = "Connected Address: ".concat(addresses[0].slice(0, 6), "...").concat(addresses[0].slice(-4));
                    }
                    else {
                        connectButton.innerHTML = "Try Again";
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error("Connection failed:", error_6);
                    connectButton.innerHTML = "Try Again";
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// ---- wire up buttons ----
connectButton.onclick = function () { return void connect(); };
fundButton.onclick = function () { return void fund(); };
balanceButton.onclick = function () { return void getBalance(); };
withdrawButton.onclick = function () { return void withdraw(); };
