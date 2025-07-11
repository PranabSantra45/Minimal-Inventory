// src/components/Charts/LineChartComponent.js

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '../../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { auth } from '../../firebase/config';

const LineChartComponent = ({ metric = 'totalAmount', range = 'weekly' }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(collection(db, 'sales'), where('userId', '==', user.uid));

      onSnapshot(q, (snapshot) => {
        const salesMap = {};

        snapshot.forEach((doc) => {
          const sale = doc.data();
          const dateStr = format(sale.date.toDate(), 'yyyy-MM-dd');

          if (!salesMap[dateStr]) {
            salesMap[dateStr] = { totalAmount: 0, profit: 0 };
          }

          salesMap[dateStr].totalAmount += sale.totalAmount || (sale.sellingPrice * sale.quantity);
          salesMap[dateStr].profit += (sale.profit || 0);
        });

        const chartData = Object.entries(salesMap).map(([date, values]) => ({
          label: date,
          totalAmount: parseFloat(values.totalAmount.toFixed(2)),
          profit: parseFloat(values.profit.toFixed(2))
        }));

        chartData.sort((a, b) => new Date(a.label) - new Date(b.label));
        setData(chartData);
      });
    });

    return () => unsubscribe();
  }, [metric, range]);

  const valueKey = metric === 'profit' ? 'profit' : 'totalAmount';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
        📈 {metric === 'profit' ? 'Profit' : 'Sales'} Line Chart
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={valueKey} stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineChartComponent;
