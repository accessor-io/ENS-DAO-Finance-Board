# ENS DAO Finance Schema Dashboard

A comprehensive React-based dashboard for monitoring and analyzing ENS DAO's financial data, treasury management, and blockchain transactions in real-time.

## Features

### 📊 **Comprehensive Financial Overview**
- Total assets, expenditures, and net balance tracking
- Real-time treasury value monitoring
- Historical expenditure analysis
- Asset allocation visualization

### 🔄 **Real-Time Data Integration**
- Live blockchain data from Etherscan API
- ENS domain resolution and reverse lookups
- Gas price monitoring
- Transaction history with status tracking

### 📈 **Advanced Analytics**
- Risk assessment metrics
- Treasury health scoring
- Performance insights and recommendations
- Multi-dimensional chart visualizations

### 💰 **ENDAOment Management**
- Fund tracking and disbursement monitoring
- Recipient analysis and grant management
- Safe wallet integration
- Karpatkey Finance performance metrics

### 🏦 **Treasury Operations**
- Multi-wallet balance monitoring
- Transaction categorization and filtering
- Contract interaction tracking
- Expenditure pattern analysis

### 📋 **Data Management**
- Sortable and filterable tables
- Export capabilities
- Historical data preservation
- Caching for performance optimization

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Charts**: Recharts library
- **APIs**: Etherscan, Dune Analytics, ENS Domains
- **State Management**: React Hooks with custom data fetching
- **Styling**: Tailwind CSS with responsive design

## Project Structure

```
src/
├── components/
│   ├── charts/           # Chart components (PieChart, BarChart, etc.)
│   ├── Dashboard.jsx     # Main dashboard component
│   ├── AnalyticsOverview.jsx  # Advanced analytics view
│   ├── RealTimeData.jsx  # Live blockchain data
│   ├── EndaomentOverview.jsx  # ENDAOment fund management
│   ├── WalletsTable.jsx  # Treasury wallet management
│   ├── TransactionsTable.jsx  # Transaction history
│   ├── ExpendituresTable.jsx  # Expenditure tracking
│   ├── ContractsTable.jsx     # Smart contract monitoring
│   └── StatsCard.jsx     # Metric display cards
├── data/
│   └── ensData.js        # Mock data and financial schemas
├── services/
│   └── api.js           # API integration services
├── hooks/
│   └── useENSData.js    # Custom data fetching hook
└── App.jsx              # Main application component
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm package manager
- API keys for Etherscan and Dune Analytics (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workspace/dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in `workspace/dashboard`:
   ```env
   VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
   VITE_DUNE_API_KEY=your_dune_api_key
   VITE_ALCHEMY_API_KEY=your_alchemy_api_key
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Integration

### Etherscan API
- Account balance monitoring
- Transaction history retrieval
- Token transfer tracking
- Gas price monitoring

### Dune Analytics API
- Custom query execution
- Historical data analysis
- Performance metrics calculation

### ENS Domains API
- Domain resolution
- Reverse record lookup
- ENS name validation

### Alchemy (Ethereum Mainnet)
- Used for multi-wallet transfers, balances, and enriched on-chain metadata
- Methods utilized: `eth_getBalance`, `alchemy_getAssetTransfers`, `alchemy_getTokenBalances`
- Ensure `VITE_ALCHEMY_API_KEY` is set

## Data Sources

### Treasury Addresses
- `0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7` - Main treasury
- `0x4F2083f5fBede34C2714aFfb3105539775f7FE64` - ENDAOment fund
- `0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5` - Controller

### Smart Contracts
- ENS Token: `0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72`
- Governor: `0x323A76393544d5ecca80cd6ef2A560C6A395b7E3`
- Registry: `0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41`

## Features in Detail

### Real-Time Monitoring
- Auto-refresh every 5 minutes
- Error handling and retry mechanisms
- Caching for performance optimization
- Loading states and user feedback

### Analytics Dashboard
- Risk assessment metrics
- Treasury health scoring
- Performance insights
- Strategic recommendations

### Data Visualization
- Interactive charts and graphs
- Responsive design
- Export capabilities
- Filtering and sorting

### Security Features
- API key management
- Rate limiting protection
- Error boundary implementation
- Secure data handling

## Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

### Code Style
- ESLint configuration for code quality
- Prettier for consistent formatting
- TypeScript-ready structure
- Component-based architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Note**: This dashboard is designed for educational and analytical purposes. Always verify data independently before making financial decisions.
