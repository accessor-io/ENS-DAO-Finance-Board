import React, { useState } from 'react';
import { ensFinancialData } from '../data/ensData';

const WorkingGroupsSpending = () => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedInitiatives, setExpandedInitiatives] = useState({});
  
  const { workingGroups } = ensFinancialData;
  const q1Data = workingGroups.q1_2025;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleInitiative = (groupName, initiativeIndex) => {
    const key = `${groupName}-${initiativeIndex}`;
    setExpandedInitiatives(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredGroups = selectedGroup === 'all' 
    ? q1Data.groups 
    : q1Data.groups.filter(group => group.name === selectedGroup);

  const CollapsibleSection = ({ id, title, subtitle, children, isExpanded, onToggle }) => {
    return (
      <div className="border-b border-slate-200">
        <button
          onClick={() => onToggle(id)}
          className="w-full px-4 py-3 text-left hover:bg-slate-25 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-900">{title}</span>
              {subtitle && <span className="text-xs text-slate-500 ml-2">{subtitle}</span>}
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

  return (
    <div className="space-y-0">
      {/* Summary Overview */}
      <div className="border-b border-slate-200 py-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Exp</div>
            <div className="font-medium text-slate-900">{formatCompactCurrency(q1Data.totalSpending)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Groups</div>
            <div className="font-medium text-slate-900">{q1Data.groups.length}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Token Dist</div>
            <div className="font-medium text-slate-900">25,215</div>
          </div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="border-b border-slate-200 py-3">
        <div className="flex gap-3">
          <span
            onClick={() => setSelectedGroup('all')}
            className={`cursor-pointer ${
              selectedGroup === 'all'
                ? 'text-slate-900 font-medium underline'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Groups
          </span>
          {q1Data.groups.map((group) => (
            <span
              key={group.name}
              onClick={() => setSelectedGroup(group.name)}
              className={`cursor-pointer ${
                selectedGroup === group.name
                  ? 'text-slate-900 font-medium underline'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {group.name}
            </span>
          ))}
        </div>
      </div>

      {/* Working Groups Breakdown */}
      {filteredGroups.map((group) => (
        <CollapsibleSection
          key={group.name}
          id={group.name}
          title={group.name}
          subtitle={`${formatCurrency(group.spending)} • ${((group.spending / q1Data.totalSpending) * 100).toFixed(1)}% • ${group.initiatives.length} initiatives`}
          isExpanded={expandedGroups[group.name]}
          onToggle={toggleGroup}
        >
          <div className="space-y-0">
            {/* Group Summary */}
            <div className="border-b border-slate-100 pb-3 mb-3">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Total Budget:</span>
                  <div className="font-medium">{formatCurrency(group.spending)} {group.currency}</div>
                </div>
                <div>
                  <span className="text-slate-500">Portfolio Share:</span>
                  <div className="font-medium">{((group.spending / q1Data.totalSpending) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>
                  <div className="font-medium text-emerald-600">Active</div>
                </div>
              </div>
            </div>

            {/* Initiatives Breakdown */}
            <div className="space-y-0">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Initiative Breakdown</h4>
              
              {group.initiatives.map((initiative, index) => (
                <CollapsibleSection
                  key={index}
                  id={`${group.name}-initiative-${index}`}
                  title={initiative.name}
                  subtitle={`${formatCurrency(initiative.amount)} • ${((initiative.amount / group.spending) * 100).toFixed(1)}% of group budget`}
                  isExpanded={expandedInitiatives[`${group.name}-${index}`]}
                  onToggle={(id) => toggleInitiative(group.name, index)}
                >
                  <div className="space-y-3">
                    {/* Initiative Details */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Description:</span>
                        <div className="font-medium">{initiative.description}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Allocation:</span>
                        <div className="font-medium">{formatCurrency(initiative.amount)}</div>
                      </div>
                    </div>

                    {/* Budget Breakdown (Simulated) */}
                    <div className="border-t border-slate-100 pt-3">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Budget Allocation</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Personnel (65%)</span>
                          <span>{formatCurrency(initiative.amount * 0.65)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Operations (20%)</span>
                          <span>{formatCurrency(initiative.amount * 0.20)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Infrastructure (10%)</span>
                          <span>{formatCurrency(initiative.amount * 0.10)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Contingency (5%)</span>
                          <span>{formatCurrency(initiative.amount * 0.05)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Milestones (Simulated) */}
                    <div className="border-t border-slate-100 pt-3">
                      <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timeline & Status</h5>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Q1 2025 Target</span>
                          <span className="text-emerald-600">Completed</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Q2 2025 Milestone</span>
                          <span className="text-blue-600">In Progress</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Q3 2025 Review</span>
                          <span className="text-slate-400">Scheduled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              ))}
            </div>

            {/* Governance Distribution (if applicable) */}
            {group.governanceDistribution && (
              <div className="border-t border-slate-100 pt-3 mt-3">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Governance Distribution</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">ENS Tokens Allocated:</span>
                    <div className="font-medium">{group.governanceDistribution.ensTokens.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Distribution Method:</span>
                    <div className="font-medium">{group.governanceDistribution.description}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      ))}

      {/* Data Attribution */}
      <div className="border-t border-slate-200 pt-4 text-center">
        <div className="text-xs text-slate-500">
          Data Source: {' '}
          <a 
            href={q1Data.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-900 font-medium"
          >
            ENS DAO Governance Forum
          </a>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Currency conversions based on end-of-day pricing from CoinGecko API. 
          Figures rounded to nearest thousand for presentation purposes.
        </div>
      </div>
    </div>
  );
};

export default WorkingGroupsSpending;
