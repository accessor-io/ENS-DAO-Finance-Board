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
      'Ecosystem': 'from-blue-500 to-cyan-500',
      'Meta-Governance': 'from-purple-500 to-pink-500',
      'Public Goods': 'from-green-500 to-emerald-500'
    };
    return colors[groupName] || 'from-gray-500 to-gray-600';
  };

  const filteredGroups = selectedGroup === 'all' 
    ? q1Data.groups 
    : q1Data.groups.filter(group => group.name === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Working Groups Spending</h2>
        <p className="text-white/70">Q1 2025 Financial Breakdown</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">💰</div>
            <div className="text-right">
              <div className="text-white/70 text-sm">Total Spending</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(q1Data.totalSpending)}</div>
            </div>
          </div>
          <div className="text-white/60 text-sm">Q1 2025 Period</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/30 to-blue-500/30 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">👥</div>
            <div className="text-right">
              <div className="text-white/70 text-sm">Active Groups</div>
              <div className="text-2xl font-bold text-white">{q1Data.groups.length}</div>
            </div>
          </div>
          <div className="text-white/60 text-sm">Working Groups</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🎯</div>
            <div className="text-right">
              <div className="text-white/70 text-sm">ENS Distributed</div>
              <div className="text-2xl font-bold text-white">25,215</div>
            </div>
          </div>
          <div className="text-white/60 text-sm">Governance Tokens</div>
        </div>
      </div>

      {/* Group Filter Pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={() => setSelectedGroup('all')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            selectedGroup === 'all'
              ? 'bg-white text-gray-900 shadow-lg transform scale-105'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          All Groups
        </button>
        {q1Data.groups.map((group) => (
          <button
            key={group.name}
            onClick={() => setSelectedGroup(group.name)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedGroup === group.name
                ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Working Groups Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div 
            key={group.name} 
            className={`bg-gradient-to-br ${getGroupColor(group.name)}/20 rounded-2xl p-6 border border-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
          >
            {/* Group Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                <div className="text-white/70 text-sm">
                  {formatCurrency(group.spending)} {group.currency}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs">Share</div>
                <div className="text-lg font-bold text-white">
                  {((group.spending / q1Data.totalSpending) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-6">
              <div 
                className={`bg-gradient-to-r ${getGroupColor(group.name)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(group.spending / q1Data.totalSpending) * 100}%` }}
              ></div>
            </div>

            {/* Initiatives */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">Key Initiatives</h4>
              {group.initiatives.slice(0, 3).map((initiative, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="text-white text-sm font-medium truncate">{initiative.name}</h5>
                    <span className="text-white/80 text-xs font-semibold ml-2">
                      {formatCurrency(initiative.amount)}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{initiative.description}</p>
                </div>
              ))}
              
              {group.initiatives.length > 3 && (
                <div className="text-center">
                  <button className="text-white/60 text-xs hover:text-white transition-colors">
                    View {group.initiatives.length - 3} more initiatives →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Data Source */}
      <div className="text-center mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm mb-2">
          Data sourced from{' '}
          <a 
            href={q1Data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ENS DAO Governance Forum
          </a>
        </p>
        <p className="text-white/40 text-xs">
          USD conversions use end-of-day pricing from CoinGecko. Numbers rounded to nearest thousand.
        </p>
      </div>
    </div>
  );
};

export default WorkingGroupsSpending;
