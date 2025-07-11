// src/components/Auth/AuthDetails.js

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Track login status in real-time
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("✅ User logged out");
      })
      .catch((error) => {
        console.error("❌ Logout error:", error);
      });
  };

  return (
    <div>
      {user ? (
        <>
          <p>🔐 Logged in as: <strong>{user.email}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>🛑 Not logged in</p>
      )}
    </div>
  );
};

export default AuthDetails;
