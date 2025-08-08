import React, { useState, useMemo } from 'react';
import { ensFinancialData } from '../data/ensData';

const ExpendituresTable = () => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterCategory, setFilterCategory] = useState('all');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const categories = ['all', ...new Set(ensFinancialData.expenditures.map(exp => exp.category))];

  const filteredAndSortedExpenditures = useMemo(() => {
    let filtered = ensFinancialData.expenditures;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount.usd;
          bValue = b.amount.usd;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'expenditureId':
          aValue = a.expenditureId;
          bValue = b.expenditureId;
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [sortField, sortDirection, filterCategory]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalExpenditures = ensFinancialData.expenditures.reduce((sum, exp) => sum + exp.amount.usd, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Total Expenditures</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalExpenditures)}</p>
          <p className="text-sm text-gray-500">{ensFinancialData.expenditures.length} transactions</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Largest Expenditure</h3>
          <p className="text-3xl font-bold text-green-600">
            {formatCurrency(Math.max(...ensFinancialData.expenditures.map(exp => exp.amount.usd)))}
          </p>
          <p className="text-sm text-gray-500">ENDAOment transfer</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Average Expenditure</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(totalExpenditures / ensFinancialData.expenditures.length)}
          </p>
          <p className="text-sm text-gray-500">Per transaction</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('expenditureId')}
                >
                  <div className="flex items-center">
                    Expenditure ID
                    {sortField === 'expenditureId' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center">
                    Category
                    {sortField === 'category' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount (USD)
                    {sortField === 'amount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedExpenditures.map((expenditure, index) => (
                <tr key={expenditure.expenditureId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {expenditure.expenditureId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(expenditure.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expenditure.category === 'endaoment' ? 'bg-blue-100 text-blue-800' :
                      expenditure.category === 'grants' ? 'bg-green-100 text-green-800' :
                      expenditure.category === 'development' ? 'bg-purple-100 text-purple-800' :
                      expenditure.category === 'operational' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {expenditure.category.charAt(0).toUpperCase() + expenditure.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(expenditure.amount.usd)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={`https://etherscan.io/address/${expenditure.recipient}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {formatAddress(expenditure.recipient)}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {expenditure.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a
                      href={`https://etherscan.io/tx/${expenditure.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {formatAddress(expenditure.txHash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenditures by Category</h3>
        <div className="space-y-3">
          {Object.entries(
            ensFinancialData.expenditures.reduce((acc, exp) => {
              acc[exp.category] = (acc[exp.category] || 0) + exp.amount.usd;
              return acc;
            }, {})
          ).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                  category === 'endaoment' ? 'bg-blue-500' :
                  category === 'grants' ? 'bg-green-500' :
                  category === 'development' ? 'bg-purple-500' :
                  category === 'operational' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}></span>
                <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>
                <div className="text-xs text-gray-500">{((amount / totalExpenditures) * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpendituresTable;


