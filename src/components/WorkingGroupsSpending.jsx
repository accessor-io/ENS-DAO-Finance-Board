import React, { useState } from 'react';
import { ensFinancialData } from '../data/ensData';


const WorkingGroupsSpending = () => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const { workingGroups } = ensFinancialData;
  const q1Data = workingGroups.q1_2025;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGroupColor = (groupName) => {
    const colors = {
      'Ecosystem': 'blue',
      'Meta-Governance': 'purple',
      'Public Goods': 'green'
    };
    return colors[groupName] || 'gray';
  };

  const filteredGroups = selectedGroup === 'all' 
    ? q1Data.groups 
    : q1Data.groups.filter(group => group.name === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Header with source attribution */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ENS DAO Working Group Spending</h2>
            <p className="text-gray-300">Q1 2025 Financial Summary</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Source:</p>
            <a 
              href={q1Data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              ENS DAO Governance Forum
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Spending</h3>
            <p className="text-3xl font-bold">{formatCurrency(q1Data.totalSpending)}</p>
            <p className="text-blue-100 text-sm">Q1 2025</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Working Groups</h3>
            <p className="text-3xl font-bold">{q1Data.groups.length}</p>
            <p className="text-green-100 text-sm">Active Groups</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">ENS Distributed</h3>
            <p className="text-3xl font-bold">25,215</p>
            <p className="text-purple-100 text-sm">Governance Tokens</p>
          </div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="glass p-4 rounded-lg border border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedGroup === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Groups
          </button>
          {q1Data.groups.map((group) => (
            <button
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGroup === group.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      {/* Working Groups Details */}
      <div className="space-y-4">
        {filteredGroups.map((group) => (
          <div 
            key={group.name} 
            className="p-6 rounded-lg border border-gray-700 bg-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{group.name}</h3>
                <p className="text-gray-400">
                  {formatCurrency(group.spending)} {group.currency}
                  {group.spending.eth && ` + ${group.spending.eth} ETH`}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium marble-${getGroupColor(group.name)} text-white`}>
                {((group.spending / q1Data.totalSpending) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Initiatives */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">Initiatives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.initiatives.map((initiative, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold text-white">{initiative.name}</h5>
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(initiative.amount)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{initiative.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance Distribution */}
            {group.governanceDistribution && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-2">Governance Distribution</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-300 text-sm">{group.governanceDistribution.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">
                      {group.governanceDistribution.ensTokens.toLocaleString()}
                    </p>
                    <p className="text-yellow-200 text-sm">ENS Tokens</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Data Source Footer */}
      <div className="p-4 rounded-lg border border-gray-700 bg-gray-800">
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-2">Data sourced from ENS DAO Governance Forum</p>
          <p className="text-gray-500 text-xs">
            USD price conversions for ETH are made using end-of-day pricing sourced from CoinGecko. 
            The price of USDC is hard coded as $1. Numbers in diagrams are rounded to the nearest thousand.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkingGroupsSpending; 