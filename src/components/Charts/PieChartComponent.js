// src/components/Charts/PieChartComponent.js

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

const PieChartComponent = ({ metric = 'totalAmount' }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(collection(db, 'sales'), where('userId', '==', user.uid));

      onSnapshot(q, (snapshot) => {
        const productMap = {};

        snapshot.forEach(doc => {
          const sale = doc.data();
          const value = metric === 'profit'
            ? (sale.profit || 0)
            : (sale.totalAmount || (sale.sellingPrice * sale.quantity));

          productMap[sale.product] = (productMap[sale.product] || 0) + value;
        });

        const pieData = Object.keys(productMap).map((key) => ({
          name: key,
          value: parseFloat(productMap[key].toFixed(2)),
        }));

        setData(pieData);
      });
    });

    return () => unsubscribe();
  }, [metric]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
        🥧 {metric === 'profit' ? 'Profit' : 'Sales'} by Product
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieChartComponent;
