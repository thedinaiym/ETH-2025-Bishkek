# 🏠 RealEstate Fractional — Web3 Property Investment Platform

A next-generation decentralized app for **fractional real estate ownership**, built on **Scaffold-ETH 2** and **Status Network Sepolia**.

---

## 🌟 Core Highlights

### 🏘️ **Smart Property Marketplace**
- Powerful filters by rooms, districts, and price range. Real data parsef from **lalafo.kg**: https://lalafo.kg/
- Fast server-side pagination (12 properties per page)  
- All prices displayed in **ETH** for seamless blockchain transactions  

### 💎 **Fractional Ownership (ERC-1155)**
- Buy real-estate shares directly with **ETH**  
- Each property divided into **100 blockchain-verified shares**  
- Transparent and immutable ownership records  

### 🤖 **AI Chat Assistant (Google Gemini)**
- Helps users find ideal properties by budget or location  
- Answers legal and investment questions  
- Guides users through wallet setup and blockchain payments  

### 📊 **Market Analytics**
- Real-time charts and pricing trends  
- Property breakdowns by room count and district  
- Average and historical market values  

### 💼 **Investor Dashboard**
- View and manage owned property shares  
- Track portfolio value and percentage ownership  
- Monitor progress of sold shares  

### 🔐 **Web3 Integration**
- Wallet connection via **RainbowKit** (MetaMask, WalletConnect, etc.)  
- Smart-contract interactions with **Wagmi + Viem**  
- Secure and transparent transactions on **Status Network Sepolia**

---

## 🧰 Tech Stack

**Frontend:**  
Next.js 15 • TypeScript • Tailwind CSS + DaisyUI • RainbowKit • Recharts  

**Blockchain:**  
Solidity 0.8.20 • Hardhat • OpenZeppelin • Scaffold-ETH 2  

**AI Layer:**  
Google Gemini API (with smart fallback for offline responses)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd realestate-fractional

# Install dependencies
cd packages/nextjs && yarn install
cd ../hardhat && yarn install
```

### ⚙️ Environment Setup
Create `.env` files:

```bash
# packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_wallet_private_key

# packages/nextjs/.env.local
GEMINI_API_KEY=your_gemini_api_key
```
#after connection and deploy yo can see:
```bash
✅ Адрес контракта: 0x95b61D61D105C3E2d29dd6b2aD033B68fdb04C77
✅ Сеть: Ethereum Sepolia
✅ Транзакция: 0x586df7da812c6f79eac6ac9488c953d430d7710c299f13eb42e581594fc31c37
```

### 🧩 Deploy Contracts

```bash
cd packages/hardhat
yarn hardhat compile
yarn hardhat deploy --network statusSepolia
```

### 💻 Run Frontend

```bash
cd packages/nextjs
yarn dev
```

Then open your browser at  
👉 **http://localhost:3000**

---

## ⚙️ How It Works

### 🪙 For Investors
1️⃣ Connect your wallet (MetaMask recommended)  
2️⃣ Explore the marketplace and choose a property  
3️⃣ Purchase shares in **ETH** and confirm via wallet  
4️⃣ View your holdings in the **Portfolio** section  

### 🏗️ For Admins
- `createProperty()` — tokenize new listings  
- `purchaseShares()` — enable fractional purchases  
- `withdrawPropertyProceeds()` — claim creator earnings  
- `togglePropertyStatus()` — activate/deactivate listings  

---

## 🧾 Smart Contract — `RealEstateFractional.sol`

**Highlights**
- ERC-1155 multi-token standard  
- Role-based admin access  
- Price & share validation logic  
- Proceeds tracking for safe withdrawals  
- Emergency admin controls  

**Security**
- Prevents double withdrawals  
- Only creators can withdraw proceeds  
- Validates share divisibility and price integrity  
- Built with **OpenZeppelin contracts**

---

## 🎨 Design System

- Green–white minimal theme with black accents  
- Responsive card-based property layouts  
- Floating **AI assistant button**  
- Modern UI powered by DaisyUI + Tailwind  

---

## 🌐 Network Configuration

**Status Network Sepolia (Testnet)**  
- **Chain ID:** 1660990954  
- **RPC:** https://public.sepolia.rpc.status.network  
- **Explorer:** https://sepoliascan.status.network  
- **Faucet:** https://faucet.status.network  

---

## 📜 License & Credits

MIT © 2025 Dinaiym Dubanaev  

Built with ❤️ using **Scaffold-ETH 2** on **Status Network Sepolia**

---

## 🔗 Useful Links
- [📘 Scaffold-ETH 2 Docs](https://docs.scaffoldeth.io)  
- [🌐 Status Network](https://status.network)  
- [🛡️ OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)  
- [⚙️ Wagmi Documentation](https://wagmi.sh)  
- [💡 Viem Documentation](https://viem.sh)
