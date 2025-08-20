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
        <div className="px-4 py-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="border-r border-slate-200 pr-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                TOTAL AUM
              </div>
              <div className="text-2xl font-light text-slate-900">$926.8M</div>
              <div className="text-xs text-emerald-600">+2.5% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                LIQUID ASSETS
              </div>
              <div className="text-2xl font-light text-slate-900">$840.2M</div>
              <div className="text-xs text-emerald-600">+1.8% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                MONTHLY OUTFLOW
              </div>
              <div className="text-2xl font-light text-slate-900">$642K</div>
              <div className="text-xs text-slate-600">+12.3% vs Prior</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CUSTODY ACCOUNTS
              </div>
              <div className="text-2xl font-light text-slate-900">12</div>
              <div className="text-xs text-slate-600">No Change</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
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
      <div className="px-4 py-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

const OverviewContent = () => {
  return (
    <div className="space-y-4">
      {/* Portfolio Allocation & Activity */}
      <div className="grid grid-cols-3 gap-2">
        {/* Portfolio Composition */}
        <div className="col-span-2">
          <div className="bg-white border-b border-slate-200 pb-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Portfolio Composition
              </h3>
              <span className="text-xs text-slate-500">As of {new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                  <div>Asset</div>
                  <div className="text-right">Qty</div>
                  <div className="text-right">Mkt Val</div>
                  <div className="text-right">Alloc</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="font-medium text-slate-900 text-sm">Ethereum (ETH)</span>
                  </div>
                  <div className="text-right text-slate-900 text-sm">234,567.00</div>
                  <div className="text-right font-medium text-slate-900 text-sm">$567,800,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium text-sm">61.3%</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                    <span className="font-medium text-slate-900 text-sm">USD Coin (USDC)</span>
                  </div>
                  <div className="text-right text-slate-900 text-sm">180,200,000.00</div>
                  <div className="text-right font-medium text-slate-900 text-sm">$180,200,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium text-sm">19.5%</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-violet-600 rounded-full"></div>
                    <span className="font-medium text-slate-900 text-sm">Ethereum Name Service (ENS)</span>
                  </div>
                  <div className="text-right text-slate-900 text-sm">12,500,000.00</div>
                  <div className="text-right font-medium text-slate-900 text-sm">$178,600,000</div>
                  <div className="text-right">
                    <span className="text-slate-900 font-medium text-sm">19.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border-b border-slate-200 pb-2">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">
            Recent Activity
          </h3>
          <div>
            <div className="space-y-2">
              <div className="pb-2 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Grant Disbursement - ENS Labs (2h ago)</span>
                  <span className="text-sm font-medium text-slate-900">$125,000</span>
                </div>
              </div>

              <div className="pb-2 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Delegation Reward - Community Pool (5h ago)</span>
                  <span className="text-sm font-medium text-slate-900">$45,000</span>
                </div>
              </div>

              <div className="pb-2 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Infrastructure Payment - Cloudflare Inc. (1d ago)</span>
                  <span className="text-sm font-medium text-slate-900">$32,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Operational Expense - Legal & Compliance (2d ago)</span>
                  <span className="text-sm font-medium text-slate-900">$18,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Groups Financial Analysis */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
            Working Groups Financial Analysis
          </h3>
          <span className="text-xs text-slate-500">Q1 2025 Performance</span>
        </div>
        <WorkingGroupsSpending />
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-4 gap-3 py-2">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Txn Vol</div>
          <div className="text-xl font-light text-slate-900">1,247 (+156 today)</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active WGs</div>
          <div className="text-xl font-light text-slate-900">3 (Operational)</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gov Tokens</div>
          <div className="text-xl font-light text-slate-900">25,215 (Q1 2025)</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sys Uptime</div>
          <div className="text-xl font-light text-slate-900">99.97% (Operational)</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
