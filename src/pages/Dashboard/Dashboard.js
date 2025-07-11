// src/pages/Dashboard/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ChartsGrid from '../../components/Charts/ChartsGrid';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [theme, setTheme] = useState('light');
  const [metric, setMetric] = useState('totalAmount'); // 'profit' or 'totalAmount'
  const [range, setRange] = useState('weekly'); // 'weekly' or 'monthly'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      const docRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(docRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setTheme(data.theme || 'light');
        document.documentElement.classList.toggle('dark', data.theme === 'dark');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { theme: newTheme });
    }
  };

  const cards = [
    { label: '➕ Add Product', action: () => navigate('/add-product') },
    { label: '📦 View Products', action: () => navigate('/products') },
    { label: '💰 Sales Entry', action: () => navigate('/sales') },
    { label: '📊 Daily Report', action: () => navigate('/report') }
  ];

  if (!userData) return <p className="text-center text-gray-600 dark:text-gray-300">Loading dashboard...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-300">
          🛍️ Welcome, {userData.shopName || 'Shop Owner'}
        </h1>

        {/* Intro & Theme Switch */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                👋 Hello, <span className="text-indigo-600 dark:text-indigo-300">{userData.shopName || 'Shop Owner'}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You are currently managing a <strong>{userData.shopCategory || 'General'}</strong> store.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use the dashboard to track sales, inventory, and reports in real time.
              </p>
            </div>

            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                🌗 Theme Mode
              </label>
              <select
                id="theme"
                value={theme}
                onChange={handleThemeChange}
                className="w-full md:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chart Toggles */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex flex-wrap justify-center gap-4">
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Metric:</span>
            <button
              onClick={() => setMetric('totalAmount')}
              className={`px-3 py-1 rounded ${metric === 'totalAmount' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
              Sales
            </button>
            <button
              onClick={() => setMetric('profit')}
              className={`ml-2 px-3 py-1 rounded ${metric === 'profit' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
              Profit
            </button>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Range:</span>
            <button
              onClick={() => setRange('weekly')}
              className={`px-3 py-1 rounded ${range === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setRange('monthly')}
              className={`ml-2 px-3 py-1 rounded ${range === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center text-indigo-600 dark:text-indigo-300">
            📊 Sales Insights ({metric === 'profit' ? 'Profit' : 'Sales'} - {range})
          </h2>
          <ChartsGrid metric={metric} range={range} />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="cursor-pointer bg-indigo-600 text-white text-center p-6 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              <h3 className="text-xl font-semibold">{card.label}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
