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
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'assets', name: 'Assets', icon: '💎' },
    { id: 'blockchain', name: 'Analytics', icon: '⛓️' },
    { id: 'transactions', name: 'Transactions', icon: '💸' },
    { id: 'wallets', name: 'Wallets', icon: '👛' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'assets':
        return <AssetTracker />;
      case 'blockchain':
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 mb-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">ENS DAO Treasury</h1>
              <p className="text-blue-200 text-lg">Real-time financial dashboard & analytics</p>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">Total Value</div>
              <div className="text-3xl font-bold text-white">$926.8M</div>
              <div className="text-green-300 text-sm">↗ +2.5% this month</div>
            </div>
          </div>
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Available Balance"
              value="$840.2M"
              change="+1.8%"
              changeType="positive"
              icon="💰"
            />
            <MetricCard
              title="Monthly Spending"
              value="$642K"
              change="+12.3%"
              changeType="neutral"
              icon="📈"
            />
            <MetricCard
              title="Active Wallets"
              value="12"
              change="No change"
              changeType="neutral"
              icon="🏦"
            />
            <MetricCard
              title="Transactions"
              value="1,247"
              change="+156 today"
              changeType="positive"
              icon="⚡"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-1 mb-6">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, changeType, icon }) => {
  const changeColor = {
    positive: 'text-green-300',
    negative: 'text-red-300',
    neutral: 'text-yellow-300'
  }[changeType];

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`text-sm ${changeColor}`}>{change}</div>
      </div>
      <div className="text-white/80 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

const OverviewContent = () => {
  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Treasury Composition</h3>
          <div className="space-y-3">
            <AssetRow asset="ETH" amount="234,567 ETH" value="$567.8M" percentage="61.3%" color="bg-blue-500" />
            <AssetRow asset="USDC" amount="180.2M USDC" value="$180.2M" percentage="19.5%" color="bg-green-500" />
            <AssetRow asset="ENS" amount="12.5M ENS" value="$178.6M" percentage="19.2%" color="bg-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem 
              type="Grant Payment"
              amount="$125K"
              recipient="ENS Labs"
              time="2 hours ago"
              color="bg-blue-500"
            />
            <ActivityItem 
              type="Delegation Reward"
              amount="$45K"
              recipient="Community Pool"
              time="5 hours ago"
              color="bg-green-500"
            />
            <ActivityItem 
              type="Infrastructure"
              amount="$32K"
              recipient="Cloudflare"
              time="1 day ago"
              color="bg-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Working Groups Section */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-white/10">
        <WorkingGroupsSpending />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard icon="📊" title="Generate Report" subtitle="Export analytics" />
        <QuickActionCard icon="🔄" title="Sync Wallets" subtitle="Update balances" />
        <QuickActionCard icon="⚙️" title="Settings" subtitle="Configure alerts" />
        <QuickActionCard icon="📋" title="Proposals" subtitle="View governance" />
      </div>
    </div>
  );
};

const AssetRow = ({ asset, amount, value, percentage, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <div>
        <div className="text-white font-medium">{asset}</div>
        <div className="text-white/60 text-sm">{amount}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-medium">{value}</div>
      <div className="text-white/60 text-sm">{percentage}</div>
    </div>
  </div>
);

const ActivityItem = ({ type, amount, recipient, time, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-8 rounded-full ${color}`}></div>
      <div>
        <div className="text-white font-medium">{type}</div>
        <div className="text-white/60 text-sm">{recipient}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-medium">{amount}</div>
      <div className="text-white/60 text-sm">{time}</div>
    </div>
  </div>
);

const QuickActionCard = ({ icon, title, subtitle }) => (
  <button className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all duration-200 hover:scale-105 text-left">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-white font-medium">{title}</div>
    <div className="text-white/60 text-sm">{subtitle}</div>
  </button>
);

export default Dashboard;
