// src/components/ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <div className="flex space-x-4">
          <Link
            to={`/admin/products/edit/${product._id}`}
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <FaEdit className="mr-1" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center text-red-600 hover:text-red-900"
          >
            <FaTrash className="mr-1" /> Deactivate
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-2 gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} Image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
          <p><strong>Title:</strong> {product.title}</p>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Discount Percentage:</strong> {product.discountPercentage}%</p>
          <p><strong>Tags:</strong> {product.tags.map(tag => tag.name).join(", ")}</p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Description</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: product.description }}
        ></div>
      </div>

      {/* Accordion Sections */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Details</h3>
            <p>{product.accordion.details}</p>
          </div>
          <div>
            <h3 className="font-semibold">Shipping Information</h3>
            <p>{product.accordion.shipping}</p>
          </div>
          <div>
            <h3 className="font-semibold">Returns Policy</h3>
            <p>{product.accordion.returns}</p>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Variants</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Size</th>
              <th className="py-3 px-6 text-left">Price ($)</th>
              <th className="py-3 px-6 text-left">Stock</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {product.variants.map((variant, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{variant.size}</td>
                <td className="py-3 px-6">${variant.price.toFixed(2)}</td>
                <td className="py-3 px-6">{variant.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetails;
