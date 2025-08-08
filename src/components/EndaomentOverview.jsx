import React from 'react';
import StatsCard from './StatsCard';
import { ensFinancialData } from '../data/ensData';

const EndaomentOverview = () => {
  const { endaoment } = ensFinancialData;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const utilizationRate = ((endaoment.disbursedAmount / endaoment.totalContributions) * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* ENDAOment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Contributions"
          value={formatCurrency(endaoment.totalContributions)}
          trend="16,000 ETH"
          trendUp={true}
        />
        <StatsCard
          title="Disbursed Amount"
          value={formatCurrency(endaoment.disbursedAmount)}
          trend={`${utilizationRate}% utilized`}
          trendUp={true}
        />
        <StatsCard
          title="Available Balance"
          value={formatCurrency(endaoment.availableBalance)}
          trend="Managed by Karpatkey"
          trendUp={true}
        />
        <StatsCard
          title="Recipients"
          value={endaoment.recipients.length.toString()}
          trend="Active grants"
          trendUp={true}
        />
      </div>

      {/* ENDAOment Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ENDAOment Fund Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fund ID</label>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{endaoment.fundId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Safe Wallet Address</label>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded">{endaoment.walletAddress}</p>
          </div>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">ENDAOment Recipients</h3>
          <p className="text-sm text-gray-500 mt-1">Organizations and projects that received funding</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (ETH)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USD Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {endaoment.recipients.map((recipient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                    {formatAddress(recipient.walletAddress)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {recipient.amount.eth.toLocaleString()} ETH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(recipient.amount.usd)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {recipient.purpose}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-mono hover:text-blue-800">
                    <a href={`https://etherscan.io/tx/${recipient.txHash}`} target="_blank" rel="noopener noreferrer">
                      {formatAddress(recipient.txHash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Recipients: {endaoment.recipients.length}</span>
            <span className="text-gray-500">
              Total Disbursed: {formatCurrency(
                endaoment.recipients.reduce((total, recipient) => total + recipient.amount.usd, 0)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Utilization</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Disbursed</span>
              <span>{utilizationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${utilizationRate}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold">{formatCurrency(endaoment.disbursedAmount)}</p>
              <p className="text-green-600">Disbursed</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-semibold">{formatCurrency(endaoment.availableBalance)}</p>
              <p className="text-blue-600">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndaomentOverview;