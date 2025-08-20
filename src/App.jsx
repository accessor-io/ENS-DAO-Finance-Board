import React from 'react';
import Dashboard from './components/Dashboard';
import PriceTicker from './components/PriceTicker';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Executive Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-full mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-900 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <div>
                <h1 className="font-semibold text-slate-900 tracking-tight">
                  ENS DAO Treasury Management
                </h1>
                <p className="text-xs text-slate-600 uppercase tracking-wider">
                  Executive Financial Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <PriceTicker />
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-sm border border-slate-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">
                  Real-Time Data
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Last Updated
                </div>
                <div className="text-xs text-slate-900 font-medium">
                  {new Date().toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
