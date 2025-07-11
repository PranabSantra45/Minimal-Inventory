import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [message, setMessage] = useState('');
  const [isNewProduct, setIsNewProduct] = useState(true);
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const names = snapshot.docs.map((doc) => doc.data().name);
      setExistingProducts(names);
    });
    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || purchasePrice <= 0 || quantity <= 0) {
      setMessage('⚠️ Enter valid product details');
      return;
    }

    try {
      const newProduct = {
        name,
        category,
        purchasePrice: parseFloat(purchasePrice),
        quantity: parseInt(quantity),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdAt: serverTimestamp(),
        tag: isNewProduct ? 'New' : 'Restock',
      };

      await addDoc(collection(db, 'products'), newProduct);

      setMessage('✅ Product added successfully');
      setName('');
      setCategory('Grocery');
      setPurchasePrice('');
      setQuantity('');
      setExpiryDate('');
      setIsNewProduct(true);
    } catch (error) {
      console.error('❌ Error adding product:', error);
      setMessage('❌ Failed to add product');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 text-center">
        ➕ Add Product
      </h2>
      <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 flex items-center gap-4">
          <label className="text-gray-800 dark:text-gray-300">New Product?</label>
          <input
            type="checkbox"
            checked={isNewProduct}
            onChange={() => setIsNewProduct(!isNewProduct)}
          />
        </div>

        {isNewProduct ? (
          <input
            type="text"
            placeholder="Product Name"
            className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        ) : (
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="" disabled>Select Product</option>
            {existingProducts.map((prod, idx) => (
              <option key={idx} value={prod}>{prod}</option>
            ))}
          </select>
        )}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="Grocery">Grocery</option>
          <option value="Medical">Medical</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Purchase Price"
          className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          min="0"
        />
        <input
          type="number"
          placeholder="Quantity"
          className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
        />
        <input
          type="date"
          className="p-2 border rounded text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="Expiry Date (if applicable)"
        />
        <button
          type="submit"
          className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
        >
          ➕ Add Product
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-center text-green-600 dark:text-green-400">{message}</p>}
    </div>
  );
};

export default AddProduct;

