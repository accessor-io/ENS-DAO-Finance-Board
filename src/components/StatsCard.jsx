import React from 'react';

const StatsCard = ({ title, value, trend, trendUp }) => {
  return (
    <div className="glass border border-gray-700 p-6 hover:border-gray-600 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-semibold text-white mt-3 tracking-tight">{value}</p>
          {trend && (
            <div className="mt-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-sm ${
                trendUp 
                  ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' 
                  : 'bg-red-900 text-red-300 border border-red-700'
              }`}>
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;