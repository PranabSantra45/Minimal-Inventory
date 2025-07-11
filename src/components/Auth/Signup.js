import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        theme,
        createdAt: new Date(),
      });

      document.documentElement.classList.toggle('dark', theme === 'dark');
      setMessage('✅ Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">📝 Sign Up</h2>
      <form onSubmit={handleSignup} className="space-y-4">
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
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="light">☀️ Light Mode</option>
          <option value="dark">🌙 Dark Mode</option>
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      <p className="text-sm mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </p>
    </div>
  );
};

export default Signup;
