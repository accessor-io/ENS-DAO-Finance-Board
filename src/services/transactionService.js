// Real transaction service for fetching actual blockchain data
const TREASURY_ADDRESS = '0x4f2083f5fbede34c2714affb3105539775f7fe64';
const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || 'demo';

export const transactionService = {
  async fetchRealTransactions() {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${TREASURY_ADDRESS}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNumber),
          confirmations: parseInt(tx.confirmations),
          isError: tx.isError === '1'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  async fetchTokenTransfers() {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&address=${TREASURY_ADDRESS}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1' && data.result) {
        return data.result.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          contractAddress: tx.contractAddress,
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          tokenDecimal: parseInt(tx.tokenDecimal),
          value: tx.value,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          blockNumber: parseInt(tx.blockNumber)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      return [];
    }
  },

  async fetchTokenBalance(contractAddress) {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${TREASURY_ADDRESS}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result;
      }
      
      return '0';
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
  },

  async fetchETHBalance() {
    try {
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${TREASURY_ADDRESS}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.status === '1') {
        return data.result;
      }
      
      return '0';
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
      return '0';
    }
  }
}; 