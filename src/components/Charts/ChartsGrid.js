// src/components/Charts/ChartsGrid.js
import React, { useState } from 'react';
import BarChartComponent from './BarChartComponent';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';

const ChartsGrid = () => {
  const [range, setRange] = useState('weekly'); // 'weekly' or 'monthly'
  const [metric, setMetric] = useState('sales'); // 'sales' or 'profit'

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Time Range:</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Metric:</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700 dark:text-white"
          >
            <option value="sales">Sales</option>
            <option value="profit">Profit</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h3 className="text-center font-semibold mb-2 text-indigo-600 dark:text-indigo-300">Bar Chart</h3>
          <BarChartComponent range={range} metric={metric} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h3 className="text-center font-semibold mb-2 text-indigo-600 dark:text-indigo-300">Line Chart</h3>
          <LineChartComponent range={range} metric={metric} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h3 className="text-center font-semibold mb-2 text-indigo-600 dark:text-indigo-300">Pie Chart</h3>
          <PieChartComponent range={range} metric={metric} />
        </div>
      </div>
    </div>
  );
};

export default ChartsGrid;
