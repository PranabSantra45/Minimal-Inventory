// src/components/Layout/Sidebar.js
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6 space-y-6">
      <h2 className="text-xl font-bold">🛒 Inventory Menu</h2>
      <nav className="space-y-2">
        <Link to="/dashboard" className="block hover:text-indigo-400">🏠 Dashboard</Link>
        <Link to="/add-product" className="block hover:text-indigo-400">➕ Add Product</Link>
        <Link to="/products" className="block hover:text-indigo-400">📦 Product List</Link>
        <Link to="/sales" className="block hover:text-indigo-400">💵 Sales Entry</Link>
        <Link to="/report" className="block hover:text-indigo-400">📊 Daily Report</Link>
      </nav>
    </div>
  );
};

export default Sidebar;