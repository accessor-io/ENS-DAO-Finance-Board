// Alchemy API Service for ENS DAO Blockchain Data
const ALCHEMY_API_KEY = 'ciDQECovJQpXvHppjWJrf';
const ALCHEMY_BASE_URL = 'https://eth-mainnet.g.alchemy.com/v2';
const ENS_DAO_ADDRESS = '0x8f730f4aC5fd234df9993E0E317f07e44fb869C1';

class AlchemyAPIService {
  constructor() {
    this.baseURL = `${ALCHEMY_BASE_URL}/${ALCHEMY_API_KEY}`;
  }

  // Fetch ENS DAO account balance
  async getENSDAOBalance() {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [ENS_DAO_ADDRESS, 'latest']
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Convert hex balance to decimal
      const balanceWei = parseInt(data.result, 16);
      const balanceEth = balanceWei / Math.pow(10, 18);
      
      return {
        address: ENS_DAO_ADDRESS,
        balanceWei,
        balanceEth,
        balanceFormatted: `${balanceEth.toFixed(4)} ETH`
      };
    } catch (error) {
      console.error('Error fetching ENS DAO balance:', error);
      throw error;
    }
  }

  // Fetch ENS DAO transaction history
  async getENSDAOTransactions(limit = 50) {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: ENS_DAO_ADDRESS,
            category: ['external', 'internal', 'erc20', 'erc721', 'erc1155'],
            maxCount: `0x${limit.toString(16)}`
          }]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result.transfers || [];
    } catch (error) {
      console.error('Error fetching ENS DAO transactions:', error);
      throw error;
    }
  }

  // Fetch ENS DAO token holdings
  async getENSDAOTokenHoldings() {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenBalances',
          params: [ENS_DAO_ADDRESS]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result.tokenBalances || [];
    } catch (error) {
      console.error('Error fetching ENS DAO token holdings:', error);
      throw error;
    }
  }



  // Fetch ENS DAO contract interactions
  async getENSDAOContractInteractions() {
    try {
      const response = await fetch(`${this.baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [{
            fromBlock: '0x0',
            toBlock: 'latest',
            fromAddress: ENS_DAO_ADDRESS,
            category: ['external'],
            maxCount: '0x32'
          }]
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.result.transfers || [];
    } catch (error) {
      console.error('Error fetching ENS DAO contract interactions:', error);
      throw error;
    }
  }

  // Get ENS DAO gas usage statistics
  async getENSDAOGasStats() {
    try {
      const transactions = await this.getENSDAOTransactions(100);
      
      const gasStats = transactions.reduce((stats, tx) => {
        if (tx.gas) {
          const gasUsed = parseInt(tx.gas, 16);
          stats.totalGas += gasUsed;
          stats.transactionCount++;
          stats.averageGas = stats.totalGas / stats.transactionCount;
        }
        return stats;
      }, { totalGas: 0, transactionCount: 0, averageGas: 0 });

      return gasStats;
    } catch (error) {
      console.error('Error calculating gas stats:', error);
      throw error;
    }
  }

  // Get comprehensive ENS DAO data
  async getENSDAOComprehensiveData() {
    try {
      const [
        balance,
        transactions,
        tokenHoldings,
        contractInteractions,
        gasStats
      ] = await Promise.all([
        this.getENSDAOBalance(),
        this.getENSDAOTransactions(20),
        this.getENSDAOTokenHoldings(),
        this.getENSDAOContractInteractions(),
        this.getENSDAOGasStats()
      ]);

      return {
        address: ENS_DAO_ADDRESS,
        balance,
        transactions: transactions.slice(0, 10), // Latest 10 transactions
        tokenHoldings,
        contractInteractions: contractInteractions.slice(0, 10),
        gasStats,
        summary: {
          totalTransactions: transactions.length,
          totalTokens: tokenHoldings.length,
          totalContractInteractions: contractInteractions.length,
          lastUpdated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error fetching comprehensive ENS DAO data:', error);
      throw error;
    }
  }

  // Format transaction data for display
  formatTransaction(tx) {
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value ? parseInt(tx.value, 16) / Math.pow(10, 18) : 0,
      gas: tx.gas ? parseInt(tx.gas, 16) : 0,
      gasPrice: tx.gasPrice ? parseInt(tx.gasPrice, 16) : 0,
      blockNumber: tx.blockNum ? parseInt(tx.blockNum, 16) : 0,
      timestamp: tx.timestamp || new Date().getTime(),
      category: tx.category,
      asset: tx.asset || 'ETH'
    };
  }

  // Format token balance data
  formatTokenBalance(token) {
    return {
      contractAddress: token.contractAddress,
      tokenBalance: token.tokenBalance,
      error: token.error,
      name: token.name || 'Unknown Token',
      symbol: token.symbol || 'UNKNOWN',
      decimals: token.decimals || 18
    };
  }
}

export default new AlchemyAPIService(); 