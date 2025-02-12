// src/components/ProductForm.jsx

import React, { useEffect, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import useCategories from '../hooks/useCategories';
import useTags from '../hooks/useTags';
import 'react-toastify/dist/ReactToastify.css'; // Ensure ReactToastify styles are imported

const ProductForm = () => {
  const { id } = useParams(); // If id exists, it's edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const {
    addProduct,
    editProduct,
    getProduct,
    uploadImage,
  } = useProducts();

  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const {
    tags,
    loading: loadingTags,
    error: errorTags,
  } = useTags();

  // State variables
  const [title, setTitle] = useState('');
  // Removed top-level price and stock
  const [description, setDescription] = useState(''); // Plain text description
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [brand, setBrand] = useState('');
  const [accordion, setAccordion] = useState({
    details: '',
    shipping: '',
    returns: '',
  });
  const [productBG, setProductBG] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [variants, setVariants] = useState([
    { size: '', price: '', stock: '' },
  ]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [rating, setRating] = useState(0); // Added rating state

  // Generate options for Select components
  const categoriesOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name,
  }));

  const tagsOptions = tags.map(tag => ({
    value: tag._id,
    label: tag.name,
  }));

  // Fetch product details if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProductDetails = async () => {
        try {
          const product = await getProduct(id);
          if (product) {
            setTitle(product.title || '');
            // Removed top-level price and stock
            setDescription(product.description || '');
            setCategory(product.category || '');
            setSelectedTags(
              product.tags.map(tag => ({ value: tag._id, label: tag.name }))
            );
            setDiscountPercentage(
              product.discountPercentage !== undefined
                ? product.discountPercentage.toString()
                : ''
            );
            setBrand(product.brand || '');
            setAccordion(product.accordion || { details: '', shipping: '', returns: '' });
            setProductBG(product.productBG || '');
            setThumbnail(product.thumbnail || '');
            setVariants(
              product.variants && product.variants.length > 0
                ? product.variants.map(variant => ({
                    size: variant.size || '',
                    price: variant.price !== undefined ? variant.price.toString() : '',
                    stock: variant.stock !== undefined ? variant.stock.toString() : '',
                  }))
                : [{ size: '', price: '', stock: '' }]
            );
            setImages(product.images || []);
            setRating(product.rating !== undefined ? product.rating : 0); // Set rating if present
          }
        } catch (error) {
          console.error('Error fetching product details:', error);
          toast.error('Failed to fetch product details');
        }
      };
      fetchProductDetails();
    }
    // eslint-disable-next-line
  }, [isEditMode, id]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: '', stock: '' }]);
  };

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) uploadImages(files);
  };

  const uploadImages = async (files) => {
    setUploading(true);
    try {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const imageUrl = await uploadImage(file);
          return imageUrl;
        })
      );
      setImages([...images, ...uploadedImages]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (
      !title ||
      !description ||
      !category ||
      variants.length === 0 ||
      !discountPercentage ||
      !brand ||
      !accordion.details ||
      !accordion.shipping ||
      !accordion.returns ||
      !productBG ||
      !thumbnail
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Additional validation for variants
    for (const [index, variant] of variants.entries()) {
      if (!variant.size || !variant.price || !variant.stock) {
        toast.error(`Please fill in all fields for variant ${index + 1}`);
        return;
      }
    }

    // Validate rating if present
    if (rating < 0 || rating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }

    // Compute top-level price and stock
    const variantPrices = variants.map(v => parseFloat(v.price));
    const variantStocks = variants.map(v => parseInt(v.stock, 10));

    const computedPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
    const computedStock = variantStocks.length > 0 ? variantStocks.reduce((a, b) => a + b, 0) : 0;

    const payload = {
      title,
      description, // Plain text description
      category,
      tags: selectedTags.map(tag => tag.value),
      discountPercentage: parseFloat(discountPercentage),
      brand,
      accordion,
      productBG,
      thumbnail,
      variants: variants.map(variant => ({
        size: variant.size,
        price: parseFloat(variant.price),
        stock: parseInt(variant.stock, 10),
      })),
      images,
      rating, // Include rating in payload
      price: computedPrice, // Computed top-level price
      stock: computedStock, // Computed top-level stock
    };

    try {
      if (isEditMode) {
        await editProduct(id, payload);
        toast.success('Product updated successfully');
        navigate('/admin/products'); // Use navigate instead of history.push
      } else {
        await addProduct(payload);
        toast.success('Product created successfully');
        navigate('/admin/products'); // Use navigate instead of history.push
      }
    } catch (error) {
      // Error handling is managed in context
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Product Title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Product Description"
            required
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <Select
            options={categoriesOptions}
            value={categoriesOptions.find(cat => cat.value === category) || null}
            onChange={(selectedOption) => setCategory(selectedOption ? selectedOption.value : '')}
            isClearable
            className="mt-1"
            classNamePrefix="react-select"
            placeholder="Select category"
            isLoading={loadingCategories}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <Select
            isMulti
            options={tagsOptions}
            value={selectedTags}
            onChange={setSelectedTags}
            className="react-select-container mt-1"
            classNamePrefix="react-select"
            placeholder="Select tags"
            isLoading={loadingTags}
          />
        </div>

        {/* Discount Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Percentage (%) *</label>
          <input
            type="number"
            step="0.01"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 10"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand *</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Brand Name"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 4.5"
          />
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Accordion Sections</h2>
          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Details *</label>
            <textarea
              value={accordion.details}
              onChange={(e) => setAccordion({ ...accordion, details: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Product details"
              required
            />
          </div>
          {/* Shipping */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Shipping Information *</label>
            <textarea
              value={accordion.shipping}
              onChange={(e) => setAccordion({ ...accordion, shipping: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Shipping details"
              required
            />
          </div>
          {/* Returns */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Returns Policy *</label>
            <textarea
              value={accordion.returns}
              onChange={(e) => setAccordion({ ...accordion, returns: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Returns policy"
              required
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Variants *</h2>
          {variants.map((variant, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Size *</label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Small, Medium, Large"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Variant Price"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Stock *</label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Variant Stock"
                  required
                />
              </div>
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="mt-6 text-red-600 hover:text-red-800"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaPlus className="mr-2" />
            Add Variant
          </button>
        </div>

        {/* Product Background Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Background Image URL *</label>
          <input
            type="text"
            value={productBG}
            onChange={(e) => setProductBG(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/product-bg.jpg"
            required
          />
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail Image URL *</label>
          <input
            type="text"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/thumbnail.jpg"
            required
          />
        </div>

        {/* Additional Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <label className="flex items-center justify-center w-full sm:w-1/3 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition duration-200">
              <span className="text-gray-400 flex flex-col items-center">
                <AiOutlineCloudUpload size={40} className="mb-2" />
                <span className="text-sm">Drag & Drop or Click to Upload</span>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {uploading && (
              <div className="flex items-center space-x-2">
                <ClipLoader size={20} color="#6366F1" />
                <span className="text-sm text-gray-500">Uploading images...</span>
              </div>
            )}
          </div>
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm transition-transform transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className={`inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={uploading}
          >
            {uploading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isEditMode ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
