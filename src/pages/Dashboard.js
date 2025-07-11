// src/components/Dashboard.js

import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AddProduct from '../components/Inventory/AddProduct';
import ProductList from '../components/Inventory/ProductList';
import SalesEntry from '../components/Sales/SalesEntry';
import DailySalesReport from '../components/Reports/DailySalesReport';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [themeToggle, setThemeToggle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setThemeToggle(data.theme || 'light');
        document.documentElement.classList.toggle('dark', data.theme === 'dark');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setThemeToggle(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { theme: newTheme });
    }
  };

  if (!userData) return <p className="text-center text-gray-500 dark:text-gray-300">Loading dashboard...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white animate-fade-in">
      <h1 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
        🛒 Welcome to Your Dashboard
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p><strong>Shop Name:</strong> {userData.shopName || 'N/A'}</p>
          <p><strong>Category:</strong> {userData.shopCategory || 'N/A'}</p>


          <div className="mt-4">
            <label htmlFor="themeSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Change Theme</label>
            <select
              id="themeSelect"
              value={themeToggle}
              onChange={handleThemeChange}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <AddProduct />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <SalesEntry />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <DailySalesReport />
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;