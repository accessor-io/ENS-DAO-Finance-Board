import React from 'react';
import Dashboard from './components/Dashboard';
import PriceTicker from './components/PriceTicker';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Ξ</span>
              </div>
              <div>
                <span className="text-white font-bold text-xl tracking-wide">ENS DAO</span>
                <div className="text-white/60 text-xs">Treasury Dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PriceTicker />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/70 text-sm">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
