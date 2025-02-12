// src/pages/CreateProduct.jsx

import React from 'react';
import ProductForm from '../components/ProductForm';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const CreateProduct = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <ProductForm />
      </div>
    </div>
  );
};

export default CreateProduct;
