import { useState, useEffect, useCallback } from 'react';
import { dataService, cacheService, handleAPIError } from '../services/api';
import { walletDirectory } from '../data/walletDirectory';
import alchemyAPI from '../services/alchemyAPI';

export const useENSData = () => {
  const [data, setData] = useState({
    treasury: null,
    transactions: null,
    tokenHoldings: null,
    gasPrice: null
  });
  
  const [loading, setLoading] = useState({
    treasury: false,
    transactions: false,
    tokenHoldings: false,
    gasPrice: false
  });
  
  const [error, setError] = useState({
    treasury: null,
    transactions: null,
    tokenHoldings: null,
    gasPrice: null
  });

  const [lastUpdated, setLastUpdated] = useState(null);

  // New: recent transfers across wallet addresses
  const [recentTransfers, setRecentTransfers] = useState({ list: [], loading: false, error: null });

  // Centralized ENS DAO wallets
  const ensDaoWallets = (walletDirectory?.length ? walletDirectory : []).map(w => w.address) ?? [
    '0xFe89cc7aBB2C4183683ab71625C4fCB7B02D44b7',
    '0x4F2083f5fBede34C2714aFfb3105539775f7FE64',
    '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
  ];

  // Fetch treasury data
  const fetchTreasuryData = useCallback(async () => {
    const cacheKey = 'ens-treasury-data';
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      setData(prev => ({ ...prev, treasury: cached }));
      return;
    }

    setLoading(prev => ({ ...prev, treasury: true }));
    setError(prev => ({ ...prev, treasury: null }));

    try {
      const treasuryData = await dataService.getENSDAOTreasuryData();
      cacheService.set(cacheKey, treasuryData);
      setData(prev => ({ ...prev, treasury: treasuryData }));
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Treasury data fetch');
      setError(prev => ({ ...prev, treasury: errorMessage.message }));
    } finally {
      setLoading(prev => ({ ...prev, treasury: false }));
    }
  }, []);

  // Fetch recent transfers for all wallets
  const fetchRecentTransfers = useCallback(async (limitPerAddress = 25) => {
    setRecentTransfers((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const transfers = await alchemyAPI.getRecentTransactionsForAddresses(ensDaoWallets, limitPerAddress);
      setRecentTransfers({ list: transfers, loading: false, error: null });
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setRecentTransfers({ list: [], loading: false, error: err?.message || 'Failed to fetch transfers' });
    }
  }, []);

  // Fetch transaction data
  const fetchTransactionData = useCallback(async (limit = 50) => {
    const cacheKey = `ens-transactions-${limit}`;
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      setData(prev => ({ ...prev, transactions: cached }));
      return;
    }

    setLoading(prev => ({ ...prev, transactions: true }));
    setError(prev => ({ ...prev, transactions: null }));

    try {
      const transactionData = await dataService.getENSDAOTransactions(limit);
      cacheService.set(cacheKey, transactionData);
      setData(prev => ({ ...prev, transactions: transactionData }));
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Transaction data fetch');
      setError(prev => ({ ...prev, transactions: errorMessage.message }));
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  }, []);

  // Fetch token holdings data
  const fetchTokenHoldingsData = useCallback(async () => {
    const cacheKey = 'ens-token-holdings';
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      setData(prev => ({ ...prev, tokenHoldings: cached }));
      return;
    }

    setLoading(prev => ({ ...prev, tokenHoldings: true }));
    setError(prev => ({ ...prev, tokenHoldings: null }));

    try {
      const tokenHoldingsData = await dataService.getENSDAOTokenHoldings();
      cacheService.set(cacheKey, tokenHoldingsData);
      setData(prev => ({ ...prev, tokenHoldings: tokenHoldingsData }));
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Token holdings data fetch');
      setError(prev => ({ ...prev, tokenHoldings: errorMessage.message }));
    } finally {
      setLoading(prev => ({ ...prev, tokenHoldings: false }));
    }
  }, []);

  // Fetch gas price data
  const fetchGasPriceData = useCallback(async () => {
    const cacheKey = 'ens-gas-price';
    const cached = cacheService.get(cacheKey);
    
    if (cached) {
      setData(prev => ({ ...prev, gasPrice: cached }));
      return;
    }

    setLoading(prev => ({ ...prev, gasPrice: true }));
    setError(prev => ({ ...prev, gasPrice: null }));

    try {
      const { etherscanAPI } = await import('../services/api');
      const gasPriceData = await etherscanAPI.getGasPrice();
      cacheService.set(cacheKey, gasPriceData);
      setData(prev => ({ ...prev, gasPrice: gasPriceData }));
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      const errorMessage = handleAPIError(err, 'Gas price data fetch');
      setError(prev => ({ ...prev, gasPrice: errorMessage.message }));
    } finally {
      setLoading(prev => ({ ...prev, gasPrice: false }));
    }
  }, []);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    cacheService.clear();
    await Promise.all([
      fetchTreasuryData(),
      fetchTransactionData(),
      fetchTokenHoldingsData(),
      fetchGasPriceData(),
      fetchRecentTransfers(),
    ]);
  }, [fetchTreasuryData, fetchTransactionData, fetchTokenHoldingsData, fetchGasPriceData, fetchRecentTransfers]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [refreshAllData]);

  // Initial data fetch
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Calculate derived metrics
  const derivedMetrics = {
    totalTreasuryValue: data.treasury?.totalBalance || 0,
    totalTransactions: data.transactions?.count || 0,
    uniqueTokens: data.tokenHoldings?.holdings?.length || 0,
    averageGasPrice: data.gasPrice ? 
      (data.gasPrice.safeLow + data.gasPrice.standard + data.gasPrice.fast) / 3 : 0
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  // Format gas price helper
  const formatGasPrice = (gwei) => {
    return `${gwei} Gwei`;
  };

  return {
    data,
    loading,
    error,
    lastUpdated,
    derivedMetrics,
    formatCurrency,
    formatGasPrice,
    refreshAllData,
    fetchTreasuryData,
    fetchTransactionData,
    fetchTokenHoldingsData,
    fetchGasPriceData,
    recentTransfers,
    fetchRecentTransfers,
  };
};

export default useENSData; 