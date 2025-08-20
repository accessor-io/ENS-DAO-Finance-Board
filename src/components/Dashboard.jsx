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
    { id: 'overview', name: 'Portfolio Overview' },
    { id: 'assets', name: 'Asset Management' },
    { id: 'analytics', name: 'Risk Analytics' },
    { id: 'transactions', name: 'Transaction History' },
    { id: 'wallets', name: 'Wallet Administration' },
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
    <div className="min-h-screen bg-slate-50">
      {/* Executive Summary Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="grid grid-cols-4 gap-8">
            <div className="border-r border-slate-200 pr-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                TOTAL AUM
              </div>
              <div className="text-3xl font-light text-slate-900">$926.8M</div>
              <div className="text-xs text-emerald-600 font-medium">+2.5% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                LIQUID ASSETS
              </div>
              <div className="text-3xl font-light text-slate-900">$840.2M</div>
              <div className="text-xs text-emerald-600 font-medium">+1.8% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                MONTHLY OUTFLOW
              </div>
              <div className="text-3xl font-light text-slate-900">$642K</div>
              <div className="text-xs text-slate-600 font-medium">+12.3% vs Prior</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CUSTODY ACCOUNTS
              </div>
              <div className="text-3xl font-light text-slate-900">12</div>
              <div className="text-xs text-slate-600 font-medium">No Change</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="px-8">
          <nav className="flex space-x-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewContent = () => {
  return (
    <div className="space-y-8">
      {/* Portfolio Allocation & Activity */}
      <div className="grid grid-cols-3 gap-8">
        {/* Portfolio Composition */}
        <div className="col-span-2">
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                  Portfolio Composition
                </h3>
                <span className="text-xs text-slate-500">As of {new Date().toLocaleDateString()}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3">
                  <div>Asset</div>
                  <div className="text-right">Holdings</div>
                  <div className="text-right">Market Value</div>
                  <div className="text-right">Allocation</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center py-3 border-b border-slate-50">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium text-slate-900">Ethereum</div>
                      <div className="text-xs text-slate-500">ETH</div>
                    </div>
                  </div>
                  <div className="text-right text-slate-900">234,567.00</div>
                  <div className="text-right font-medium text-slate-900">$567,800,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium">61.3%</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center py-3 border-b border-slate-50">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium text-slate-900">USD Coin</div>
                      <div className="text-xs text-slate-500">USDC</div>
                    </div>
                  </div>
                  <div className="text-right text-slate-900">180,200,000.00</div>
                  <div className="text-right font-medium text-slate-900">$180,200,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium">19.5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center py-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-violet-600 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium text-slate-900">Ethereum Name Service</div>
                      <div className="text-xs text-slate-500">ENS</div>
                    </div>
                  </div>
                  <div className="text-right text-slate-900">12,500,000.00</div>
                  <div className="text-right font-medium text-slate-900">$178,600,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium">19.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-slate-200 rounded-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Recent Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-slate-900">Grant Disbursement</div>
                  <div className="text-sm font-medium text-slate-900">$125,000</div>
                </div>
                <div className="text-xs text-slate-500">ENS Labs • 2h ago</div>
              </div>

              <div className="pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-slate-900">Delegation Reward</div>
                  <div className="text-sm font-medium text-slate-900">$45,000</div>
                </div>
                <div className="text-xs text-slate-500">Community Pool • 5h ago</div>
              </div>

              <div className="pb-4 border-b border-slate-50">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-slate-900">Infrastructure Payment</div>
                  <div className="text-sm font-medium text-slate-900">$32,000</div>
                </div>
                <div className="text-xs text-slate-500">Cloudflare Inc. • 1d ago</div>
              </div>

              <div>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-slate-900">Operational Expense</div>
                  <div className="text-sm font-medium text-slate-900">$18,500</div>
                </div>
                <div className="text-xs text-slate-500">Legal & Compliance • 2d ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Groups Financial Analysis */}
      <div className="bg-white border border-slate-200 rounded-sm">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              Working Groups Financial Analysis
            </h3>
            <span className="text-xs text-slate-500">Q1 2025 Performance</span>
          </div>
        </div>
        <div className="p-6">
          <WorkingGroupsSpending />
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Transaction Volume
          </div>
          <div className="text-2xl font-light text-slate-900 mb-1">1,247</div>
          <div className="text-xs text-emerald-600 font-medium">+156 today</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Active Working Groups
          </div>
          <div className="text-2xl font-light text-slate-900 mb-1">3</div>
          <div className="text-xs text-slate-600 font-medium">Operational</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Governance Tokens Issued
          </div>
          <div className="text-2xl font-light text-slate-900 mb-1">25,215</div>
          <div className="text-xs text-slate-600 font-medium">Q1 2025</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            System Availability
          </div>
          <div className="text-2xl font-light text-slate-900 mb-1">99.97%</div>
          <div className="text-xs text-emerald-600 font-medium">All systems operational</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
