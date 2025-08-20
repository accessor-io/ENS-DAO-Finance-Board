import React from 'react';
import Dashboard from './components/Dashboard';
import PriceTicker from './components/PriceTicker';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">Ξ</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ENS DAO Treasury</h1>
                <p className="text-sm text-gray-600">Financial Dashboard & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <PriceTicker />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
