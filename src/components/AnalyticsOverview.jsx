import React, { useState } from 'react';
import { ensFinancialData, monthlyExpenditures, assetAllocation, karpatkeyPerformance } from '../data/ensData';
import AreaChart from './charts/AreaChart';
import RadarChart from './charts/RadarChart';
import TreeMap from './charts/TreeMap';

const AnalyticsOverview = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Calculate key metrics
  const totalAssets = ensFinancialData.ensDaoOverview.totalAssets;
  const totalExpenditures = ensFinancialData.ensDaoOverview.totalExpenditures;
  const netBalance = ensFinancialData.ensDaoOverview.netBalance;
  
  // Calculate expenditure trends
  const recentExpenditures = monthlyExpenditures.slice(-6);
  const avgMonthlyExpenditure = recentExpenditures.reduce((sum, exp) => sum + exp.amount, 0) / recentExpenditures.length;
  
  // Calculate asset performance
  const ethValue = assetAllocation.find(asset => asset.name === 'ETH')?.value || 0;
  const ensValue = assetAllocation.find(asset => asset.name === 'ENS')?.value || 0;
  const usdcValue = assetAllocation.find(asset => asset.name === 'USDC')?.value || 0;

  // Karpatkey performance metrics
  const karpatkeyROI = ensFinancialData.karpatkeyFinance.performance.roi;
  const managedAssets = ensFinancialData.karpatkeyFinance.managedAssets;

  // Prepare data for charts
  const expenditureTrendData = monthlyExpenditures.map(item => ({
    name: item.month,
    amount: item.amount / 1000000, // Convert to millions for better visualization
    category: item.category
  }));

  const assetPerformanceData = [
    { name: 'ETH', value: ethValue / 1000000, percentage: (ethValue / totalAssets) * 100 },
    { name: 'ENS', value: ensValue / 1000000, percentage: (ensValue / totalAssets) * 100 },
    { name: 'USDC', value: usdcValue / 1000000, percentage: (usdcValue / totalAssets) * 100 },
    { name: 'Other', value: (totalAssets - ethValue - ensValue - usdcValue) / 1000000, percentage: ((totalAssets - ethValue - ensValue - usdcValue) / totalAssets) * 100 }
  ];

  const riskMetricsData = [
    { name: 'Liquidity Ratio', value: 85, fullMark: 100 },
    { name: 'Diversification', value: 72, fullMark: 100 },
    { name: 'Volatility', value: 35, fullMark: 100 },
    { name: 'Yield Generation', value: 68, fullMark: 100 },
    { name: 'Risk Management', value: 90, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+2.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Net Balance</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(netBalance)}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+1.8% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">🏦</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Karpatkey ROI</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(karpatkeyROI)}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+0.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">📊</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Monthly Spend</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgMonthlyExpenditure)}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">-5.2% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenditure Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expenditure Trends</h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="6m">Last 6 months</option>
              <option value="12m">Last 12 months</option>
              <option value="24m">Last 24 months</option>
            </select>
          </div>
          <AreaChart data={expenditureTrendData} />
        </div>

        {/* Risk Metrics Radar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk & Performance Metrics</h3>
          <RadarChart data={riskMetricsData} />
        </div>
      </div>

      {/* Asset Allocation TreeMap */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation Breakdown</h3>
        <TreeMap data={assetPerformanceData} />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Treasury Health Score */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Treasury Health Score</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Liquidity</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Diversification</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">72%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Yield Generation</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">68%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Risk Management</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">90%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">Strong Liquidity Position</p>
                <p className="text-xs text-green-600">85% of assets are liquid</p>
              </div>
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800">Diversified Portfolio</p>
                <p className="text-xs text-blue-600">Multiple asset classes</p>
              </div>
              <span className="text-blue-600">✓</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-yellow-800">Moderate Yield</p>
                <p className="text-xs text-yellow-600">5.83% ROI on managed assets</p>
              </div>
              <span className="text-yellow-600">⚠</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-red-800">High Expenditure Rate</p>
                <p className="text-xs text-red-600">9.3% of total assets spent</p>
              </div>
              <span className="text-red-600">!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-2">Increase Yield Generation</h4>
            <p className="text-sm text-blue-700">
              Consider allocating more assets to yield-generating strategies through Karpatkey Finance.
            </p>
          </div>
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-900 mb-2">Maintain Liquidity</h4>
            <p className="text-sm text-green-700">
              Current liquidity position is strong. Continue monitoring to ensure operational needs are met.
            </p>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
            <h4 className="font-medium text-purple-900 mb-2">Diversify Further</h4>
            <p className="text-sm text-purple-700">
              Consider adding more stablecoins and other low-volatility assets to reduce portfolio risk.
            </p>
          </div>
          <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <h4 className="font-medium text-yellow-900 mb-2">Monitor Expenditures</h4>
            <p className="text-sm text-yellow-700">
              Review expenditure patterns to ensure sustainable spending levels relative to asset base.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview; 