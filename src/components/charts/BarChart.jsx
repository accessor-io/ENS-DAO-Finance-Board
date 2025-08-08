import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ExpendituresChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Amount: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-gray-600">
            Category: {payload[0].payload.category}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="amount" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]}
          name="Expenditure"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpendituresChart;