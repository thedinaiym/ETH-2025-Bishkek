# RealEstate Fractional - Web3 Property Investment Platform

A decentralized platform for fractional real estate ownership built on Scaffold-ETH 2 and Status Network Sepolia testnet. 

## 🌟 Features

### 🏘️ **Property Marketplace**
- Advanced filtering by rooms, districts, price range, and search
- Server-side pagination for optimal performance (12 properties per page)
- All prices displayed in ETH for seamless blockchain transactions

### 💎 **Fractional Ownership (ERC-1155)**
- Purchase fractional shares of properties with ETH
- Each property divided into 100 equal shares
- Blockchain-verified ownership via smart contracts
- Transparent, immutable transaction records

### 🤖 **AI Chat Assistant**
- Powered by Google Gemini AI
- Helps users find suitable properties based on preferences
- Answers legal questions about fractional ownership
- Provides guidance on blockchain transactions and Web3 wallets

### 📊 **Market Statistics**
- Real-time market analytics with interactive charts
- Price distribution analysis
- Properties breakdown by rooms and districts
- Average pricing trends

### 💼 **Investor Portfolio**
- View all owned property fractions
- Track ownership percentages and values
- Monitor sold shares across properties
- Direct links to property details

### 🔐 **Web3 Integration**
- RainbowKit wallet connection (MetaMask, WalletConnect, etc.)
- Smart contract interactions via Wagmi and Viem
- Secure blockchain transactions on Status Network Sepolia
- Real-time data synchronization from smart contracts

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** + **DaisyUI** - Modern UI with green-black-white theme
- **Wagmi** + **Viem** - Web3 React hooks and Ethereum interactions
- **RainbowKit** - Wallet connection UI
- **Recharts** - Interactive data visualization
- **Google Gemini AI** - Intelligent chat assistant

### Blockchain
- **Scaffold-ETH 2** - Full-stack Ethereum development framework
- **Hardhat** - Ethereum development environment
- **Solidity 0.8.20** - Smart contract language
- **OpenZeppelin** - Secure contract standards
- **Status Network Sepolia** - EVM-compatible testnet (Chain ID: 1660990954)

### Smart Contracts
- **RealEstateFractional.sol** - ERC-1155 token contract with:
  - Property creation and management
  - Fractional share purchases
  - Price and share validation
  - Proceeds withdrawal for property creators
  - Admin controls and emergency functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and Yarn
- MetaMask or compatible Web3 wallet
- ETH on Status Network Sepolia testnet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd realestate-fractional
```

2. **Install dependencies**
```bash
cd packages/nextjs && yarn install
cd ../hardhat && yarn install
```

3. **Set up environment variables**
```bash
# In packages/hardhat/.env
DEPLOYER_PRIVATE_KEY=your_wallet_private_key

# In packages/nextjs/.env.local
GEMINI_API_KEY=your_gemini_api_key
```

4. **Compile smart contracts**
```bash
cd packages/hardhat
yarn hardhat compile
```

5. **Deploy contracts to Status Network Sepolia**
```bash
yarn hardhat deploy --network statusSepolia
```

6. **Start the development server**
```bash
cd packages/nextjs
yarn dev
```

7. **Open your browser**
Navigate to `http://localhost:3000`

## 📖 How It Works

### For Buyers (Investors)

1. **Connect Wallet**
   - Click "Connect Wallet" button in header
   - Choose your preferred wallet (MetaMask recommended)
   - Approve the connection to Status Network Sepolia

2. **Browse Properties**
   - Navigate to Marketplace
   - Use filters to find properties matching your criteria
   - Click on properties to view detailed information

3. **Purchase Fractions**
   - On property detail page, select number of shares to purchase
   - Review total cost in ETH
   - Click "Buy" and approve the transaction in your wallet
   - Wait for blockchain confirmation

4. **View Portfolio**
   - Navigate to Portfolio page
   - See all your owned property fractions
   - Track ownership percentages and current values
   - Monitor sales progress for each property

### For Property Creators (Platform Admins)

1. **Create Property Listing**
   - Use Debug Contracts page or call `createProperty()` function
   - Provide: title, location, total price (wei), shares count, metadata URI
   - Contract validates price divisibility and share price

2. **Activate/Deactivate Listings**
   - Toggle property status via `togglePropertyStatus()`
   - Only active properties can be purchased

3. **Withdraw Proceeds**
   - Call `withdrawPropertyProceeds(tokenId)`
   - Contract tracks withdrawn amounts to allow multiple withdrawals
   - Receive proceeds directly to creator wallet

## 💰 Payment & Data Flow

### Price Conversion
```
Property Price (KGS/USD) → ETH Price → Wei Amount
Example: 5,000,000 KGS ≈ $58,824 ≈ 23.5 ETH ≈ 23,500,000,000,000,000,000 Wei
```

### Purchase Flow
```
1. User selects shares → Frontend calculates total cost in Wei
2. User approves transaction → Smart contract validates:
   - Property is active
   - Sufficient shares available
   - Correct payment amount sent
3. Contract mints ERC-1155 tokens → User receives fractional ownership
4. Contract updates sharesSold counter
5. Frontend updates to reflect new ownership
```

### Data Sources
- **Property Data**: Loaded from `/data/properties.json` (93,602 properties from Lalafo.kg)
- **Blockchain Data**: Read from RealEstateFractional smart contract via Wagmi hooks
- **Price Synchronization**: Contract data takes precedence for active properties

## 🏗️ Smart Contract Architecture

### RealEstateFractional.sol

**Key Features:**
- ERC-1155 multi-token standard
- Role-based access control (Admin, Default Admin)
- Automatic property ID counter
- Price validation (prevents zero-cost minting)
- Proceeds tracking for multiple withdrawals

**Main Functions:**
- `createProperty()` - Tokenize a new property
- `purchaseShares()` - Buy fractional shares with ETH
- `getUserOwnedProperties()` - Get user's property list
- `withdrawPropertyProceeds()` - Claim sales proceeds
- `togglePropertyStatus()` - Activate/deactivate property
- `emergencyWithdraw()` - Admin safety function

**Security Features:**
- Validates total price >= total shares
- Ensures price is evenly divisible by shares
- Prevents share price from being zero
- Tracks withdrawn proceeds to avoid double-withdrawal
- Only property creator can withdraw proceeds

## 🎨 Design System

**Color Scheme:**
- Primary: Green (#10B981) - Actions, buttons, highlights
- Background: White/Black - Clean, professional appearance
- Accents: Various green shades for depth and hierarchy

**Components:**
- DaisyUI components with custom green theme
- Responsive grid layouts
- Card-based property displays
- Modal dialogs for wallet connection
- Floating chat assistant button

## 🤖 AI Assistant Features

The Gemini-powered chatbot helps with:
- **Property Recommendations**: Suggests properties based on budget, location, room preferences
- **Legal Guidance**: Explains fractional ownership rights, voting, profit sharing
- **Blockchain Education**: Teaches about Web3, wallets, and transactions
- **Platform Navigation**: Helps users understand how to use the platform

## 📈 Statistics & Analytics

The statistics page provides:
- Total properties count and market value
- Average property prices in ETH
- Price distribution across ranges
- Properties count by room type
- Top districts by property availability
- Average pricing trends by property type

## 🔒 Security Considerations

- Smart contracts audited for common vulnerabilities
- Private keys stored securely in environment variables
- No sensitive data exposed to frontend
- HTTPS required for production deployments
- Wallet signatures required for all transactions
- Smart contract access controls via OpenZeppelin

## 🌐 Network Configuration

**Status Network Sepolia Testnet:**
- Chain ID: 1660990954
- RPC URL: https://public.sepolia.rpc.status.network
- Explorer: https://sepoliascan.status.network
- Faucet: https://faucet.status.network

## 📝 License

This project is built with Scaffold-ETH 2 and uses various open-source technologies.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For questions or issues:
- Use the built-in AI chat assistant
- Check the smart contract on block explorer
- Review Scaffold-ETH 2 documentation

## 🔗 Links

- [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
- [Status Network](https://status.network)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)

---

**Built with ❤️ using Scaffold-ETH 2 on Status Network Sepolia**
## License
MIT License © 2025 Dinaiym Dubanaev
