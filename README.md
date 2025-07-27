# CrossYield

Unite Defi Hackathon 2025 project - CrossYield is a cross-chain yield migration router that lets users securely exit and re-enter yield farms between Ethereum and Aptos in a single atomic operation.

# 🌉 CrossYield: Cross-Chain Yield Optimization Protocol

> Earn the best DeFi yields across Ethereum and Aptos, automatically.  
> Powered by 1inch Fusion+, LayerZero, and next-gen intent-based smart routing.

---

## 🔥 Problem

- Yield opportunities are fragmented across chains.
- Users lack tools to optimize yields without manual bridging/swapping.
- Gas fees and bad UX kill adoption of cross-chain DeFi strategies.

---

## 🎯 Solution

**CrossYield** is a cross-chain yield optimizer that:

- Accepts deposits in USDT, USDC, or ETH
- Scans yield protocols on Ethereum and Aptos in real-time
- Automatically bridges/swaps tokens to deposit into the **highest-yielding strategy**
- Lets users monitor and withdraw funds any time

---

## 🌐 Supported Chains

- Ethereum
- Aptos _(non-EVM chain integration with hashlock/timelock for swap security)_

---

## 🔁 Protocol Flow

1. **Deposit**: User deposits ETH, USDT, or USDC via MetaMask
2. **Yield Optimization**: Backend finds best APY (e.g., Aave vs Aries)
3. **Cross-Chain Swap**: Uses 1inch Fusion+ to swap/bridge tokens
4. **Strategy Execution**: Funds are deposited into highest-yield protocol
5. **Withdraw**: User can withdraw anytime and receive tokens back in their wallet

---

## 🧱 Architecture Overview

```plaintext
[User Wallet]
     ↓
[Frontend App - Next.js + Tailwind]
     ↓
[Backend API - Node.js/Golang]
     ↓
[Yield Engine - APY Scanner]
     ↓
[Relayer - 1inch Fusion+, LayerZero]
     ↓
[On-chain Contracts - Solidity + Move]
     ↓
[Yield Protocols - Aave, Aries, etc.]
```
