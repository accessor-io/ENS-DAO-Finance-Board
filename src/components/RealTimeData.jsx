import React, { useEffect, useState } from 'react';
import useENSData from '../hooks/useENSData';

const RealTimeData = () => {
  const {
    data,
    loading,
    error,
    lastUpdated,
    derivedMetrics,
    formatCurrency,
    formatGasPrice,
    refreshAllData,
    getLiveTreasuryValuation
  } = useENSData();

  const [liveValuation, setLiveValuation] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const v = await getLiveTreasuryValuation();
      if (mounted) setLiveValuation(v);
    })();
    return () => { mounted = false; };
  }, [getLiveTreasuryValuation]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (Object.values(loading).some(Boolean)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading real-time data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Data</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(lastUpdated)}
            </p>
          )}
        </div>
        <button
          onClick={refreshAllData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Refresh Data
        </button>
      </div>

      {/* Error Display */}
      {Object.values(error).some(Boolean) && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Data Loading Errors</h3>
              <div className="mt-2 text-sm text-red-700">
                {Object.entries(error).map(([key, errorMsg]) => 
                  errorMsg && (
                    <div key={key} className="mt-1">
                      <strong>{key}:</strong> {errorMsg}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Treasury Overview */}
      {data.treasury && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treasury Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Total Treasury Value</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency((liveValuation ?? derivedMetrics.totalTreasuryValue))}
              </p>
              {liveValuation !== null && (
                <p className="text-xs text-blue-700 mt-1">Live valuation via on-chain + price feed</p>
              )}
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Active Wallets</p>
              <p className="text-2xl font-bold text-green-900">
                {data.treasury.wallets?.length || 0}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Last Updated</p>
              <p className="text-lg font-semibold text-purple-900">
                {formatDate(data.treasury.timestamp)}
              </p>
            </div>
          </div>

          {/* Wallet Details */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Wallet Balances</h4>
            <div className="space-y-3">
              {data.treasury.wallets?.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatAddress(wallet.address)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: {formatCurrency(wallet.balance)} ETH
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(wallet.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {data.transactions && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions (All Wallets)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.transactions.transactions?.map((tx, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {formatAddress(tx.hash)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(tx.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatAddress(tx.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {parseFloat(tx.value).toFixed(4)} ETH
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.gas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {tx.isError ? 'Failed' : 'Success'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Token Holdings */}
      {data.tokenHoldings && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Holdings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.tokenHoldings.holdings?.map((holding, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {holding.tokenSymbol || 'Unknown Token'}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {holding.transfers.length} transfers
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {holding.tokenName || 'Unknown Token Name'}
                </p>
                <p className="text-xs text-gray-500">
                  Contract: {formatAddress(holding.contractAddress)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gas Price Information */}
      {data.gasPrice && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Gas Prices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Safe Low</p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatGasPrice(data.gasPrice.safeLow)}
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Standard</p>
              <p className="text-2xl font-bold text-orange-900">
                {formatGasPrice(data.gasPrice.standard)}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">Fast</p>
              <p className="text-2xl font-bold text-red-900">
                {formatGasPrice(data.gasPrice.fast)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {formatDate(data.gasPrice.timestamp)}
          </p>
        </div>
      )}

      {/* Network Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{derivedMetrics.totalTransactions}</p>
            <p className="text-sm text-gray-500">Total Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{derivedMetrics.uniqueTokens}</p>
            <p className="text-sm text-gray-500">Unique Tokens</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatGasPrice(derivedMetrics.averageGasPrice)}
            </p>
            <p className="text-sm text-gray-500">Average Gas Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {data.treasury?.wallets?.length || 0}
            </p>
            <p className="text-sm text-gray-500">Active Wallets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeData; 