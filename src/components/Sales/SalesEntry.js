import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase/config';
import { Timestamp } from 'firebase/firestore';
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

const SalesEntry = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        purchasePrice: doc.data().purchasePrice || 0,
        sellingPrice: doc.data().sellingPrice || '',
        quantity: doc.data().quantity,
      }));
      setProducts(productList);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  const handleSale = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantitySold || !sellingPrice) {
      setMessage('⚠️ Please fill all fields');
      return;
    }

    try {
      const product = products.find((p) => p.name.toLowerCase() === selectedProduct.toLowerCase());
      if (!product) {
        setMessage('❌ Product not found');
        return;
      }

      const productRef = doc(db, 'products', product.id);
      const qtyToSell = parseInt(quantitySold);
      const newQty = product.quantity - qtyToSell;

      if (newQty < 0) {
        setMessage('❌ Not enough stock available');
        return;
      }

      await updateDoc(productRef, {
        quantity: newQty,
        sellingPrice: parseFloat(sellingPrice)
      });

      const sellPrice = parseFloat(sellingPrice);
      const purchasePrice = product.purchasePrice;
      const profit = (sellPrice - purchasePrice) * qtyToSell;

      await addDoc(collection(db, 'sales'), {
      userId: auth.currentUser.uid,              // ✅ Link sale to the logged-in user
      product: selectedProduct,
      quantity: qtyToSell,
      sellingPrice: sellPrice,
      purchasePrice,
      profit,
      totalAmount: qtyToSell * sellPrice,        // ✅ Useful for revenue stats
      date: Timestamp.now(),                     // ✅ Firestore-native timestamp
      });

      setMessage('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setSelectedProduct('');
      setQuantitySold('');
      setSellingPrice('');
      setSearchTerm('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error recording sale:', error);
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProductInfo = products.find(
    (prod) => prod.name.toLowerCase() === selectedProduct.toLowerCase()
  );

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">🛒 Record Sale</h2>

      <form onSubmit={handleSale} className="space-y-4">
        <div className="relative">
          {selectedProduct ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
              <span className="text-gray-800 dark:text-white">{selectedProduct}</span>
              <button
                type="button"
                onClick={() => setSelectedProduct('')}
                className="text-red-500 hover:text-red-700 text-sm ml-2"
              >
                ✖
              </button>
            </div>
          ) : (
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full p-2 border border-gray-300 rounded text-gray-800 dark:bg-gray-800 dark:text-white"
            />
          )}
          {showDropdown && searchTerm && (
            <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded mt-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedProduct(product.name);
                      setSellingPrice(product.sellingPrice?.toString() || '');
                      setSearchTerm('');
                      setShowDropdown(false);
                    }}
                  >
                    {product.name}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-500 dark:text-gray-300">No match found</li>
              )}
            </ul>
          )}
        </div>

        {selectedProductInfo && (
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <p>Purchase Price: ₹{selectedProductInfo.purchasePrice}</p>
            <p>Last Selling Price: ₹{selectedProductInfo.sellingPrice || '—'}</p>
            <p>Available Stock: {selectedProductInfo.quantity}</p>
          </div>
        )}

        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-800 dark:bg-gray-800 dark:text-white"
        />

        <input
          type="number"
          placeholder="Selling Price per Unit"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-gray-800 dark:bg-gray-800 dark:text-white"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          ➖ Record Sale
        </button>
      </form>

      {showToast && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 text-center rounded shadow">
          ✅ Sale recorded successfully!
        </div>
      )}

      {message && (
        <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">{message}</p>
      )}
    </div>
  );
};

export default SalesEntry;
