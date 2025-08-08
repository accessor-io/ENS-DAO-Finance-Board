import React from 'react';
import { ensFinancialData } from '../data/ensData';

const Header = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="glass border-b border-slate-700 relative z-20">
      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-base tracking-wider">ENS</span>
            </div>
            <div>
              <h1 className="text-2xl font-light text-white tracking-tight">ENS DAO Financial Dashboard</h1>
              <p className="text-sm text-slate-400 font-light">Treasury Management & Analytics</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Last Updated</p>
            <p className="text-sm font-medium text-white">
              {formatDate(ensFinancialData.dashboardMetadata.lastUpdated)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Sources: {ensFinancialData.dashboardMetadata.dataSources.join(' • ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;