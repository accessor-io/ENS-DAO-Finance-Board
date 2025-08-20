import React, { useMemo, useState } from 'react';
import useENSData from '../hooks/useENSData';

const TransactionsTable = () => {
  const [filter, setFilter] = useState('all');
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'expenditure': 'marble-red text-red-300 border border-red-700',
      'revenue': 'marble-green text-green-300 border border-green-700',
      'transfer': 'marble-blue text-blue-300 border border-blue-700',
      'endaoment-disbursement': 'marble-purple text-purple-300 border border-purple-700',
      'eth-to-usdc-swap': 'marble-yellow text-yellow-300 border border-yellow-700',
      'other': 'bg-gray-800 text-gray-300 border border-gray-700'
    };
    return colors[category] || colors['other'];
  };

  const categories = ['all', 'erc20', 'erc721', 'erc1155', 'external', 'internal'];
  const [walletFilter, setWalletFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('selectedWalletFilter') || 'all';
    }
    return 'all';
  });

  const { recentTransfers } = useENSData();

  const txs = recentTransfers?.list || [];
  const wallets = useMemo(() => {
    const set = new Set(txs.map((t) => t.address).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [txs]);

  const filteredTransactions = useMemo(() => {
    let out = txs;
    if (filter !== 'all') out = out.filter((tx) => tx.category === filter);
    if (walletFilter !== 'all') out = out.filter((tx) => tx.address === walletFilter);
    return out;
  }, [txs, filter, walletFilter]);

  return (
    <div className="glass border border-gray-700 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-700 bg-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-medium text-white uppercase tracking-wide">Transaction History</h3>
            <p className="text-sm text-gray-300 mt-2">Recent on-chain transfers across ENS DAO wallets</p>
          </div>
          <div className="flex items-end gap-4">
            <label htmlFor="category-filter" className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-600 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            >
               {categories.map((category) => (
                <option key={category} value={category}>
                   {category === 'all' ? 'All Categories' : category.toUpperCase()}
                </option>
              ))}
            </select>
            <div>
              <label htmlFor="wallet-filter" className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wide">
                Wallet
              </label>
              <select
                id="wallet-filter"
                value={walletFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setWalletFilter(v);
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem('selectedWalletFilter', v);
                  }
                }}
                className="border border-gray-600 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              >
                {wallets.map((w) => (
                  <option key={w} value={w}>
                    {w === 'all' ? 'All Wallets' : formatAddress(w)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-[56px] z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                From → To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Wallet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filteredTransactions.map((transaction, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-950 hover:bg-gray-800'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white font-mono">
                      {formatAddress(transaction.hash)}
                    </div>
                    <div className="text-xs text-gray-400">{transaction.asset}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">{formatAddress(transaction.from)}</span>
                    <span>→</span>
                    <span className="font-mono">{formatAddress(transaction.to)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-white">
                    {transaction.value ? `${transaction.value.toFixed(6)} ${transaction.asset}` : '-'}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">{transaction.direction}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {transaction.address ? formatAddress(transaction.address) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-0.5 text-[11px] font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {transaction.timestamp ? formatDate(transaction.timestamp) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            Showing {filteredTransactions.length} of {txs.length} transfers
          </span>
          <span className="text-gray-400">Updated live</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;