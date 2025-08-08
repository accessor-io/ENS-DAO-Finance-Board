import React from 'react';
import { ensFinancialData } from '../data/ensData';

const ContractsTable = () => {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      'token': 'bg-green-100 text-green-800',
      'token-lock': 'bg-yellow-100 text-yellow-800',
      'governance': 'bg-purple-100 text-purple-800',
      'controller': 'bg-blue-100 text-blue-800',
      'karpatkey-managed': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors['other'];
  };

  const getTypeIcon = (type) => {
    const icons = {
      'token': '🪙',
      'token-lock': '🔒',
      'governance': '🏛️',
      'controller': '⚙️',
      'karpatkey-managed': '🏦',
      'other': '📋'
    };
    return icons[type] || icons['other'];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Smart Contracts</h3>
        <p className="text-sm text-gray-500 mt-1">ENS DAO associated smart contracts and their details</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address / ENS Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deployed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ensFinancialData.contracts.map((contract, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getTypeIcon(contract.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{contract.name}</div>
                      {contract.ensName && (
                        <div className="text-sm text-blue-600">{contract.ensName}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">
                    {formatAddress(contract.address)}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {contract.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(contract.type)}`}>
                    {contract.type.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contract.deployedTimestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={`https://etherscan.io/address/${contract.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View on Etherscan
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Contracts: {ensFinancialData.contracts.length}</span>
          <div className="flex space-x-4">
            {Object.entries(ensFinancialData.contracts.reduce((acc, contract) => {
              acc[contract.type] = (acc[contract.type] || 0) + 1;
              return acc;
            }, {})).map(([type, count]) => (
              <span key={type} className="text-gray-500">
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractsTable;