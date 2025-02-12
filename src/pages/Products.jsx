// src/pages/Products.jsx

import React from 'react';
import ProductList from '../components/ProductList';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Products = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <ProductList />
      </div>
    </div>
  );
};

export default Products;
