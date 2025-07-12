import React, { useContext, useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';

// Create Context
const AuthContext = createContext();

// Custom Hook
export const useAuth = () => useContext(AuthContext);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = { currentUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
