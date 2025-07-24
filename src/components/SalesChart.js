import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = ({ data }) => {
  // Formatter untuk sumbu Y (Rupiah)
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return `${tickItem / 1000000} Jt`;
    }
    if (tickItem >= 1000) {
      return `${tickItem / 1000} Rb`;
    }
    return tickItem;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
            cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} // blue-50 with opacity
          />
          <Bar dataKey="total" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;