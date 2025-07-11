import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc, // ✅ Needed to update products
} from 'firebase/firestore';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    quantity: '',
    purchasePrice: '',
    sellingPrice: '',
    category: '',
    expiryDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rawItems = [];
      snapshot.forEach((doc) => {
        rawItems.push({ id: doc.id, ...doc.data() });
      });

      const merged = {};
      rawItems.forEach((item) => {
        const key = item.name.toLowerCase();
        if (merged[key]) {
          merged[key].quantity += item.quantity;
        } else {
          merged[key] = { ...item };
        }
      });

      const mergedItems = Object.values(merged);
      setProducts(mergedItems);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('❌ Delete error:', error);
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditData({
      name: product.name,
      quantity: product.quantity,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      category: product.category || '',
      expiryDate: product.expiryDate || '',
    });
  };

  // ✅ Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editId) return;

    try {
      const updated = {
        ...editData,
        expiryDate: editData.expiryDate instanceof Date
          ? editData.expiryDate
          : new Date(editData.expiryDate),
      };

      const productRef = doc(db, 'products', editId);
      await updateDoc(productRef, updated);
      setEditId(null);
    } catch (error) {
      console.error('❌ Error saving edit:', error);
      alert('Error saving product changes.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory ? p.category === filterCategory : true;
    const matchStock = showLowStockOnly ? p.quantity <= 5 : true;
    return matchName && matchCategory && matchStock;
  });

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 mt-10">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        📦 Inventory List
      </h3>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Categories</option>
          <option value="Grocery">Grocery</option>
          <option value="Electronics">Electronics</option>
          <option value="Medical">Medical</option>
          <option value="Clothing">Clothing</option>
        </select>
        <label className="flex items-center gap-1 dark:text-white">
          <input
            type="checkbox"
            checked={showLowStockOnly}
            onChange={() => setShowLowStockOnly(!showLowStockOnly)}
          />
          Low Stock Only
        </label>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <thead className="bg-indigo-100 dark:bg-indigo-700">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Purchase ₹</th>
                <th className="p-2 border">Selling ₹</th>
                <th className="p-2 border">Profit ₹</th>
                <th className="p-2 border">Expiry</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((prod) => {
                const profit = prod.sellingPrice - prod.purchasePrice;
                const isLowStock = prod.quantity <= 5;
                const isNearExpiry =
                  prod.expiryDate &&
                  new Date(prod.expiryDate) < new Date(Date.now() + 7 * 86400000);
                return (
                  <tr
                    key={prod.name}
                    className={
                      isLowStock
                        ? 'bg-red-100 dark:bg-red-900'
                        : isNearExpiry
                        ? 'bg-yellow-100 dark:bg-yellow-900'
                        : 'bg-white dark:bg-gray-800'
                    }
                  >
                    <td className="p-2 border font-semibold">{prod.name}</td>
                    <td className="p-2 border">{prod.category || '-'}</td>
                    <td className="p-2 border">{prod.quantity}</td>
                    <td className="p-2 border">₹{prod.purchasePrice}</td>
                    <td className="p-2 border">₹{prod.sellingPrice || '—'}</td>
                    <td className="p-2 border text-green-700 dark:text-green-400">
                      ₹{profit || '—'}
                    </td>
                    <td className="p-2 border">
                      {prod.expiryDate?.toDate?.().toLocaleDateString?.() ||
                        (typeof prod.expiryDate === 'string'
                          ? new Date(prod.expiryDate).toLocaleDateString()
                          : '—')}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="text-blue-600 dark:text-blue-400 mr-2"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ✅ Edit Form UI */}
          {editId && (
            <div className="mt-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
              <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3">✏️ Edit Product</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={editData.quantity}
                  onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) || 0 })}
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Purchase Price"
                  value={editData.purchasePrice}
                  onChange={(e) => setEditData({ ...editData, purchasePrice: parseFloat(e.target.value) || 0 })}
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={editData.sellingPrice}
                  onChange={(e) => setEditData({ ...editData, sellingPrice: parseFloat(e.target.value) || 0 })}
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={editData.category}
                  onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  value={
                    editData.expiryDate
                      ? new Date(
                          editData.expiryDate.seconds
                            ? editData.expiryDate.seconds * 1000
                            : editData.expiryDate
                        ).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    setEditData({ ...editData, expiryDate: new Date(e.target.value) })
                  }
                  className="p-2 border rounded dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  ✅ Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
