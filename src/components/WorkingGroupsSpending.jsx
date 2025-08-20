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

  const filteredGroups = selectedGroup === 'all' 
    ? q1Data.groups 
    : q1Data.groups.filter(group => group.name === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(q1Data.totalSpending)}</div>
          <div className="text-sm text-gray-600">Total Spending</div>
          <div className="text-xs text-gray-500">Q1 2025</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{q1Data.groups.length}</div>
          <div className="text-sm text-gray-600">Working Groups</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">25,215</div>
          <div className="text-sm text-gray-600">ENS Distributed</div>
          <div className="text-xs text-gray-500">Governance Tokens</div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGroup('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium border ${
            selectedGroup === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Groups
        </button>
        {q1Data.groups.map((group) => (
          <button
            key={group.name}
            onClick={() => setSelectedGroup(group.name)}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              selectedGroup === group.name
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Working Groups Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Working Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spending
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Share
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Initiatives
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <tr key={group.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{group.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(group.spending)} {group.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(group.spending / q1Data.totalSpending) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {((group.spending / q1Data.totalSpending) * 100).toFixed(1)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {group.initiatives.length} initiatives
                  </div>
                  <details className="mt-1">
                    <summary className="text-blue-600 cursor-pointer text-sm hover:text-blue-800">
                      View details
                    </summary>
                    <div className="mt-2 space-y-2">
                      {group.initiatives.map((initiative, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium text-gray-900">{initiative.name}</div>
                            <div className="text-gray-600">{formatCurrency(initiative.amount)}</div>
                          </div>
                          <div className="text-gray-600 text-xs">{initiative.description}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Source */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        Data sourced from{' '}
        <a 
          href={q1Data.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          ENS DAO Governance Forum
        </a>
        <div className="text-xs text-gray-400 mt-1">
          USD conversions use end-of-day pricing from CoinGecko. Numbers rounded to nearest thousand.
        </div>
      </div>
    </div>
  );
};

export default WorkingGroupsSpending;
