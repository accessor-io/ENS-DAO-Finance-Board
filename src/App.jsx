import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="bg-blue-500 text-white p-4 rounded mb-4">
        <h1 className="text-2xl font-bold">Test Header</h1>
        <p>If you can see this, basic rendering is working.</p>
      </div>
      <Dashboard />
    </div>
  );
}

export default App;