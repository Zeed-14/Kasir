
// src/components/SalesChart.js

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext'; // Import hook tema

const SalesChart = ({ data }) => {
  const { theme } = useTheme(); // Dapatkan tema saat ini

  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return `${tickItem / 1000000} Jt`;
    if (tickItem >= 1000) return `${tickItem / 1000} Rb`;
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#4A5568' : '#e0e0e0'} />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: theme === 'dark' ? '#A0AEC0' : '#000' }} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: theme === 'dark' ? '#A0AEC0' : '#000' }} />
          <Tooltip 
            formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#2D3748' : '#fff',
              borderColor: theme === 'dark' ? '#4A5568' : '#ccc'
            }}
          />
          <Bar dataKey="total" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
