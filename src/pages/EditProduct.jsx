// src/pages/EditProduct.jsx

import React from 'react';
import ProductForm from '../components/ProductForm';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h1 className="text-4xl font-bold text-white quantico-bold-italic">
                  {isEditMode ? 'EDIT PRODUCT' : 'CREATE PRODUCT'}
                </h1>
                <p className="text-blue-100 mt-2 pt-sans-regular">
                  {isEditMode 
                    ? 'Update product details, variants, and images' 
                    : 'Add a new product to your inventory with variants and images'}
                </p>
              </div>
              <img
                src="/assets/img/10x-logo-white.png"
                alt="10X Logo"
                className="h-20"
              />
            </div>
          </div>
          
          <ProductForm />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
