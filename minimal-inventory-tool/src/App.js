// src/App.js

import React from 'react';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import AuthDetails from './components/Auth/AuthDetails';
import AddProduct from './components/Inventory/AddProduct';
import ProductList from './components/Inventory/ProductList';

function App() {
  return (
    <div className="App">
      <h1>🛒 Minimal Inventory Tool</h1>

      <Signup />
      <Login />
      <AuthDetails />
      <AddProduct />
      <ProductList/>

    </div>
  );
}

export default App;
