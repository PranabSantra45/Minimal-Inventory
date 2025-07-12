import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let actualEmail = identifier;

      // If identifier is a 10-digit phone number
      if (/^\d{10}$/.test(identifier)) {
        const snapshot = await getDocs(collection(db, 'users'));
        let matchedEmail = null;

        snapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.phone === identifier && userData.email) {
            matchedEmail = userData.email;
          }
        });

        if (!matchedEmail) {
          throw new Error('Phone number not found. Please check again.');
        }

        actualEmail = matchedEmail;
      }

      const userCredential = await signInWithEmailAndPassword(auth, actualEmail, password);
      const user = userCredential.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // Create or update user's shop details
      const newShopData = {
        shopName: shopName || userDocSnap.data()?.shopName || 'My Shop',
        shopCategory: shopCategory || userDocSnap.data()?.shopCategory || 'Other',
        createdAt: userDocSnap.exists() ? userDocSnap.data().createdAt : new Date(),
        theme: userDocSnap.data()?.theme || 'light',
        email: user.email,
        phone: userDocSnap.data()?.phone || '',
      };

      await setDoc(userDocRef, newShopData);

      // Apply theme
      const theme = newShopData.theme;
      document.documentElement.classList.toggle('dark', theme === 'dark');

      setMessage('✅ Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">🔐 Login to Your Shop</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring focus:border-indigo-500"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Shop Name (optional)"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
          />
          <select
            value={shopCategory}
            onChange={(e) => setShopCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
          >
            <option value="">Select Shop Category</option>
            <option value="Grocery">Grocery</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Hardware">Hardware</option>
            <option value="Medical Shop">Medical Shop</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-500 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
