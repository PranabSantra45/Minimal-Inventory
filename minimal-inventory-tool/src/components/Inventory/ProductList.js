// src/components/Inventory/ProductList.js

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', quantity: '', price: '' });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setProducts(items);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Delete this product?');
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('❌ Delete error:', error);
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditData({ name: product.name, quantity: product.quantity, price: product.price });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'products', editId), {
        name: editData.name,
        quantity: parseInt(editData.quantity),
        price: parseFloat(editData.price),
      });
      setEditId(null);
      setEditData({ name: '', quantity: '', price: '' });
    } catch (error) {
      console.error('❌ Update error:', error);
    }
  };

  return (
    <div>
      <h3>📦 Inventory List</h3>
      <h4 style={{ color: 'crimson' }}>🔔 Low Stock Alerts (≤ 5)</h4>
<ul>
  {products
    .filter((p) => p.quantity <= 5)
    .map((prod) => (
      <li key={prod.id} style={{ color: 'red' }}>
        ⚠️ {prod.name} - only {prod.quantity} left
      </li>
    ))}
</ul>

      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <ul>
          {products.map((prod) =>
            editId === prod.id ? (
              <li key={prod.id}>
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editData.quantity}
                    onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  />
                  <button type="submit">✅ Save</button>
                  <button onClick={() => setEditId(null)}>❌ Cancel</button>
                </form>
              </li>
            ) : (
              <li key={prod.id}>
                <strong>{prod.name}</strong> - {prod.quantity} pcs @ ₹{prod.price}
                <button onClick={() => handleEdit(prod)} style={{ marginLeft: '10px' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(prod.id)} style={{ marginLeft: '5px' }}>❌ Delete</button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
