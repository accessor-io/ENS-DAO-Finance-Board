import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';

const KarpatkeyReports = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Mock data based on Karpatkey reports structure
  const mockReportsData = {
    treasuryVariation: {
      totalValue: 79427080.29,
      monthlyChange: 2345678.90,
      monthlyChangePercent: 3.05,
      assets: [
        {
          symbol: 'ETH',
          value: 4407836.25,
          percentage: 5.55,
          change: 234567.89,
          changePercent: 5.62
        },
        {
          symbol: 'USDC',
          value: 8500000,
          percentage: 10.70,
          change: 500000,
          changePercent: 6.25
        },
        {
          symbol: 'USDT',
          value: 3200000,
          percentage: 4.03,
          change: -150000,
          changePercent: -4.48
        },
        {
          symbol: 'DAI',
          value: 1800000,
          percentage: 2.27,
          change: 75000,
          changePercent: 4.35
        },
        {
          symbol: 'WETH',
          value: 2996752.78,
          percentage: 3.77,
          change: 187500,
          changePercent: 6.68
        },
        {
          symbol: 'ENS',
          value: 1875000,
          percentage: 2.36,
          change: -93750,
          changePercent: -4.76
        },
        {
          symbol: 'WBTC',
          value: 1530000,
          percentage: 1.93,
          change: 76500,
          changePercent: 5.26
        },
        {
          symbol: 'LINK',
          value: 750000,
          percentage: 0.94,
          change: -37500,
          changePercent: -4.76
        }
      ]
    },
    performanceMetrics: {
      totalReturn: 12.45,
      sharpeRatio: 1.23,
      maxDrawdown: -8.76,
      volatility: 15.67,
      beta: 0.89
    },
    riskMetrics: {
      var95: 2.34,
      var99: 3.45,
      expectedShortfall: 4.12,
      correlationMatrix: {
        ETH: { ETH: 1.0, USDC: 0.02, USDT: 0.01, DAI: 0.03 },
        USDC: { ETH: 0.02, USDC: 1.0, USDT: 0.95, DAI: 0.98 },
        USDT: { ETH: 0.01, USDC: 0.95, USDT: 1.0, DAI: 0.96 },
        DAI: { ETH: 0.03, USDC: 0.98, USDT: 0.96, DAI: 1.0 }
      }
    },
    allocationBreakdown: {
      byAsset: {
        'Stablecoins': 16.97,
        'Ethereum': 9.32,
        'DeFi Tokens': 8.45,
        'Other': 5.26
      },
      byProtocol: {
        'Compound': 12.34,
        'Aave': 8.76,
        'Uniswap V3': 6.54,
        'Curve': 4.32,
        'Other': 8.04
      }
    }
  };

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call to Karpatkey reports
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setReportsData(mockReportsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Karpatkey reports:', err);
        setError('Failed to fetch Karpatkey reports data');
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [selectedMonth, selectedYear]);

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Karpatkey Treasury Reports</h2>
            <p className="text-gray-600">ENS DAO Treasury Performance & Risk Analysis</p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value={1}>January</option>
              <option value={2}>February</option>
              <option value={3}>March</option>
              <option value={4}>April</option>
              <option value={5}>May</option>
              <option value={6}>June</option>
              <option value={7}>July</option>
              <option value={8}>August</option>
              <option value={9}>September</option>
              <option value={10}>October</option>
              <option value={11}>November</option>
              <option value={12}>December</option>
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-medium mb-1">Total Treasury Value</h3>
            <p className="text-2xl font-bold">{formatCurrency(reportsData.treasuryVariation.totalValue)}</p>
            <p className="text-blue-100 text-sm">
              {getChangeIcon(reportsData.treasuryVariation.monthlyChangePercent)} 
              {reportsData.treasuryVariation.monthlyChangePercent > 0 ? '+' : ''}{reportsData.treasuryVariation.monthlyChangePercent}% this month
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-medium mb-1">Total Return</h3>
            <p className="text-2xl font-bold">{reportsData.performanceMetrics.totalReturn}%</p>
            <p className="text-green-100 text-sm">Annualized performance</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-medium mb-1">Sharpe Ratio</h3>
            <p className="text-2xl font-bold">{reportsData.performanceMetrics.sharpeRatio}</p>
            <p className="text-purple-100 text-sm">Risk-adjusted returns</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
            <h3 className="text-sm font-medium mb-1">Max Drawdown</h3>
            <p className="text-2xl font-bold">{reportsData.performanceMetrics.maxDrawdown}%</p>
            <p className="text-orange-100 text-sm">Peak to trough decline</p>
          </div>
        </div>
      </div>

      {/* Treasury Variation Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Treasury Variation by Asset</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Treasury
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.treasuryVariation.assets.map((asset, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {asset.symbol.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(asset.value)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{asset.percentage}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getChangeColor(asset.change)}`}>
                      {getChangeIcon(asset.change)} {formatCurrency(asset.change)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getChangeColor(asset.changePercent)}`}>
                      {getChangeIcon(asset.changePercent)} {asset.changePercent > 0 ? '+' : ''}{asset.changePercent}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance & Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Return (Annualized)</span>
              <span className="text-sm font-medium text-green-600">{reportsData.performanceMetrics.totalReturn}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sharpe Ratio</span>
              <span className="text-sm font-medium text-blue-600">{reportsData.performanceMetrics.sharpeRatio}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Volatility</span>
              <span className="text-sm font-medium text-orange-600">{reportsData.performanceMetrics.volatility}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Beta</span>
              <span className="text-sm font-medium text-purple-600">{reportsData.performanceMetrics.beta}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Max Drawdown</span>
              <span className="text-sm font-medium text-red-600">{reportsData.performanceMetrics.maxDrawdown}%</span>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">VaR (95%)</span>
              <span className="text-sm font-medium text-red-600">{reportsData.riskMetrics.var95}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">VaR (99%)</span>
              <span className="text-sm font-medium text-red-600">{reportsData.riskMetrics.var99}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Shortfall</span>
              <span className="text-sm font-medium text-red-600">{reportsData.riskMetrics.expectedShortfall}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <div className="space-y-3">
            {Object.entries(reportsData.allocationBreakdown.byAsset).map(([asset, percentage]) => (
              <div key={asset} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{asset}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Allocation */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Allocation</h3>
          <div className="space-y-3">
            {Object.entries(reportsData.allocationBreakdown.byProtocol).map(([protocol, percentage]) => (
              <div key={protocol} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{protocol}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href={`https://reports.kpk.io/ens?month=${selectedMonth}&year=${selectedYear}&currency=USD#treasury-variation`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            📊 View Full Report
          </a>
          <a 
            href="https://karpatkey.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            🏦 Karpatkey Website
          </a>
          <a 
            href="https://reports.kpk.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            📈 All Reports
          </a>
        </div>
      </div>
    </div>
  );
};

export default KarpatkeyReports; 