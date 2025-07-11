// src/components/Inventory/AddProduct.js

import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !qty || !price) {
      setMessage('⚠️ All fields required');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name,
        quantity: parseInt(qty),
        price: parseFloat(price),
        createdAt: new Date()
      });
      setMessage('✅ Product added successfully');
      setName('');
      setQty('');
      setPrice('');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Add Product</h3>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        /><br />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        /><br />
        <button type="submit">Add Product</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddProduct;
