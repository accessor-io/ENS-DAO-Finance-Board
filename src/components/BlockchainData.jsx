import React, { useState, useEffect } from 'react';
import alchemyAPI from '../services/alchemyAPI';

const BlockchainData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      const comprehensiveData = await alchemyAPI.getENSDAOComprehensiveData();
      setData(comprehensiveData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching blockchain data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value, decimals = 18) => {
    const numValue = parseInt(value, 16) / Math.pow(10, decimals);
    return numValue.toFixed(4);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'tokens', label: 'Token Holdings' },
    { id: 'contracts', label: 'Contract Interactions' },
    { id: 'gas', label: 'Gas Analytics' }
  ];

  if (loading) {
    return (
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-white">Loading blockchain data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-red-700 bg-red-900">
        <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
        <p className="text-red-200">{error}</p>
        <button 
          onClick={fetchBlockchainData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <p className="text-white">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ENS DAO Blockchain Data</h2>
            <p className="text-gray-300">Real-time data from Ethereum mainnet</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Address:</p>
            <p className="text-blue-400 font-mono text-sm">{formatAddress(data.address)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">ETH Balance</h3>
            <p className="text-3xl font-bold">{data.balance.balanceFormatted}</p>
            <p className="text-blue-100 text-sm">Current Balance</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Transactions</h3>
            <p className="text-3xl font-bold">{data.summary.totalTransactions}</p>
            <p className="text-green-100 text-sm">Total Transactions</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Token Holdings</h3>
            <p className="text-3xl font-bold">{data.summary.totalTokens}</p>
            <p className="text-purple-100 text-sm">Different Tokens</p>
          </div>
          

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Address:</span>
                  <span className="text-white font-mono text-sm">{formatAddress(data.address)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ETH Balance:</span>
                  <span className="text-green-400 font-semibold">{data.balance.balanceFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Last Updated:</span>
                  <span className="text-blue-400">{new Date(data.summary.lastUpdated).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Transactions:</span>
                  <span className="text-white font-semibold">{data.summary.totalTransactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Token Holdings:</span>
                  <span className="text-purple-400 font-semibold">{data.summary.totalTokens}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Contract Interactions:</span>
                  <span className="text-yellow-400 font-semibold">{data.summary.totalContractInteractions}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="glass rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Gas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Category</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {data.transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-blue-400 font-mono">
                        {formatAddress(tx.hash)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">
                        {formatAddress(tx.from)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">
                        {formatAddress(tx.to)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-400">
                        {tx.value ? formatValue(tx.value) : '0'} ETH
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {tx.gas ? parseInt(tx.gas, 16).toLocaleString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.category === 'external' ? 'bg-blue-600' :
                        tx.category === 'internal' ? 'bg-green-600' :
                        tx.category === 'erc20' ? 'bg-purple-600' :
                        'bg-gray-600'
                      } text-white`}>
                        {tx.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Token Holdings Tab */}
      {activeTab === 'tokens' && (
        <div className="glass rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Token</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contract</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Symbol</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                {data.tokenHoldings.map((token, index) => (
                  <tr key={index} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{token.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-mono">
                        {formatAddress(token.contractAddress)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-400">
                        {token.tokenBalance ? formatValue(token.tokenBalance, token.decimals) : '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white">
                        {token.symbol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}



      {/* Gas Analytics Tab */}
      {activeTab === 'gas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Gas Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Gas Used:</span>
                <span className="text-white font-semibold">{data.gasStats.totalGas.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Transaction Count:</span>
                <span className="text-blue-400 font-semibold">{data.gasStats.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Average Gas:</span>
                <span className="text-green-400 font-semibold">{Math.round(data.gasStats.averageGas).toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Data Source</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Alchemy API v2</p>
              <p>• Ethereum Mainnet</p>
              <p>• Real-time blockchain data</p>
              <p>• ENS DAO Address: {formatAddress(data.address)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button 
          onClick={fetchBlockchainData}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default BlockchainData; 