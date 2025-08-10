const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'demo';
const TREASURY_ADDRESS = '0x4f2083f5fbede34c2714affb3105539775f7fe64';

// Common token addresses and metadata
const KNOWN_TOKENS = {
  '0xa0b86a33e6441b8c4c8c0b8c4c8c0b8c4c8c0b8c': { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT', name: 'Tether', decimals: 6 },
  '0x6b175474e89094c44da98b954eedeac495271d0f': { symbol: 'DAI', name: 'Dai', decimals: 18 },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { symbol: 'WETH', name: 'Wrapped Ethereum', decimals: 18 },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': { symbol: 'ENS', name: 'Ethereum Name Service', decimals: 18 },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { symbol: 'UNI', name: 'Uniswap', decimals: 18 },
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32': { symbol: 'LDO', name: 'Lido DAO', decimals: 18 },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8 },
  '0x514910771af9ca656af840dff83e8264ecf986ca': { symbol: 'LINK', name: 'Chainlink', decimals: 18 },
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': { symbol: 'MATIC', name: 'Polygon', decimals: 18 }
};

// Price API endpoints
const PRICE_APIS = {
  coingecko: 'https://api.coingecko.com/api/v3',
  coinmarketcap: 'https://pro-api.coinmarketcap.com/v1'
};

class TreasuryAPI {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get ETH balance
  async getETHBalance(address) {
    const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        return parseFloat(data.result) / 1e18; // Convert from wei to ETH
      }
      throw new Error(data.message || 'Failed to fetch ETH balance');
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return 0;
    }
  }

  // Get token balances
  async getTokenBalances(address) {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        const tokenBalances = new Map();
        
        data.result.forEach(tx => {
          const tokenAddress = tx.contractAddress.toLowerCase();
          const tokenInfo = KNOWN_TOKENS[tokenAddress];
          
          if (tokenInfo) {
            const balance = parseFloat(tx.value) / Math.pow(10, tokenInfo.decimals);
            
            if (tokenBalances.has(tokenAddress)) {
              tokenBalances.set(tokenAddress, tokenBalances.get(tokenAddress) + balance);
            } else {
              tokenBalances.set(tokenAddress, balance);
            }
          }
        });
        
        return Array.from(tokenBalances.entries()).map(([address, balance]) => ({
          contractAddress: address,
          balance: balance.toString(),
          ...KNOWN_TOKENS[address]
        }));
      }
      throw new Error(data.message || 'Failed to fetch token balances');
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  // Get token prices
  async getTokenPrices(symbols) {
    // Map common symbols to Coingecko IDs
    const symbolToCoingeckoId = {
      eth: 'ethereum',
      weth: 'weth',
      usdc: 'usd-coin',
      usdt: 'tether',
      dai: 'dai',
      ens: 'ethereum-name-service',
      uni: 'uniswap',
      ldo: 'lido-dao',
      wbtc: 'wrapped-bitcoin',
      link: 'chainlink',
      matic: 'matic-network'
    };

    const ids = Array.from(new Set(
      (symbols || [])
        .map((s) => (s || '').toString().toLowerCase())
        .map((s) => symbolToCoingeckoId[s])
        .filter(Boolean)
    ));

    if (!ids.length) {
      return {};
    }

    const url = `${PRICE_APIS.coingecko}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error fetching token prices:', error);
      return {};
    }
  }

  // Get comprehensive treasury data
  async getTreasuryData() {
    const cacheKey = `treasury_${TREASURY_ADDRESS}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Fetch ETH balance
      const ethBalance = await this.getETHBalance(TREASURY_ADDRESS);
      
      // Fetch token balances
      const tokenBalances = await this.getTokenBalances(TREASURY_ADDRESS);
      
      // Prepare assets array
      const assets = [];
      
      // Add ETH if balance > 0
      if (ethBalance > 0) {
        assets.push({
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance.toString(),
          value: 0, // Will be calculated with price
          price: 0, // Will be fetched
          change24h: 0, // Will be fetched
          contractAddress: null,
          decimals: 18
        });
      }
      
      // Add token balances
      assets.push(...tokenBalances);
      
      // Get prices for all assets (symbol mapping handled in getTokenPrices)
      const symbols = assets.map(asset => (asset.symbol || '').toLowerCase());
      const prices = await this.getTokenPrices(symbols);
      
      // Calculate values and add price data
      const assetsWithPrices = assets.map(asset => {
         // Map price lookup by symbol using the same mapping as above
         const symbolToCoingeckoId = {
           eth: 'ethereum',
           weth: 'weth',
           usdc: 'usd-coin',
           usdt: 'tether',
           dai: 'dai',
           ens: 'ethereum-name-service',
           uni: 'uniswap',
           ldo: 'lido-dao',
           wbtc: 'wrapped-bitcoin',
           link: 'chainlink',
           matic: 'matic-network'
         };
         const priceData = prices[symbolToCoingeckoId[(asset.symbol || '').toLowerCase()]];
        const price = priceData?.usd || 0;
        const change24h = priceData?.usd_24h_change || 0;
        const value = parseFloat(asset.balance) * price;
        
        return {
          ...asset,
          price,
          change24h,
          value
        };
      });
      
      const totalValue = assetsWithPrices.reduce((sum, asset) => sum + asset.value, 0);
      
      const result = {
        address: TREASURY_ADDRESS,
        totalValue,
        assets: assetsWithPrices,
        lastUpdated: new Date().toISOString()
      };
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching treasury data:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(address, startBlock = 0, endBlock = 'latest') {
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result.slice(0, 50); // Return last 50 transactions
      }
      throw new Error(data.message || 'Failed to fetch transaction history');
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }

  // Get token transfers
  async getTokenTransfers(address) {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result.slice(0, 50); // Return last 50 transfers
      }
      throw new Error(data.message || 'Failed to fetch token transfers');
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      return [];
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache status
  getCacheStatus() {
    const now = Date.now();
    const status = {};
    
    for (const [key, value] of this.cache.entries()) {
      const age = now - value.timestamp;
      const isExpired = age > this.cacheTimeout;
      
      status[key] = {
        age: Math.round(age / 1000), // seconds
        isExpired,
        dataSize: JSON.stringify(value.data).length
      };
    }
    
    return status;
  }
}

export default new TreasuryAPI(); 