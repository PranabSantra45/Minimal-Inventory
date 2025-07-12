import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      if (!email && !phone) {
        setMessage('❌ Please enter either Email or Phone number');
        return;
      }

      const tempEmail = email || `${phone}@example.com`; // Create dummy email if phone only
      const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: email || '',
        phone: phone || '',
        theme,
        createdAt: new Date(),
      });

      // Apply theme
      document.documentElement.classList.toggle('dark', theme === 'dark');
      setMessage('✅ Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">📝 Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email (optional)"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number (optional)"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="\d{10}"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="light">☀️ Light Mode</option>
            <option value="dark">🌙 Dark Mode</option>
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
