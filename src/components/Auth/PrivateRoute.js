// src/components/Auth/PrivateRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  return currentUser ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default PrivateRoute;
