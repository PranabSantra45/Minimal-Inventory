import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

const categoryMap = {
  "Book Store": ["Stationery", "Textbooks", "Novels"],
  "Grocery": ["Dairy", "Snacks", "Vegetables"],
  "Medical": ["OTC Drugs", "Prescriptions", "Wellness"],
  "Clothing": ["Men's Wear", "Women's Wear", "Kids"],
  "Electronics": ["Mobiles", "Accessories", "Appliances"],
  "Hardware": ["Tools", "Plumbing", "Paint"],
};

const ShopSetup = () => {
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopName || !shopCategory) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await setDoc(doc(db, 'shops', uid), {
        shopName,
        shopCategory,
        productClasses: categoryMap[shopCategory],
      });

      navigate('/dashboard');
    } catch (err) {
      console.error("❌ Error saving shop setup:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">🛍️ Setup Your Shop</h2>

        <input
          type="text"
          placeholder="Enter Shop Name"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={shopCategory}
          onChange={(e) => setShopCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Shop Category</option>
          {Object.keys(categoryMap).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
          Save & Go to Dashboard
        </button>
      </form>
    </div>
  );
};

export default ShopSetup;
