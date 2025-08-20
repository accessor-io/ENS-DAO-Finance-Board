import React from 'react';
import Dashboard from './components/Dashboard';
import PriceTicker from './components/PriceTicker';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between" style={{backgroundColor: "#1f293a"}}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-blue-500 rounded-sm" />
              <span className="text-slate-100 font-semibold tracking-wide">ENS DAO Finance</span>
            </div>
            <div className="text-slate-200">
              <PriceTicker />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Header />
        <div className="mt-4">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
