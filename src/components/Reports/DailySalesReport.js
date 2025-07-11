import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const DailySalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'sales'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        let formattedDate = 'Unknown Date';
        let timestamp = null;
        try {
          const dateVal = data.date?.toDate ? data.date.toDate() : new Date(data.date);
          formattedDate = dateVal.toLocaleDateString() + ' ' + dateVal.toLocaleTimeString();
          timestamp = dateVal.getTime();
        } catch {
          timestamp = 0;
        }

        const quantity = data.quantity || 0;
        const sellingPrice = data.sellingPrice || 0;
        const profit = data.profit || 0;
        const totalPrice = quantity * sellingPrice;

        return {
          id: doc.id,
          product: data.product || 'Unknown',
          quantity,
          sellingPrice,
          profit,
          totalPrice,
          date: formattedDate,
          timestamp,
        };
      });

      setSales(salesData);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const filteredSales = sales.filter((sale) => {
    const matchesProduct = filterProduct
      ? sale.product.toLowerCase().includes(filterProduct.toLowerCase())
      : true;
    const saleDate = new Date(sale.timestamp);
    const matchesStartDate = startDate ? saleDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? saleDate <= new Date(endDate) : true;
    return matchesProduct && matchesStartDate && matchesEndDate;
  });

  const totalProfit = filteredSales.reduce((acc, sale) => acc + sale.profit, 0);

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white dark:bg-gray-900 p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 text-center">
        📊 Daily Sales Report
      </h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Filter by Product"
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="w-30 px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading sales data...</p>
      ) : filteredSales.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">No sales data available</p>
      ) : (
        <div className="overflow-auto max-h-[500px]">
          <table className="min-w-full border bg-indigo-50 dark:bg-gray-800 border-gray-300 text-sm">
            <thead className="bg-indigo-100 dark:bg-gray-700 text-gray-900 dark:text-white">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Selling Price</th>
                <th className="p-2 border">Total Price</th>
                <th className="p-2 border">Profit</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="p-2 border">{sale.product}</td>
                  <td className="p-2 border">{sale.quantity}</td>
                  <td className="p-2 border">₹{sale.sellingPrice}</td>
                  <td className="p-2 border font-semibold text-green-600 dark:text-green-400">₹{sale.totalPrice}</td>
                  <td className="p-2 border text-blue-600 dark:text-blue-400">₹{sale.profit}</td>
                  <td className="p-2 border text-gray-700 dark:text-gray-300">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredSales.length > 0 && (
        <div className="mt-4 text-right text-lg font-semibold text-indigo-700 dark:text-indigo-300">
          Total Profit: ₹{totalProfit.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default DailySalesReport;
