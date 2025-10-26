# RealEstate Fractional Web3 Platform

## Overview
RealEstate Fractional is a decentralized Web3 platform enabling fractional ownership of real estate properties via blockchain. Each property is tokenized using the ERC-1155 standard, allowing investors to purchase shares in real estate using Ethereum (ETH).

## Key Features
- **Fractional Ownership:** Divide any property into 100 equal blockchain-backed shares.
- **ERC-1155 Smart Contract:** Efficient multi-token standard supporting multiple properties in one contract.
- **Transparent Investment:** All transactions are recorded on Ethereum.
- **AI Assistant:** Helps users understand investment terms, purchase shares, and get legal guidance.
- **Fallback Mode:** Ensures continuous chatbot operation even when AI API fails.
- **Statistics Page:** Real-time charts and analytics on ownership and market trends.

## Smart Contract Functions
- `createProperty(title, location, totalPrice, totalShares, metadataURI)` — creates a new property token.
- `purchaseShares(tokenId, shares)` — enables users to buy shares using ETH.
- `withdrawPropertyProceeds(tokenId)` — allows creators to withdraw proceeds.
- `getUserOwnedProperties()` — fetches user's owned property tokens.

## Frontend Tech Stack
- **React + TypeScript**
- **Wagmi / Viem / RainbowKit** for Web3 wallet integration
- **Chart.js / Recharts** for visual analytics
- **Gemini API** for AI-driven assistant (with fallback pattern-matching)

## Deployment
- **Network:** Sepolia Testnet
- **Smart Contract:** `RealEstateFractional.sol`
- **Hosting:** Replit / Vercel
- **Environment Variables:**
  - `DEPLOYER_PRIVATE_KEY`
  - `GEMINI_API_KEY`

## AI Fallback System
If the Gemini API is unavailable, the assistant automatically switches to predefined responses for:
- Greetings
- Help and guidance
- Platform overview
- Pricing and ownership questions
- Blockchain & wallet setup

## License
MIT License © 2025 Dinaiym Dubanaev
