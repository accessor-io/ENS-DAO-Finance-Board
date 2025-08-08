import React, { useEffect, useMemo, useState } from 'react';
import alchemyAPI from '../services/alchemyAPI';
import { ensFinancialData } from '../data/ensData';
import { walletDirectory } from '../data/walletDirectory';

const WalletsTable = () => {
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

  const getTypeColor = (type) => {
    const colors = {
      'dao-treasury': 'marble-blue text-blue-300 border border-blue-700',
      'endaoment': 'marble-green text-green-300 border border-green-700',
      'controller': 'marble-purple text-purple-300 border border-purple-700',
      'karpatkey-managed': 'marble-orange text-orange-300 border border-orange-700',
      'other': 'bg-gray-800 text-gray-300 border border-gray-700'
    };
    return colors[type] || colors['other'];
  };

  const [liveBalances, setLiveBalances] = useState([]);
  const [loading, setLoading] = useState(false);

  const sourceWallets = useMemo(() => walletDirectory.length ? walletDirectory : ensFinancialData.wallets, []);
  const walletAddresses = useMemo(() => sourceWallets.map(w => w.address), [sourceWallets]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const balances = await alchemyAPI.getETHBalances(walletAddresses);
        if (mounted) setLiveBalances(balances);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [walletAddresses]);

  const getLiveEth = (address) => {
    const entry = liveBalances.find(b => b.address.toLowerCase() === address.toLowerCase());
    return entry ? entry.balanceEth : null;
  };

  return (
    <div className="glass rounded-lg shadow-sm border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">ENS DAO Wallets</h3>
        <p className="text-sm text-gray-300 mt-1">Overview of all associated wallets and their balances {loading && '(refreshing...)'}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Address / ENS Name
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                ETH Balance
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                USD Value
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                ENS Tokens
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Manager
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900">
            {sourceWallets.map((wallet, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-150">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-white font-mono">
                      {formatAddress(wallet.address)}
                    </div>
                    {(wallet.ensName || wallet.label) && (
                      <div className="text-sm text-blue-400 mt-1">{wallet.ensName || wallet.label}</div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${getTypeColor(wallet.type || wallet.category || 'other')}`}>
                    {(wallet.type || wallet.category || 'other').replace('-', ' ')}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-white font-mono">
                  {(getLiveEth(wallet.address) ?? wallet.balance?.eth ?? 0).toLocaleString()} ETH
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-white font-semibold">
                  {formatCurrency(wallet.balance?.usd ?? 0)}
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-white font-mono">
                  {(wallet.balance?.ens ?? 0).toLocaleString()} ENS
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                    (wallet.manager || '').toLowerCase() === 'karpatkey' ? 'marble-orange text-orange-300 border border-orange-700' : 'marble-blue text-blue-300 border border-blue-700'
                  }`}>
                    {wallet.manager || 'ens-dao'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-8 py-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Wallets: {sourceWallets.length}</span>
          <span className="text-white font-semibold">
            Combined USD Value: {formatCurrency(sourceWallets.reduce((total, wallet) => total + (wallet.balance?.usd ?? 0), 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletsTable;