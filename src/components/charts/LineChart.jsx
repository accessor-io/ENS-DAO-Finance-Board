import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const KarpatkeyPerformanceChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Portfolio Value: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-green-600">
            ROI: {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
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
          yAxisId="left"
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="#10b981"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="value" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          name="Portfolio Value"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="roi" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
          name="ROI %"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default KarpatkeyPerformanceChart;