// API service for fetching ENS DAO financial data
const API_BASE_URL = 'https://api.etherscan.io/api';
const DUNE_API_URL = 'https://api.dune.com/api/v1';
const ENS_API_URL = 'https://api.ens.domains';

// Configuration
const config = {
  etherscan: {
    apiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || '',
    baseUrl: API_BASE_URL
  },
  dune: {
    apiKey: import.meta.env.VITE_DUNE_API_KEY || '',
    baseUrl: DUNE_API_URL
  },
  ens: {
    baseUrl: ENS_API_URL
  }
};

// Utility functions
const formatAddress = (address) => {
  return address.toLowerCase();
};

const formatCurrency = (amount, decimals = 18) => {
  return (parseInt(amount) / Math.pow(10, decimals)).toString();
};

// Etherscan API calls
export const etherscanAPI = {
  async getAccountBalance(address) {
    try {
      const response = await fetch(
        `${config.etherscan.baseUrl}?module=account&action=balance&address=${formatAddress(address)}&tag=latest&apikey=${config.etherscan.apiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1') {
        return {
          address: formatAddress(address),
          balance: formatCurrency(data.result),
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(`Etherscan API error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching account balance:', error);
      throw error;
    }
  },

  async getTransactionHistory(address, startBlock = 0, endBlock = 99999999) {
    try {
      const response = await fetch(
        `${config.etherscan.baseUrl}?module=account&action=txlist&address=${formatAddress(address)}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${config.etherscan.apiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result.map(tx => ({
          hash: tx.hash,
          from: formatAddress(tx.from),
          to: formatAddress(tx.to),
          value: formatCurrency(tx.value),
          gas: tx.gas,
          gasPrice: formatCurrency(tx.gasPrice, 9),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNumber),
          confirmations: parseInt(tx.confirmations),
          isError: tx.isError === '1'
        }));
      } else {
        throw new Error(`Etherscan API error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  async getTokenTransfers(address, contractAddress = null) {
    try {
      let url = `${config.etherscan.baseUrl}?module=account&action=tokentx&address=${formatAddress(address)}&sort=desc&apikey=${config.etherscan.apiKey}`;
      
      if (contractAddress) {
        url += `&contractaddress=${formatAddress(contractAddress)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result.map(tx => ({
          hash: tx.hash,
          from: formatAddress(tx.from),
          to: formatAddress(tx.to),
          contractAddress: formatAddress(tx.contractAddress),
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          tokenDecimal: parseInt(tx.tokenDecimal),
          value: formatCurrency(tx.value, parseInt(tx.tokenDecimal)),
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNumber)
        }));
      } else {
        throw new Error(`Etherscan API error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      throw error;
    }
  },

  async getGasPrice() {
    try {
      const response = await fetch(
        `${config.etherscan.baseUrl}?module=gastracker&action=gasoracle&apikey=${config.etherscan.apiKey}`
      );
      const data = await response.json();
      
      if (data.status === '1') {
        return {
          safeLow: parseInt(data.result.SafeLow),
          standard: parseInt(data.result.ProposeGasPrice),
          fast: parseInt(data.result.FastGasPrice),
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(`Etherscan API error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching gas price:', error);
      throw error;
    }
  }
};

// Dune Analytics API calls
export const duneAPI = {
  async executeQuery(queryId, parameters = {}) {
    try {
      const response = await fetch(`${config.dune.baseUrl}/query/${queryId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Dune-API-Key': config.dune.apiKey
        },
        body: JSON.stringify({ parameters })
      });

      if (!response.ok) {
        throw new Error(`Dune API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error executing Dune query:', error);
      throw error;
    }
  },

  async getQueryResults(executionId) {
    try {
      const response = await fetch(`${config.dune.baseUrl}/execution/${executionId}/results`, {
        headers: {
          'X-Dune-API-Key': config.dune.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Dune API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Dune query results:', error);
      throw error;
    }
  }
};

// ENS API calls
export const ensAPI = {
  async getDomainInfo(domain) {
    try {
      const response = await fetch(`${config.ens.baseUrl}/v1/domains/${domain}`);
      
      if (!response.ok) {
        throw new Error(`ENS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ENS domain info:', error);
      throw error;
    }
  },

  async getReverseRecord(address) {
    try {
      const response = await fetch(`${config.ens.baseUrl}/v1/reverse/${formatAddress(address)}`);
      
      if (!response.ok) {
        throw new Error(`ENS API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching ENS reverse record:', error);
      throw error;
    }
  }
};

// Combined data fetching functions
export const dataService = {
  async getENSDAOTreasuryData() {
    try {
      const { walletDirectory } = await import('../data/walletDirectory');
      const treasuryAddresses = walletDirectory
        .filter(w => w.category !== 'contract')
        .map(w => w.address);
      const useAlchemy = !!(import.meta.env && import.meta.env.VITE_ALCHEMY_API_KEY && import.meta.env.VITE_ALCHEMY_API_KEY !== 'demo');
      let balances;
      if (useAlchemy) {
        const { default: alchemyAPI } = await import('./alchemyAPI');
        const ethBalances = await alchemyAPI.getETHBalances(treasuryAddresses);
        balances = ethBalances.map(({ address, balanceEth }) => ({
          address: address.toLowerCase(),
          balance: String(balanceEth || 0),
          timestamp: new Date().toISOString()
        }));
      } else {
        const balancePromises = treasuryAddresses.map(address => 
          etherscanAPI.getAccountBalance(address)
        );
        balances = await Promise.all(balancePromises);
      }
      
      return {
        timestamp: new Date().toISOString(),
        wallets: balances,
        totalBalance: balances.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0)
      };
    } catch (error) {
      console.error('Error fetching ENS DAO treasury data:', error);
      throw error;
    }
  },

  async getENSDAOTransactions(limit = 100) {
    try {
      const { walletDirectory } = await import('../data/walletDirectory');
      const treasuryAddresses = walletDirectory
        .filter(w => w.category !== 'contract')
        .map(w => w.address);

      const transactionPromises = treasuryAddresses.map(address =>
        etherscanAPI.getTransactionHistory(address, 0, 99999999)
      );

      const allTransactions = await Promise.all(transactionPromises);
      
      // Flatten and sort by timestamp
      const flattenedTransactions = allTransactions
        .flat()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      return {
        timestamp: new Date().toISOString(),
        transactions: flattenedTransactions,
        count: flattenedTransactions.length
      };
    } catch (error) {
      console.error('Error fetching ENS DAO transactions:', error);
      throw error;
    }
  },

  async getENSDAOTokenHoldings() {
    try {
      const { walletDirectory } = await import('../data/walletDirectory');
      const treasuryAddresses = walletDirectory
        .filter(w => w.category !== 'contract')
        .map(w => w.address);

      const tokenPromises = treasuryAddresses.map(address =>
        etherscanAPI.getTokenTransfers(address)
      );

      const allTokenTransfers = await Promise.all(tokenPromises);
      
      // Process token holdings
      const tokenHoldings = {};
      
      allTokenTransfers.flat().forEach(transfer => {
        const tokenKey = transfer.contractAddress;
        
        if (!tokenHoldings[tokenKey]) {
          tokenHoldings[tokenKey] = {
            contractAddress: transfer.contractAddress,
            tokenName: transfer.tokenName,
            tokenSymbol: transfer.tokenSymbol,
            tokenDecimal: transfer.tokenDecimal,
            totalValue: 0,
            transfers: []
          };
        }
        
        tokenHoldings[tokenKey].transfers.push(transfer);
      });

      return {
        timestamp: new Date().toISOString(),
        holdings: Object.values(tokenHoldings)
      };
    } catch (error) {
      console.error('Error fetching ENS DAO token holdings:', error);
      throw error;
    }
  }
};

// Error handling utilities
export const handleAPIError = (error, context = 'API call') => {
  console.error(`${context} failed:`, error);
  
  if (error.message.includes('rate limit')) {
    throw new Error('API rate limit exceeded. Please try again later.');
  } else if (error.message.includes('unauthorized')) {
    throw new Error('API key is invalid or expired.');
  } else if (error.message.includes('network')) {
    throw new Error('Network error. Please check your connection.');
  } else {
    throw new Error(`API error: ${error.message}`);
  }
};

// Cache utilities
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheService = {
  get(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  },

  set(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  clear() {
    cache.clear();
  },

  clearExpired() {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }
  }
};

export default {
  etherscanAPI,
  duneAPI,
  ensAPI,
  dataService,
  handleAPIError,
  cacheService
}; 