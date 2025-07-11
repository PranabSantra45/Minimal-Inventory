// src/components/Inventory/PurchaseEntry.js

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';

const PurchaseEntry = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [additionalQty, setAdditionalQty] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('name'));
        const snapshot = await getDocs(q);
        const productData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !additionalQty || !purchasePrice) {
      setMessage('⚠️ Please fill all fields');
      return;
    }

    try {
      const productDocRef = doc(db, 'products', selectedProduct);
      const selected = products.find(p => p.id === selectedProduct);

      if (!selected) {
        setMessage('❌ Product not found');
        return;
      }

      const newQty = selected.quantity + parseInt(additionalQty);

      await updateDoc(productDocRef, {
        quantity: newQty,
        purchasePrice: parseFloat(purchasePrice),
        updatedAt: new Date()
      });

      setMessage(`✅ Restocked "${selected.name}" with new quantity ${newQty}`);
      setSelectedProduct('');
      setAdditionalQty('');
      setPurchasePrice('');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">📦 Purchase Entry</h2>
      <form onSubmit={handlePurchase} className="space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity to Add"
          value={additionalQty}
          onChange={(e) => setAdditionalQty(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Purchase Price per Unit"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          ➕ Add Stock
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default PurchaseEntry;
