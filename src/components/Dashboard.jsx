import React, { useState } from 'react';
import AnalyticsOverview from './AnalyticsOverview';
import AssetTracker from './AssetTracker';
import BlockchainData from './BlockchainData';
import TransactionsTable from './TransactionsTable';
import WalletsTable from './WalletsTable';
import WorkingGroupsSpending from './WorkingGroupsSpending';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

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
        return <OverviewContent expandedSections={expandedSections} toggleSection={toggleSection} />;
      case 'assets':
        return <AssetTracker />;
      case 'analytics':
        return <BlockchainData />;
      case 'transactions':
        return <TransactionsTable />;
      case 'wallets':
        return <WalletsTable />;
      default:
        return <OverviewContent expandedSections={expandedSections} toggleSection={toggleSection} />;
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
              <div className="text-lg font-light text-slate-900">$926.8M</div>
              <div className="text-xs text-emerald-600">+2.5% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                LIQUID ASSETS
              </div>
              <div className="text-lg font-light text-slate-900">$840.2M</div>
              <div className="text-xs text-emerald-600">+1.8% MTD</div>
            </div>
            <div className="border-r border-slate-200 pr-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                MONTHLY OUTFLOW
              </div>
              <div className="text-lg font-light text-slate-900">$642K</div>
              <div className="text-xs text-slate-600">+12.3% vs Prior</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                CUSTODY ACCOUNTS
              </div>
              <div className="text-lg font-light text-slate-900">12</div>
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

const CollapsibleSection = ({ id, title, subtitle, children, isExpanded, onToggle, defaultExpanded = false }) => {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => onToggle(id)}
        className="w-full px-4 py-3 text-left hover:bg-slate-25 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">{title}</h3>
            {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
          </div>
          <div className="text-slate-400">
            {isExpanded ? '−' : '+'}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
};

const OverviewContent = ({ expandedSections, toggleSection }) => {
  return (
    <div className="space-y-0">
      {/* Treasury Composition */}
      <CollapsibleSection
        id="treasury-composition"
        title="Treasury Composition"
        subtitle="Asset allocation and holdings breakdown"
        isExpanded={expandedSections['treasury-composition']}
        onToggle={toggleSection}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
            <div>Asset</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Mkt Val</div>
            <div className="text-right">Alloc</div>
          </div>
          
          <CollapsibleSection
            id="ethereum-details"
            title="Ethereum (ETH)"
            subtitle="61.3% • $567.8M"
            isExpanded={expandedSections['ethereum-details']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Liquid ETH</div>
                <div className="text-right">180,000.00</div>
                <div className="text-right">$435.6M</div>
                <div className="text-right">46.9%</div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Staked ETH</div>
                <div className="text-right">54,567.00</div>
                <div className="text-right">$132.2M</div>
                <div className="text-right">14.4%</div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="usdc-details"
            title="USD Coin (USDC)"
            subtitle="19.5% • $180.2M"
            isExpanded={expandedSections['usdc-details']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Operating Reserve</div>
                <div className="text-right">120,000,000</div>
                <div className="text-right">$120.0M</div>
                <div className="text-right">12.9%</div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Emergency Fund</div>
                <div className="text-right">60,200,000</div>
                <div className="text-right">$60.2M</div>
                <div className="text-right">6.6%</div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="ens-details"
            title="Ethereum Name Service (ENS)"
            subtitle="19.2% • $178.6M"
            isExpanded={expandedSections['ens-details']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Treasury Holdings</div>
                <div className="text-right">10,000,000</div>
                <div className="text-right">$142.9M</div>
                <div className="text-right">15.4%</div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div>Governance Reserve</div>
                <div className="text-right">2,500,000</div>
                <div className="text-right">$35.7M</div>
                <div className="text-right">3.8%</div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Transaction Activity */}
      <CollapsibleSection
        id="transaction-activity"
        title="Transaction Activity"
        subtitle="Recent treasury movements and operations"
        isExpanded={expandedSections['transaction-activity']}
        onToggle={toggleSection}
      >
        <div className="space-y-0">
          <CollapsibleSection
            id="grants-disbursements"
            title="Grant Disbursements"
            subtitle="4 transactions • $267K total"
            isExpanded={expandedSections['grants-disbursements']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>ENS Labs Development Grant</span>
                <span>$125,000 • 2h ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Community Initiatives Fund</span>
                <span>$85,000 • 1d ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Developer Tools Funding</span>
                <span>$57,000 • 3d ago</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="operational-expenses"
            title="Operational Expenses"
            subtitle="6 transactions • $128K total"
            isExpanded={expandedSections['operational-expenses']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Infrastructure - Cloudflare Inc.</span>
                <span>$32,000 • 1d ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Legal & Compliance Services</span>
                <span>$18,500 • 2d ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Audit & Security Review</span>
                <span>$45,000 • 5d ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Marketing & Communications</span>
                <span>$32,500 • 1w ago</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="delegation-rewards"
            title="Delegation Rewards"
            subtitle="12 transactions • $156K total"
            isExpanded={expandedSections['delegation-rewards']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Community Pool Distribution</span>
                <span>$45,000 • 5h ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Validator Rewards</span>
                <span>$35,500 • 12h ago</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Staking Incentives</span>
                <span>$28,750 • 1d ago</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Working Groups Analysis */}
      <CollapsibleSection
        id="working-groups"
        title="Working Groups Financial Analysis"
        subtitle="Q1 2025 expenditure breakdown and performance"
        isExpanded={expandedSections['working-groups']}
        onToggle={toggleSection}
      >
        <WorkingGroupsSpending />
      </CollapsibleSection>

      {/* Risk Analytics */}
      <CollapsibleSection
        id="risk-analytics"
        title="Risk Analytics"
        subtitle="Portfolio risk assessment and exposure metrics"
        isExpanded={expandedSections['risk-analytics']}
        onToggle={toggleSection}
      >
        <div className="space-y-0">
          <CollapsibleSection
            id="concentration-risk"
            title="Concentration Risk"
            subtitle="Asset concentration and diversification metrics"
            isExpanded={expandedSections['concentration-risk']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Single Asset Max Concentration</span>
                <span>61.3% (ETH)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Top 3 Assets Concentration</span>
                <span>100% (ETH, USDC, ENS)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Diversification Score</span>
                <span>Medium (6.2/10)</span>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="liquidity-risk"
            title="Liquidity Risk"
            subtitle="Asset liquidity and market depth analysis"
            isExpanded={expandedSections['liquidity-risk']}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Highly Liquid Assets</span>
                <span>80.8% ($748M)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Medium Liquidity Assets</span>
                <span>19.2% ($179M)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Emergency Liquidity Available</span>
                <span>$180.2M (48h access)</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      </CollapsibleSection>

      {/* Performance Metrics */}
      <CollapsibleSection
        id="performance-metrics"
        title="Performance Metrics"
        subtitle="Treasury performance and operational KPIs"
        isExpanded={expandedSections['performance-metrics']}
        onToggle={toggleSection}
      >
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Txn Vol</div>
            <div className="text-lg font-light text-slate-900">1,247 (+156 today)</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active WGs</div>
            <div className="text-lg font-light text-slate-900">3 (Operational)</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gov Tokens</div>
            <div className="text-lg font-light text-slate-900">25,215 (Q1 2025)</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sys Uptime</div>
            <div className="text-lg font-light text-slate-900">99.97% (Operational)</div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default Dashboard;
