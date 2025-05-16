// src/components/ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrash, FaTag, FaBoxOpen, FaImage, FaClipboardList, FaInfoCircle, FaShippingFast, FaExchangeAlt, FaLayerGroup } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { convertAndFormatPrice } from "../utils/currencyUtils";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProduct, removeProduct, loading } = useProducts();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        // Error handling is done in context
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to deactivate this product?")) return;
    try {
      await removeProduct(id);
      navigate("/admin/products"); // Redirect to products list after deletion
    } catch (error) {
      // Error handled in context
    }
  };

  if (loadingProduct || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color="#6366F1" />
      </div>
    );
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Top Banner with Gradient */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold quantico-bold-italic">Product Details</h1>
            <p className="text-gray-200 pt-sans-regular mt-1">View and manage product information</p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/admin/products/edit/${product._id}`}
              className="flex items-center bg-white text-[#0821D2] px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all quantico-bold-italic"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all quantico-bold-italic"
            >
              <FaTrash className="mr-2" /> Deactivate
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">


        {/* Basic Information */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaInfoCircle className="text-[#0821D2] text-xl mr-2" />
            <h2 className="text-xl font-bold text-gray-800 quantico-bold-italic">Basic Information</h2>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#0821D2] flex items-center justify-center text-white mr-3">
                  <FaTag />
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Product Title</p>
                  <p className="font-medium text-gray-800 pt-sans-bold">{product.title}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white mr-3">
                  <span className="text-lg font-bold">₹</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Price</p>
                  <p className="font-medium text-black quantico-bold text-lg">
                    {product.variants && product.variants.length > 0 
                      ? convertAndFormatPrice(product.variants[0].price) 
                      : product.price 
                        ? convertAndFormatPrice(product.price) 
                        : '₹0.00'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white mr-3">
                  <FaBoxOpen />
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Category</p>
                  <p className="font-medium text-gray-800 pt-sans-bold">{product.category}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                  <span className="text-lg font-bold">%</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Discount</p>
                  <p className="font-medium text-gray-800 pt-sans-bold">{product.discountPercentage}%</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                  <span className="text-lg font-bold">B</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Brand</p>
                  <p className="font-medium text-gray-800 pt-sans-bold">{product.brand}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center text-white mr-3">
                  <FaTag />
                </div>
                <div>
                  <p className="text-sm text-gray-500 pt-sans-regular">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.tags && product.tags.length > 0 ? (
                      product.tags.map(tag => (
                        <span key={tag._id || tag} className="px-2 py-1 bg-gray-200 text-xs rounded-full text-gray-700">
                          {tag.name || tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 pt-0">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-[#0821D2] text-xl mr-2" />
            <h2 className="text-xl font-bold text-gray-800 quantico-bold-italic">Product Description</h2>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border-l-4 border-gray-500">
            <div
              className="prose max-w-none pt-sans-regular text-gray-700"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="p-6 pt-0">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaLayerGroup className="text-[#0821D2] text-xl mr-2" />
            <h2 className="text-xl font-bold text-gray-800 quantico-bold-italic">Additional Information</h2>
          </div>
          
          <div className="space-y-4">
            {/* Product Details */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2]">
              <div className="flex items-center mb-3">
                <FaInfoCircle className="text-[#0821D2] mr-2" />
                <h3 className="text-lg font-semibold text-[#0821D2] quantico-bold-italic">Product Details</h3>
              </div>
              <p className="pt-sans-regular text-gray-700">{product.accordion.details}</p>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
              <div className="flex items-center mb-3">
                <FaShippingFast className="text-indigo-600 mr-2" />
                <h3 className="text-lg font-semibold text-indigo-600 quantico-bold-italic">Shipping Information</h3>
              </div>
              <p className="pt-sans-regular text-gray-700">{product.accordion.shipping}</p>
            </div>
            
            {/* Returns Policy */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <div className="flex items-center mb-3">
                <FaExchangeAlt className="text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-600 quantico-bold-italic">Returns Policy</h3>
              </div>
              <p className="pt-sans-regular text-gray-700">{product.accordion.returns}</p>
            </div>
            
            {/* Packaging Options */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center mb-3">
                <FaBoxOpen className="text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-600 quantico-bold-italic">Packaging Options</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.packaging && product.packaging.length > 0 ? (
                  product.packaging.map((item, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No packaging options available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="p-6 pt-0">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaLayerGroup className="text-[#0821D2] text-xl mr-2" />
            <h2 className="text-xl font-bold text-gray-800 quantico-bold-italic">Product Variants</h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] py-4 px-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-white quantico-bold-italic">Size</div>
                <div className="text-white quantico-bold-italic">Price ₹</div>
                <div className="text-white quantico-bold-italic">Stock</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {product.variants.map((variant, index) => (
                <div 
                  key={index} 
                  className={`py-4 px-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="pt-sans-bold text-gray-800">{variant.size}</div>
                    <div className="pt-sans-regular">
                      <span className="text-green-600 font-medium">
                        {variant.price ? convertAndFormatPrice(variant.price) : '₹0.00'}
                      </span>
                    </div>
                    <div className="pt-sans-regular">
                      <span className={`px-3 py-1 rounded-full text-sm ${variant.stock > 50 ? 'bg-green-100 text-green-800' : variant.stock > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {variant.stock} units
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
