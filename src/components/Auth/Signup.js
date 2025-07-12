import React, { useState } from 'react';
import { auth, db } from '../../firebase/config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      return setMessage('❌ Invalid phone number.');
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => sendOTP(),
      });

      const appVerifier = window.recaptchaVerifier;
      const fullPhone = '+91' + phone;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setMessage('📨 OTP sent to your phone.');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const verifyAndSignup = async (e) => {
    e.preventDefault();

    if (!phone || !password || !otp || !confirmationResult) {
      return setMessage('❌ Please fill required fields and complete phone verification.');
    }

    try {
      // ✅ Step 1: Verify OTP
      await confirmationResult.confirm(otp);

      // ✅ Step 2: Create temp user with dummy email (since email is optional)
      const fallbackEmail = email || `${phone}@minimalapp.in`;
      const userCredential = await createUserWithEmailAndPassword(auth, fallbackEmail, password);
      const user = userCredential.user;

      // ✅ Step 3: Send email verification only if email is given
      if (email) {
        await sendEmailVerification(user);
      }

      // ✅ Step 4: Save user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email || null,
        phone,
        theme,
        createdAt: new Date(),
      });

      setMessage(
        email
          ? '✅ Signup successful! A verification link has been sent to your email.'
          : '✅ Signup successful!'
      );

      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">📝 Sign Up</h2>

        <form onSubmit={verifyAndSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email (optional)"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number (10 digits)"
            className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            required
          />
          {!otpSent && (
            <button
              type="button"
              onClick={sendOTP}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition duration-300"
            >
              Send OTP
            </button>
          )}
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
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

        <div id="recaptcha-container"></div>

        {message && (
          <p className="mt-4 text-sm text-center text-red-500">{message}</p>
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
