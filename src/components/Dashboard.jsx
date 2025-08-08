import React, { useState } from 'react';
import AssetTracker from './AssetTracker';
import BlockchainData from './BlockchainData';
import AnalyticsOverview from './AnalyticsOverview';
import RealTimeData from './RealTimeData';
import TransactionsTable from './TransactionsTable';
import WalletsTable from './WalletsTable';
import ContractsTable from './ContractsTable';
import ExpendituresTable from './ExpendituresTable';
import WorkingGroupsSpending from './WorkingGroupsSpending';
import ServiceProviderDashboard from './ServiceProviderDashboard';
import KarpatkeyReports from './KarpatkeyReports';
import ProjectTracker from './ProjectTracker';
import TaskManager from './TaskManager';
import MilestoneTracker from './MilestoneTracker';
import EndaomentOverview from './EndaomentOverview';
import ENSNewsletters from './ENSNewsletters';
import SafeNotes from './SafeNotes';
import DataHexbin from './DataHexbin';
import HexbinHeatmap from './HexbinHeatmap';
import { ensFinancialData } from '../data/ensData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Add error handling for data import
  let ensDaoOverview = {};
  try {
    ensDaoOverview = ensFinancialData?.ensDaoOverview || {};
  } catch (error) {
    console.error('Error loading ENS data:', error);
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  // Smart organized tab groups
  const tabGroups = {
    core: {
      name: 'Core Financial',
      tabs: [
        { id: 'overview', label: 'Overview', description: 'Financial overview and key metrics' },
        { id: 'assets', label: 'Asset Tracker', description: 'Real-time treasury tracking and transactions' },
        { id: 'blockchain', label: 'Blockchain Data', description: 'On-chain analytics and metrics' },
        { id: 'transactions', label: 'Transactions', description: 'Detailed transaction history' },
        { id: 'wallets', label: 'Wallets', description: 'Treasury wallet management' }
      ]
    },
    governance: {
      name: 'Governance',
      tabs: [
        { id: 'working-groups', label: 'Working Groups', description: 'Working group spending and budgets' },
        { id: 'service-providers', label: 'Service Providers', description: 'Service provider reports and metrics' },
        { id: 'karpatkey', label: 'Karpatkey Reports', description: 'Treasury management reports' },
        { id: 'endaoment', label: 'Endaoment', description: 'Endaoment overview and metrics' }
      ]
    },
    analytics: {
      name: 'Analytics',
      tabs: [
        { id: 'analytics-overview', label: 'Analytics Overview', description: 'Analytics dashboard' },
        { id: 'real-time', label: 'Real-Time Data', description: 'Live data feeds and metrics' },
        { id: 'data-hexbin', label: 'Data Hexbin', description: 'Hexagonal data visualization' },
        { id: 'hexbin-heatmap', label: 'Hexbin Heatmap', description: 'Heatmap data analysis' }
      ]
    },
    development: {
      name: 'Development',
      tabs: [
        { id: 'projects', label: 'Project Tracker', description: 'Development project tracking' },
        { id: 'tasks', label: 'Task Manager', description: 'Task management and progress' },
        { id: 'milestones', label: 'Milestone Tracker', description: 'Project milestone tracking' },
        { id: 'contracts', label: 'Contracts', description: 'Smart contract management' }
      ]
    },
    infrastructure: {
      name: 'Infrastructure',
      tabs: [
        { id: 'expenditures', label: 'Expenditures', description: 'Infrastructure spending tracking' },
        { id: 'safe-notes', label: 'Safe Notes', description: 'Safe management and notes' }
      ]
    },
    communication: {
      name: 'Communication',
      tabs: [
        { id: 'newsletters', label: 'ENS Newsletters', description: 'Newsletter management and tracking' }
      ]
    }
  };

  const allTabs = Object.values(tabGroups).flatMap(group => group.tabs);

  const getCurrentGroup = () => {
    for (const [groupKey, group] of Object.entries(tabGroups)) {
      if (group.tabs.some(tab => tab.id === activeTab)) {
        return { key: groupKey, ...group };
      }
    }
    return null;
  };

  const currentGroup = getCurrentGroup();

  // Add debugging
  console.log('Dashboard rendering with activeTab:', activeTab);
  console.log('Current group:', currentGroup);

  return (
    <div className="space-y-3">
      {/* Enhanced Header with Current Section */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">ENS DAO Finance Dashboard</h2>
            <div className="text-sm text-gray-400">
              {currentGroup && (
                <span className="text-blue-400 font-medium">{currentGroup.name}</span>
              )} • {allTabs.find(tab => tab.id === activeTab)?.description || 'Select a tab to view data'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Updated</div>
            <div className="text-white font-medium">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Smart Grouped Navigation */}
      <div className="space-y-2">
        {/* Group Navigation */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(tabGroups).map(([groupKey, group]) => (
            <button
              key={groupKey}
              onClick={() => {
                const firstTab = group.tabs[0];
                setActiveTab(firstTab.id);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentGroup?.key === groupKey
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        {/* Tab Navigation within Current Group */}
        {currentGroup && (
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
              {currentGroup.tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-3 border-b-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-gray-800'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                  }`}
                  title={tab.description}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Tab Content with Smart Loading */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="bg-gray-800 p-4 rounded shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">ENS DAO Financial Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-700 p-4 rounded text-white">
                  <h3 className="text-lg font-semibold mb-1">Total Assets</h3>
                  <p className="text-3xl font-bold">{formatCurrency(ensDaoOverview?.totalAssets || 50000000)}</p>
                  <p className="text-blue-100 text-sm">+2.5% from last month</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded text-white">
                  <h3 className="text-lg font-semibold mb-1">Net Balance</h3>
                  <p className="text-3xl font-bold">{formatCurrency(ensDaoOverview?.netBalance || 25000000)}</p>
                  <p className="text-green-100 text-sm">+1.8% from last month</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded text-white">
                  <h3 className="text-lg font-semibold mb-1">Total Expenditures</h3>
                  <p className="text-3xl font-bold">{formatCurrency(ensDaoOverview?.totalExpenditures || 15000000)}</p>
                  <p className="text-purple-100 text-sm">+12.3% from last month</p>
                </div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded">
                <h3 className="text-lg font-semibold text-white mb-1">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-300">Active Wallets</p>
                    <p className="font-semibold text-white">12</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Total Transactions</p>
                    <p className="font-semibold text-white">1,247</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Monthly Growth</p>
                    <p className="font-semibold text-green-400">+8.2%</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Risk Score</p>
                    <p className="font-semibold text-yellow-400">Medium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && <AssetTracker />}
        {activeTab === 'blockchain' && <BlockchainData />}
        {activeTab === 'transactions' && <TransactionsTable />}
        {activeTab === 'wallets' && <WalletsTable />}
        {activeTab === 'working-groups' && <WorkingGroupsSpending />}
        {activeTab === 'service-providers' && <ServiceProviderDashboard />}
        {activeTab === 'karpatkey' && <KarpatkeyReports />}
        {activeTab === 'endaoment' && <EndaomentOverview />}
        {activeTab === 'analytics-overview' && <AnalyticsOverview />}
        {activeTab === 'real-time' && <RealTimeData />}
        {activeTab === 'data-hexbin' && <DataHexbin />}
        {activeTab === 'hexbin-heatmap' && <HexbinHeatmap />}
        {activeTab === 'projects' && <ProjectTracker />}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'milestones' && <MilestoneTracker />}
        {activeTab === 'contracts' && <ContractsTable />}
        {activeTab === 'expenditures' && <ExpendituresTable />}
        {activeTab === 'safe-notes' && <SafeNotes />}
        {activeTab === 'newsletters' && <ENSNewsletters />}
      </div>
    </div>
  );
};

export default Dashboard;