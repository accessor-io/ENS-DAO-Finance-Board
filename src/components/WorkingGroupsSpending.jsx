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

  const filteredGroups = selectedGroup === 'all' 
    ? q1Data.groups 
    : q1Data.groups.filter(group => group.name === selectedGroup);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-3 gap-3 py-2 border-b border-slate-200 mb-3">
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Exp</div>
          <div className="text-lg font-light text-slate-900">{formatCompactCurrency(q1Data.totalSpending)} (Q1 2025)</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Groups</div>
          <div className="text-lg font-light text-slate-900">{q1Data.groups.length} Operational Units</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Token Dist</div>
          <div className="text-lg font-light text-slate-900">25,215 ENS Governance Tokens</div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="flex gap-3 mb-3">
        <span
          onClick={() => setSelectedGroup('all')}
          className={`text-sm cursor-pointer ${
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
            className={`text-sm cursor-pointer ${
              selectedGroup === group.name
                ? 'text-slate-900 font-medium underline'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {group.name}
          </span>
        ))}
      </div>

      {/* Working Groups Analysis Table */}
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Working Group
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total Exp
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Portfolio %
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Initiatives
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filteredGroups.map((group, index) => (
              <React.Fragment key={group.name}>
                <tr className="hover:bg-slate-25 transition-colors">
                  <td className="px-4 py-2">
                    <span className="font-medium text-slate-900">{group.name} - {group.initiatives[0]?.name || 'Various Initiatives'}</span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className="font-medium text-slate-900">
                      {formatCurrency(group.spending)} {group.currency}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {((group.spending / q1Data.totalSpending) * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {group.initiatives.length} initiatives
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                </tr>
                
                {/* Expandable Initiative Details */}
                <tr className="bg-slate-25">
                  <td colSpan={5} className="px-6 py-4">
                    <details className="group">
                      <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900 font-medium">
                        View Initiative Breakdown
                      </summary>
                      <div className="mt-4 grid gap-3">
                        {group.initiatives.map((initiative, idx) => (
                          <div key={idx} className="bg-white border border-slate-200 rounded-sm p-4">
                            <div className="grid grid-cols-4 gap-4 items-center">
                              <div>
                                <div className="font-medium text-slate-900 text-sm">{initiative.name}</div>
                                <div className="text-xs text-slate-500 mt-1">{initiative.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-slate-900">{formatCurrency(initiative.amount)}</div>
                                <div className="text-xs text-slate-500">Allocated</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-slate-600">
                                  {((initiative.amount / group.spending) * 100).toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500">of Group Budget</div>
                              </div>
                              <div className="text-center">
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Approved
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Attribution */}
      <div className="border-t border-slate-200 pt-4">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">
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
          <div className="text-xs text-slate-400">
            Currency conversions based on end-of-day pricing from CoinGecko API. 
            Figures rounded to nearest thousand for presentation purposes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingGroupsSpending;
