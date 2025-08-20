import React, { useState } from 'react';
import AnalyticsOverview from './AnalyticsOverview';
import AssetTracker from './AssetTracker';
import BlockchainData from './BlockchainData';
import TransactionsTable from './TransactionsTable';
import WalletsTable from './WalletsTable';
import WorkingGroupsSpending from './WorkingGroupsSpending';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'assets', name: 'Assets' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'wallets', name: 'Wallets' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'assets':
        return <AssetTracker />;
      case 'analytics':
        return <BlockchainData />;
      case 'transactions':
        return <TransactionsTable />;
      case 'wallets':
        return <WalletsTable />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$926.8M</div>
              <div className="text-sm text-gray-600">Total Treasury Value</div>
              <div className="text-xs text-green-600">+2.5% this month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$840.2M</div>
              <div className="text-sm text-gray-600">Available Balance</div>
              <div className="text-xs text-green-600">+1.8%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$642K</div>
              <div className="text-sm text-gray-600">Monthly Spending</div>
              <div className="text-xs text-gray-600">+12.3%</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Active Wallets</div>
              <div className="text-xs text-gray-600">No change</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewContent = () => {
  return (
    <div className="space-y-6">
      {/* Treasury Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Treasury Composition</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">ETH</div>
                    <div className="text-sm text-gray-500">234,567 ETH</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$567.8M</div>
                  <div className="text-sm text-gray-500">61.3%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">USDC</div>
                    <div className="text-sm text-gray-500">180.2M USDC</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$180.2M</div>
                  <div className="text-sm text-gray-500">19.5%</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">ENS</div>
                    <div className="text-sm text-gray-500">12.5M ENS</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$178.6M</div>
                  <div className="text-sm text-gray-500">19.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Grant Payment</div>
                  <div className="text-sm text-gray-500">ENS Labs</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$125K</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Delegation Reward</div>
                  <div className="text-sm text-gray-500">Community Pool</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$45K</div>
                  <div className="text-sm text-gray-500">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Infrastructure</div>
                  <div className="text-sm text-gray-500">Cloudflare</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">$32K</div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Groups */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Working Groups Spending</h3>
        </div>
        <div className="p-6">
          <WorkingGroupsSpending />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-lg font-semibold text-gray-900">1,247</div>
          <div className="text-sm text-gray-500">Total Transactions</div>
          <div className="text-xs text-green-600">+156 today</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-lg font-semibold text-gray-900">3</div>
          <div className="text-sm text-gray-500">Working Groups</div>
          <div className="text-xs text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-lg font-semibold text-gray-900">25,215</div>
          <div className="text-sm text-gray-500">ENS Distributed</div>
          <div className="text-xs text-gray-600">Q1 2025</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center">
          <div className="text-lg font-semibold text-gray-900">98.7%</div>
          <div className="text-sm text-gray-500">System Uptime</div>
          <div className="text-xs text-green-600">All systems operational</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
