import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AddProduct from './components/Inventory/AddProduct';
import ProductList from './components/Inventory/ProductList';
import SalesEntry from './components/Sales/SalesEntry';
import DailySalesReport from './components/Reports/DailySalesReport';
import { AuthProvider } from './components/Auth/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-300 mb-8">
          🛒 Minimal Inventory Tool
        </h1>

        <Routes>
          {/* 🔓 Public Routes */}
          <Route
            path="/signup"
            element={
              <div className="max-w-4xl mx-auto space-y-6">
                <Signup />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="max-w-4xl mx-auto space-y-6">
                <Login />
              </div>
            }
          />

          {/* 🔐 Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <SalesEntry />
              </PrivateRoute>
            }
          />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <DailySalesReport />
              </PrivateRoute>
            }
          />

          {/* 🧭 Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
