import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (shopName || shopCategory || !userDoc.exists()) {
        const updatedShopDetails = {
          shopName: shopName || userDoc.data()?.shopName || 'My Shop',
          shopCategory: shopCategory || userDoc.data()?.shopCategory || 'Other',
          createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date(),
          theme: userDoc.data()?.theme || 'light',
        };
        await setDoc(userDocRef, updatedShopDetails);
      }

      // Apply theme
      const userTheme = userDoc.data()?.theme || 'light';
      document.documentElement.classList.toggle('dark', userTheme === 'dark');

      setMessage('✅ Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-gray p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-white">🔐 Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Shop Name (e.g., Joe's Grocery)"
          className="w-full px-3 py-2 border rounded"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
        />
        <select
          value={shopCategory}
          onChange={(e) => setShopCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="" disabled>Select Shop Category</option>
          <option value="Grocery">Grocery</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Hardware">Hardware</option>
          <option value="Medical Shop">Medical Shop</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      <p className="text-sm mt-4 text-center text-white">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-500 hover:underline">  Sign up</a>
      </p>
    </div>
  );
};

export default Login;
