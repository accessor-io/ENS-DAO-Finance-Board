import React, { useState } from 'react';
import { safeNotesENSData, getCategoryColor, truncateAddress } from '../data/safeNotesData';

const SafeNotes = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredSafes = selectedCategory === 'all' 
    ? safeNotesENSData.safes 
    : safeNotesENSData.safes.filter(safe => safe.category === selectedCategory);

  const sortedSafes = [...filteredSafes].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return parseFloat(b.amount.replace(/[$,]/g, '')) - parseFloat(a.amount.replace(/[$,]/g, ''));
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'safe':
        return a.safe.localeCompare(b.safe);
      default:
        return 0;
    }
  });

  const categories = ['all', ...Object.keys(safeNotesENSData.summary.categories)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">ENS SafeNotes</h2>
            <p className="text-gray-300">Safe management and tracking from SafeNotes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Source:</p>
            <a 
              href={safeNotesENSData.source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              {safeNotesENSData.source.name}
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Safes</h3>
            <p className="text-3xl font-bold">{safeNotesENSData.summary.totalSafes}</p>
            <p className="text-blue-100 text-sm">Active Safes</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Total Value</h3>
            <p className="text-3xl font-bold">{safeNotesENSData.summary.totalAmount}</p>
            <p className="text-green-100 text-sm">Under Management</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Categories</h3>
            <p className="text-3xl font-bold">{Object.keys(safeNotesENSData.summary.categories).length}</p>
            <p className="text-purple-100 text-sm">Different Types</p>
          </div>
          
          <div className="glass p-4 rounded-lg text-white">
            <h3 className="text-lg font-semibold mb-1">Last Updated</h3>
            <p className="text-3xl font-bold">{formatDate(safeNotesENSData.summary.lastUpdated)}</p>
            <p className="text-orange-100 text-sm">Data Freshness</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="glass p-4 rounded-lg border border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-300">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded text-sm border border-gray-600"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="safe">Safe ID</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-400">
            Showing {sortedSafes.length} of {safeNotesENSData.safes.length} safes
          </div>
        </div>
      </div>

      {/* Safes Table */}
      <div className="glass rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Safe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {sortedSafes.map((safe) => (
                <tr key={safe.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{safe.safe}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-400">{safe.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 font-mono">
                      {truncateAddress(safe.address)}
                    </div>
                    <div className="text-xs text-gray-500">Click to copy</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(safe.category)} text-white`}>
                      {safe.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 max-w-xs truncate" title={safe.description}>
                      {safe.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{formatDate(safe.date)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {Object.entries(safeNotesENSData.summary.categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                  <span className="text-gray-300">{category}</span>
                </div>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">SafeNotes Integration</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Real-time safe tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Multi-signature management</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Category-based organization</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Amount tracking and reporting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeNotes; 