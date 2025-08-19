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
      'working-group': 'marble-indigo text-indigo-300 border border-indigo-700',
      'contract': 'marble-gray text-gray-300 border border-gray-700',
      'governance': 'marble-red text-red-300 border border-red-700',
      'service-provider': 'marble-yellow text-yellow-300 border border-yellow-700',
      'other': 'bg-gray-800 text-gray-300 border border-gray-700'
    };
    return colors[type] || colors['other'];
  };

  const [walletData, setWalletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedWallet, setExpandedWallet] = useState(null);
  const [transactionData, setTransactionData] = useState({});

  const sourceWallets = useMemo(() => walletDirectory.length ? walletDirectory : ensFinancialData.wallets, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        console.log('WalletsTable: Starting to fetch wallet data...');
        const data = await alchemyAPI.getAllWalletData();
        console.log('WalletsTable: Received wallet data:', data);
        if (mounted) {
          setWalletData(data);
          setLastUpdated(new Date());
          console.log('WalletsTable: Updated state with wallet data');
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const getWalletData = (address) => {
    const data = walletData.find(w => w.address.toLowerCase() === address.toLowerCase()) || {};
    console.log('getWalletData for', address, ':', data);
    return data;
  };

  const getTokenCount = (address) => {
    const data = getWalletData(address);
    return data.tokenBalances ? data.tokenBalances.length : 0;
  };

  const getTransactionCount = (address) => {
    const data = getWalletData(address);
    return data.recentTransactions ? data.recentTransactions.length : 0;
  };

  const handleRowClick = async (address) => {
    if (expandedWallet === address) {
      setExpandedWallet(null);
    } else {
      setExpandedWallet(address);
      if (!transactionData[address]) {
        try {
          const transactions = await alchemyAPI.getRecentTransactions(address, 20);
          setTransactionData(prev => ({
            ...prev,
            [address]: transactions
          }));
        } catch (error) {
          console.error('Error fetching transactions for', address, error);
        }
      }
    }
  };

  const formatTransaction = (tx) => {
    const value = tx.value ? parseFloat(tx.value) / Math.pow(10, 18) : 0;
    const date = tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleDateString() : 'Unknown';
    const time = tx.timestamp ? new Date(tx.timestamp * 1000).toLocaleTimeString() : 'Unknown';
    
    // Determine coin type based on transaction category
    let coinType = 'ETH';
    if (tx.category === 'erc20') {
      coinType = tx.tokenSymbol || 'ERC20';
    } else if (tx.category === 'erc721') {
      coinType = 'NFT';
    } else if (tx.category === 'erc1155') {
      coinType = 'ERC1155';
    }
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: value.toFixed(6),
      valueUSD: tx.valueUSD || null,
      date,
      time,
      type: tx.category || 'external',
      coinType,
      tokenName: tx.tokenName || null,
      tokenSymbol: tx.tokenSymbol || null
    };
  };

  const getTokenIcon = (symbol) => {
    const icons = {
      'ETH': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#627EEA"/>
          <path d="M16.498 4v8.87l7.497 3.35z" fill="#fff" fillOpacity="0.602"/>
          <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#fff"/>
          <path d="M16.498 21.968v6.027L24 17.616z" fill="#fff" fillOpacity="0.602"/>
          <path d="M16.498 27.995v-6.028L9 17.616z" fill="#fff"/>
          <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#fff" fillOpacity="0.2"/>
          <path d="M9 16.22l7.498 4.353v-7.701z" fill="#fff" fillOpacity="0.602"/>
        </svg>
      ),
      'WETH': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#627EEA"/>
          <path d="M16.498 4v8.87l7.497 3.35z" fill="#fff" fillOpacity="0.602"/>
          <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#fff"/>
          <path d="M16.498 21.968v6.027L24 17.616z" fill="#fff" fillOpacity="0.602"/>
          <path d="M16.498 27.995v-6.028L9 17.616z" fill="#fff"/>
          <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#fff" fillOpacity="0.2"/>
          <path d="M9 16.22l7.498 4.353v-7.701z" fill="#fff" fillOpacity="0.602"/>
        </svg>
      ),
      'USDC': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#2775CA"/>
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22C10.486 26 6 21.514 6 16S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10z" fill="#fff"/>
          <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#2775CA"/>
        </svg>
      ),
      'USDT': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#26A17B"/>
          <path d="M17.922 17.383h-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042h-.003c-.3-.018-.526-.03-.526-.472 0-.442.226-.454.526-.472.254-.018 1.003-.042 1.971-.042 1.265 0 1.832.03 1.942.042h.002c.3.018.526.03.526.472 0 .442-.226.454-.526.472zm-1.942-1.5c-1.01 0-1.721-.03-1.971-.042h-.003c-.3-.018-.526-.03-.526-.472 0-.442.226-.454.526-.472.254-.018 1.003-.042 1.971-.042 1.265 0 1.832.03 1.942.042h.002c.3.018.526.03.526.472 0 .442-.226.454-.526.472zm-1.942-1.5c-1.01 0-1.721-.03-1.971-.042h-.003c-.3-.018-.526-.03-.526-.472 0-.442.226-.454.526-.472.254-.018 1.003-.042 1.971-.042 1.265 0 1.832.03 1.942.042h.002c.3.018.526.03.526.472 0 .442-.226.454-.526.472z" fill="#fff"/>
        </svg>
      ),
      'DAI': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#F5AC37"/>
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22C10.486 26 6 21.514 6 16S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10z" fill="#fff"/>
          <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#F5AC37"/>
        </svg>
      ),
      'ENS': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#5E4FDB"/>
          <path d="M8 8h16v16H8z" fill="#fff"/>
          <path d="M12 12h8v8h-8z" fill="#5E4FDB"/>
          <path d="M14 14h4v4h-4z" fill="#fff"/>
        </svg>
      ),
      'NFT': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#FF6B6B"/>
          <path d="M8 8h16v16H8z" fill="#fff"/>
          <path d="M12 12h8v8h-8z" fill="#FF6B6B"/>
        </svg>
      ),
      'ERC20': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#6C757D"/>
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22C10.486 26 6 21.514 6 16S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10z" fill="#fff"/>
          <path d="M16 8c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="#6C757D"/>
        </svg>
      ),
      'ERC721': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#9C27B0"/>
          <path d="M8 8h16v16H8z" fill="#fff"/>
          <path d="M12 12h8v8h-8z" fill="#9C27B0"/>
        </svg>
      ),
      'ERC1155': (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0z" fill="#FF9800"/>
          <path d="M8 8h16v16H8z" fill="#fff"/>
          <path d="M12 12h8v8h-8z" fill="#FF9800"/>
        </svg>
      )
    };
    return icons[symbol] || icons['ERC20'];
  };

  const getMockTokenHoldings = (address) => {
    // Generate consistent token holdings based on address
    const hash = address.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const tokens = [
      { symbol: 'ETH', name: 'Ethereum', amount: (Math.abs(hash % 1000) / 100).toFixed(4), valueUSD: (Math.abs(hash % 1000) * 1.85).toFixed(2) },
      { symbol: 'USDC', name: 'USD Coin', amount: (Math.abs(hash % 50000)).toFixed(2), valueUSD: (Math.abs(hash % 50000)).toFixed(2) },
      { symbol: 'ENS', name: 'Ethereum Name Service', amount: (Math.abs(hash % 10000)).toFixed(2), valueUSD: (Math.abs(hash % 10000) * 0.17).toFixed(2) },
      { symbol: 'WETH', name: 'Wrapped Ether', amount: (Math.abs(hash % 50) / 10).toFixed(4), valueUSD: (Math.abs(hash % 50) * 18.5).toFixed(2) },
      { symbol: 'DAI', name: 'Dai Stablecoin', amount: (Math.abs(hash % 20000)).toFixed(2), valueUSD: (Math.abs(hash % 20000)).toFixed(2) }
    ];
    
    return tokens.slice(0, Math.abs(hash % 4) + 1); // Return 1-4 tokens based on address
  };

  return (
    <div className="glass rounded-lg shadow-sm border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">ENS DAO Wallets</h3>
        <p className="text-sm text-gray-300 mt-1">
          Comprehensive overview of all ENS DAO wallets, multisigs, and contracts 
          {loading && ' (refreshing...)'}
          {lastUpdated && ` • Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </p>
      </div>
      
                     <div className="overflow-x-auto">
                 <table className="w-full">
                             <thead className="bg-gray-800 border-b border-gray-700">
                     <tr>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/4">
                         Address / ENS Name
                       </th>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">
                         Type
                       </th>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">
                         ETH Balance
                       </th>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">
                         Tokens
                       </th>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">
                         Recent TX
                       </th>
                       <th className="px-16 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-1/6">
                         Manager
                       </th>
                     </tr>
                   </thead>
          <tbody className="bg-gray-900">
            {sourceWallets.map((wallet, index) => (
              <React.Fragment key={index}>
                <tr 
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleRowClick(wallet.address)}
                >
                                     <td className="px-16 py-5 whitespace-nowrap">
                     <div className="flex items-center">
                       <div className="flex-1">
                         <div className="text-sm font-semibold text-white font-mono">
                           {formatAddress(wallet.address)}
                         </div>
                         {(wallet.ensName || wallet.label) && (
                           <div className="text-sm text-blue-400 mt-1">{wallet.ensName || wallet.label}</div>
                         )}
                       </div>
                       <div className="ml-2">
                         <svg 
                           className={`w-4 h-4 text-gray-400 transition-transform ${expandedWallet === wallet.address ? 'rotate-180' : ''}`}
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                         </svg>
                       </div>
                     </div>
                   </td>
                   <td className="px-16 py-5 whitespace-nowrap">
                     <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${getTypeColor(wallet.type || wallet.category || 'other')}`}>
                       {(wallet.type || wallet.category || 'other').replace('-', ' ')}
                     </span>
                   </td>
                   <td className="px-16 py-5 whitespace-nowrap text-sm text-white font-mono">
                     {(getWalletData(wallet.address).ethBalance ?? 0).toFixed(4)} ETH
                   </td>
                   <td className="px-16 py-5 whitespace-nowrap text-sm text-white font-semibold">
                     {getTokenCount(wallet.address)} tokens
                   </td>
                   <td className="px-16 py-5 whitespace-nowrap text-sm text-white font-mono">
                     {getTransactionCount(wallet.address)} tx
                   </td>
                   <td className="px-16 py-5 whitespace-nowrap">
                     <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-sm ${
                       (wallet.manager || '').toLowerCase() === 'karpatkey' ? 'marble-orange text-orange-300 border border-orange-700' : 'marble-blue text-blue-300 border border-blue-700'
                     }`}>
                       {wallet.manager || 'ens-dao'}
                     </span>
                   </td>
                </tr>
                
                {/* Expanded Transaction Section */}
                {expandedWallet === wallet.address && (
                                     <tr className="bg-gray-800 border-b border-gray-700">
                     <td colSpan="6" className="px-16 py-6">
                      <div className="space-y-6">
                        {/* Token Holdings Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white">Token Holdings</h4>
                            <span className="text-sm text-gray-400">
                              {getMockTokenHoldings(wallet.address).length} tokens
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getMockTokenHoldings(wallet.address).map((token, index) => (
                              <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">{getTokenIcon(token.symbol)}</div>
                                    <div>
                                      <div className="text-white font-semibold">{token.symbol}</div>
                                      <div className="text-gray-400 text-sm">{token.name}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-white font-mono">{token.amount}</div>
                                    <div className="text-gray-400 text-sm">${token.valueUSD}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                                                {/* Transactions Section */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white">Last 20 Transactions</h4>
                            <span className="text-sm text-gray-400">
                              {transactionData[wallet.address]?.length || 0} transactions
                            </span>
                          </div>
                         
                          {transactionData[wallet.address] && transactionData[wallet.address].length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-600">
                                    <th className="text-left py-2 text-gray-300">Hash</th>
                                    <th className="text-left py-2 text-gray-300">From</th>
                                    <th className="text-left py-2 text-gray-300">To</th>
                                    <th className="text-left py-2 text-gray-300">Value</th>
                                    <th className="text-left py-2 text-gray-300">Coin</th>
                                    <th className="text-left py-2 text-gray-300">Date/Time</th>
                                    <th className="text-left py-2 text-gray-300">Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactionData[wallet.address].slice(0, 20).map((tx, txIndex) => {
                                    const formattedTx = formatTransaction(tx);
                                    return (
                                      <tr key={txIndex} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="py-2 text-blue-400 font-mono text-xs">
                                          {formattedTx.hash ? `${formattedTx.hash.slice(0, 8)}...${formattedTx.hash.slice(-6)}` : 'N/A'}
                                        </td>
                                        <td className="py-2 text-gray-300 font-mono text-xs">
                                          {formattedTx.from ? formatAddress(formattedTx.from) : 'N/A'}
                                        </td>
                                        <td className="py-2 text-gray-300 font-mono text-xs">
                                          {formattedTx.to ? formatAddress(formattedTx.to) : 'N/A'}
                                        </td>
                                        <td className="py-2 text-white font-mono">
                                          <div>
                                            <div>{formattedTx.value}</div>
                                            {formattedTx.valueUSD && (
                                              <div className="text-xs text-gray-400">${formattedTx.valueUSD}</div>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-2">
                                          <div className="flex items-center space-x-2">
                                            <div className="flex-shrink-0">{getTokenIcon(formattedTx.coinType)}</div>
                                            <div className="flex flex-col">
                                              <span className="text-white font-semibold">{formattedTx.coinType}</span>
                                              {formattedTx.tokenName && (
                                                <span className="text-xs text-gray-400">{formattedTx.tokenName}</span>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="py-2 text-gray-300 text-xs">
                                          <div>
                                            <div>{formattedTx.date}</div>
                                            <div>{formattedTx.time}</div>
                                          </div>
                                        </td>
                                        <td className="py-2">
                                          <span className={`inline-flex px-2 py-1 text-xs rounded ${
                                            formattedTx.type === 'erc20' ? 'bg-green-900 text-green-300' :
                                            formattedTx.type === 'erc721' ? 'bg-purple-900 text-purple-300' :
                                            formattedTx.type === 'erc1155' ? 'bg-yellow-900 text-yellow-300' :
                                            'bg-blue-900 text-blue-300'
                                          }`}>
                                            {formattedTx.type}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-gray-400 text-sm">
                                {transactionData[wallet.address] === undefined ? (
                                  <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                    Loading transactions...
                                  </div>
                                ) : (
                                  'No recent transactions found'
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
                     <div className="px-12 py-4 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Wallets: {sourceWallets.length}</span>
          <span className="text-white font-semibold">
            Total ETH: {sourceWallets.reduce((total, wallet) => total + (getWalletData(wallet.address).ethBalance ?? 0), 0).toFixed(4)} ETH
          </span>
        </div>
      </div>
    </div>
  );
};

export default WalletsTable;