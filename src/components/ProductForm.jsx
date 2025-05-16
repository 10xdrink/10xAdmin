// src/components/ProductForm.jsx

import React, { useEffect, useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { FaTimes, FaPlus, FaArrowRight, FaArrowLeft, FaCheck, FaInfoCircle, FaTag, FaBoxOpen, FaImage, FaClipboardList, FaEdit } from 'react-icons/fa';
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

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Step validation states
  const [stepsValidation, setStepsValidation] = useState({
    1: false, // Basic Info
    2: false, // Details
    3: false, // Variants
    4: false, // Images
    5: false  // Review
  });

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
  const [packaging, setPackaging] = useState([]);
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

  // Navigation functions
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    // Add validation logic for each step
    if (currentStep === 1) {
      // Validate basic info
      if (!title.trim()) {
        toast.error('Product title is required');
        return false;
      }
      if (!description.trim()) {
        toast.error('Product description is required');
        return false;
      }
      if (!category) {
        toast.error('Please select a category');
        return false;
      }
      if (!brand.trim()) {
        toast.error('Brand name is required');
        return false;
      }
      setStepsValidation({ ...stepsValidation, 1: true });
    } else if (currentStep === 2) {
      // Validate product details
      if (!accordion.details.trim() || accordion.details.trim().length < 10) {
        toast.error('Product details must be at least 10 characters long');
        return false;
      }
      if (!accordion.shipping.trim() || accordion.shipping.trim().length < 10) {
        toast.error('Shipping information must be at least 10 characters long');
        return false;
      }
      if (!accordion.returns.trim() || accordion.returns.trim().length < 10) {
        toast.error('Returns policy must be at least 10 characters long');
        return false;
      }
      if (packaging.length === 0) {
        toast.error('Please select at least one packaging option');
        return false;
      }
      setStepsValidation({ ...stepsValidation, 2: true });
    } else if (currentStep === 3) {
      // Validate variants
      if (variants.length === 0) {
        toast.error('At least one variant is required');
        return false;
      }
      
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        if (!variant.size.trim()) {
          toast.error(`Size/Option is required for variant ${i + 1}`);
          return false;
        }
        if (!variant.price || isNaN(parseFloat(variant.price)) || parseFloat(variant.price) <= 0) {
          toast.error(`Valid price is required for variant ${i + 1}`);
          return false;
        }
        if (!variant.stock || isNaN(parseInt(variant.stock)) || parseInt(variant.stock) < 0) {
          toast.error(`Valid stock quantity is required for variant ${i + 1}`);
          return false;
        }
      }
      setStepsValidation({ ...stepsValidation, 3: true });
    } else if (currentStep === 4) {
      // Validate images
      if (!productBG.trim()) {
        toast.error('Product background image URL is required');
        return false;
      }
      if (!thumbnail.trim()) {
        toast.error('Thumbnail image URL is required');
        return false;
      }
      // Additional images are optional
      setStepsValidation({ ...stepsValidation, 4: true });
    } else if (currentStep === 5) {
      // Review step - all validations should be done in previous steps
      setStepsValidation({ ...stepsValidation, 5: true });
    }
    
    return true;
  };

  // USD to INR conversion (using a fixed rate for simplicity)
  const convertToINR = (usdPrice) => {
    // Using an approximate conversion rate of 1 USD = 83 INR
    const conversionRate = 83;
    return parseFloat(usdPrice) * conversionRate;
  };

  // Convert INR back to USD for API submission
  const convertToUSD = (inrPrice) => {
    // Using an approximate conversion rate of 1 USD = 83 INR
    const conversionRate = 83;
    return parseFloat(inrPrice) / conversionRate;
  };

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
            setPackaging(product.packaging || []);
            setVariants(
              product.variants && product.variants.length > 0
                ? product.variants.map(variant => ({
                    size: variant.size || '',
                    price: variant.price !== undefined ? convertToINR(variant.price).toString() : '',
                    stock: variant.stock !== undefined ? variant.stock.toString() : '',
                  }))
                : [{ size: '', price: '', stock: '' }]
            );
            setImages(product.images || []);
            setRating(product.rating !== undefined ? product.rating : 0); // Set rating if present
            
            // Validate all steps when loading an existing product
            setStepsValidation({
              1: true,
              2: true,
              3: true,
              4: true,
              5: false // Review step is only valid after submission
            });
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

    // Validate all steps before submission
    for (let step = 1; step <= 4; step++) {
      setCurrentStep(step);
      if (!validateCurrentStep()) {
        return;
      }
    }
    
    // Set back to review step
    setCurrentStep(5);

    // Compute top-level price and stock
    const variantPrices = variants.map(v => parseFloat(v.price));
    const variantStocks = variants.map(v => parseInt(v.stock, 10));

    const computedPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : 0;
    const computedStock = variantStocks.length > 0 ? variantStocks.reduce((a, b) => a + b, 0) : 0;

    // Ensure accordion has all required fields
    const validAccordion = {
      details: accordion.details || 'Product details information',
      shipping: accordion.shipping || 'Shipping information',
      returns: accordion.returns || 'Returns policy information'
    };

    const payload = {
      title,
      description: description || '', 
      category,
      tags: selectedTags.map(tag => tag.value),
      discountPercentage: parseFloat(discountPercentage) || 0,
      brand,
      accordion: validAccordion,
      productBG,
      thumbnail,
      packaging,
      variants: variants.map(variant => ({
        size: variant.size || 'Default',
        price: convertToUSD(parseFloat(variant.price)) || 0,
        stock: parseInt(variant.stock, 10) || 0,
      })),
      images: images.length > 0 ? images : [thumbnail], // Ensure at least one image
      rating: parseFloat(rating) || 0, // Ensure rating is a number
      price: computedPrice, // Computed top-level price
      stock: computedStock, // Computed top-level stock
      isActive: true // Default to active
    };

    try {
      if (isEditMode) {
        await editProduct(id, payload);
        toast.success('Product updated successfully');
        navigate('/admin/products');
      } else {
        await addProduct(payload);
        toast.success('Product created successfully');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    }
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, title: 'Basic Info', icon: <FaInfoCircle /> },
      { number: 2, title: 'Details', icon: <FaClipboardList /> },
      { number: 3, title: 'Variants', icon: <FaTag /> },
      { number: 4, title: 'Images', icon: <FaImage /> },
      { number: 5, title: 'Review', icon: <FaCheck /> }
    ];
    
    return (
      <div className="flex justify-between items-center mb-8 px-4 py-6 bg-white rounded-lg shadow-md">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = stepsValidation[step.number];
          const isClickable = step.number <= currentStep || stepsValidation[step.number - 1];
          
          return (
            <div 
              key={step.number}
              className={`flex flex-col items-center ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              onClick={() => isClickable && goToStep(step.number)}
            >
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-all duration-300 ${isActive 
                  ? 'bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white scale-110 shadow-lg' 
                  : isCompleted 
                    ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white' 
                    : 'bg-gray-200 text-gray-500'}`}
              >
                {step.icon}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-[#0821D2] quantico-bold-italic' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
        
        {/* Progress Bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0821D2] to-[#0B0B45]" 
            style={{ width: `${(currentStep - 1) * 25}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Step Indicators */}
      {renderStepIndicators()}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Content Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-300">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0821D2] quantico-bold-italic">Basic Product Information</h2>
                <p className="text-gray-600 pt-sans-regular">Enter the core details about your product</p>
              </div>
              
              {/* Title */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Product Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Enter product title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Product Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full h-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Describe your product in detail"
                  required
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Category *</label>
                <Select
                  options={categoriesOptions}
                  value={categoriesOptions.find(cat => cat.value === category) || null}
                  onChange={(selectedOption) => setCategory(selectedOption ? selectedOption.value : '')}
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select a category"
                  isLoading={loadingCategories}
                  required
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#D1D5DB',
                      boxShadow: 'none',
                      padding: '4px',
                      '&:hover': {
                        borderColor: '#0821D2'
                      }
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#0821D2' : state.isFocused ? '#EEF2FF' : null,
                      color: state.isSelected ? 'white' : '#111827'
                    })
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Tags</label>
                <Select
                  isMulti
                  options={tagsOptions}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select relevant tags"
                  isLoading={loadingTags}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#D1D5DB',
                      boxShadow: 'none',
                      padding: '4px',
                      '&:hover': {
                        borderColor: '#0821D2'
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#EEF2FF'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected ? '#0821D2' : state.isFocused ? '#EEF2FF' : null,
                      color: state.isSelected ? 'white' : '#111827'
                    })
                  }}
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Brand *</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Discount Percentage (%) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="e.g., 10"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-2">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="e.g., 4.5"
                />
              </div>
            </div>
          )}

          {/* Step 2: Product Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0821D2] quantico-bold-italic">Product Details</h2>
                <p className="text-gray-600 pt-sans-regular">Add detailed information about your product</p>
              </div>
              
              {/* Details */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2]">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Product Details *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">Include information about ingredients, features, and benefits</p>
                <textarea
                  value={accordion.details}
                  onChange={(e) => setAccordion({ ...accordion, details: e.target.value })}
                  className="block w-full h-40 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Describe product details, ingredients, and features"
                  required
                />
              </div>
              
              {/* Shipping */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Shipping Information *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">Include shipping times, carriers, and any shipping restrictions</p>
                <textarea
                  value={accordion.shipping}
                  onChange={(e) => setAccordion({ ...accordion, shipping: e.target.value })}
                  className="block w-full h-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Describe shipping options, delivery times, and any restrictions"
                  required
                />
              </div>
              
              {/* Returns */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Returns Policy *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">Include return window, conditions, and process</p>
                <textarea
                  value={accordion.returns}
                  onChange={(e) => setAccordion({ ...accordion, returns: e.target.value })}
                  className="block w-full h-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="Describe your returns policy, conditions, and process"
                  required
                />
              </div>
              
              {/* Packaging */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Packaging Options *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">Select available packaging options for this product</p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 text-sm">
                  <p className="font-medium text-blue-700"><FaInfoCircle className="inline mr-1" /> Note: Only Bottle, Box, and Canister are supported packaging options.</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Bottle', 'Box', 'Canister'].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`packaging-${option}`}
                        checked={packaging.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPackaging([...packaging, option]);
                          } else {
                            setPackaging(packaging.filter(item => item !== option));
                          }
                        }}
                        className="h-5 w-5 text-[#0821D2] rounded border-gray-300 focus:ring-[#0821D2]"
                      />
                      <label htmlFor={`packaging-${option}`} className="ml-2 text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                

                
                {/* Selected packaging display */}
                {packaging.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selected Packaging:</label>
                    <div className="flex flex-wrap gap-2">
                      {packaging.map((item, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {item}
                          <button 
                            type="button" 
                            onClick={() => {
                              // Remove the item from packaging array
                              setPackaging(packaging.filter(pkg => pkg !== item));
                            }}
                            className="ml-1.5 text-blue-600 hover:text-blue-800"
                          >
                            <FaTimes size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Variants */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0821D2] quantico-bold-italic">Product Variants</h2>
                <p className="text-gray-600 pt-sans-regular">Add size, price, and stock information for each variant</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2] mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-[#0821D2] quantico-bold-italic">Variants *</h3>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="flex items-center bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg transition-shadow"
                  >
                    <FaPlus className="mr-2" /> Add Variant
                  </button>
                </div>
                
                <div className="space-y-6">
                  {variants.map((variant, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-200 relative">
                      <div className="absolute top-3 right-3">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                            title="Remove Variant"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-medium mb-4 quantico-bold-italic text-gray-800">
                        Variant {index + 1}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Size/Option *</label>
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                            placeholder="e.g., Small, Medium, Large"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Price (₹) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                            placeholder="Variant Price"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-base font-medium text-gray-700 mb-2">Stock *</label>
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                            placeholder="Available Stock"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0821D2] quantico-bold-italic">Product Images</h2>
                <p className="text-gray-600 pt-sans-regular">Add product images to showcase your product</p>
              </div>
              
              {/* Product Background Image */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2] mb-6">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Product Background Image URL *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">This image will be used as the main background on the product page</p>
                <input
                  type="text"
                  value={productBG}
                  onChange={(e) => setProductBG(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="https://example.com/product-bg.jpg"
                  required
                />
                {productBG && (
                  <div className="mt-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm font-medium mb-2 text-gray-700">Preview:</p>
                    <img 
                      src={productBG} 
                      alt="Background Preview" 
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                    />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Image */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 mb-6">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Thumbnail Image URL *</label>
                <p className="text-sm text-gray-600 mb-3 pt-sans-regular">This image will be used as the product thumbnail in listings</p>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0821D2] focus:border-[#0821D2] transition-colors"
                  placeholder="https://example.com/thumbnail.jpg"
                  required
                />
                {thumbnail && (
                  <div className="mt-4 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm font-medium mb-2 text-gray-700">Preview:</p>
                    <div className="flex justify-center">
                      <img 
                        src={thumbnail} 
                        alt="Thumbnail Preview" 
                        className="h-40 object-contain rounded-lg"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+Image+URL'}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Images */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <label className="block text-lg font-medium text-gray-800 quantico-bold-italic mb-3">Additional Images</label>
                <p className="text-sm text-gray-600 mb-4 pt-sans-regular">Upload additional product images to show different angles and details</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6">
                  <label className="flex items-center justify-center w-full sm:w-1/2 h-48 border-2 border-dashed border-[#0821D2] rounded-lg cursor-pointer hover:bg-blue-50 transition duration-200">
                    <span className="text-[#0821D2] flex flex-col items-center p-4">
                      <AiOutlineCloudUpload size={50} className="mb-3" />
                      <span className="text-base font-medium quantico-bold-italic">Drag & Drop or Click to Upload</span>
                      <span className="text-sm text-gray-600 mt-1">Supports: JPG, PNG, WebP (Max 5MB)</span>
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
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 mt-4 sm:mt-0">
                      <ClipLoader size={24} color="#0821D2" />
                      <span className="ml-3 text-[#0821D2] font-medium">Uploading images...</span>
                    </div>
                  )}
                </div>
                
                {/* Image Previews */}
                {images.length > 0 ? (
                  <div>
                    <h4 className="text-base font-medium text-gray-800 mb-3">Uploaded Images ({images.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                          <img
                            src={img}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg transition-transform transform group-hover:scale-105"
                            onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+Image'}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                            title="Remove Image"
                          >
                            <FaTimes size={14} />
                          </button>
                          <p className="text-xs text-center mt-2 text-gray-500">Image {index + 1}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No additional images uploaded yet</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-[#0821D2] quantico-bold-italic">Review & Submit</h2>
                <p className="text-gray-600 pt-sans-regular">Review all product information before submission</p>
              </div>
              
              <div className="space-y-8">
                {/* Basic Info Review */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border-l-4 border-[#0821D2]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#0821D2] quantico-bold-italic">Basic Information</h3>
                    <button 
                      type="button" 
                      onClick={() => goToStep(1)}
                      className="text-[#0821D2] hover:text-blue-700 flex items-center text-sm font-medium"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Title</p>
                      <p className="font-medium">{title || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Brand</p>
                      <p className="font-medium">{brand || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-medium">{category || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Discount</p>
                      <p className="font-medium">{discountPercentage || '0'}%</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="font-medium">{description || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Packaging Review */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-green-700 quantico-bold-italic">Packaging Options</h3>
                    <button 
                      type="button" 
                      onClick={() => goToStep(2)}
                      className="text-green-700 hover:text-green-900 flex items-center text-sm font-medium"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                  
                  {packaging.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {packaging.map((item, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-red-500">No packaging options selected</p>
                  )}
                </div>
                
                {/* Variants Review */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-indigo-700 quantico-bold-italic">Variants ({variants.length})</h3>
                    <button 
                      type="button" 
                      onClick={() => goToStep(3)}
                      className="text-indigo-700 hover:text-indigo-900 flex items-center text-sm font-medium"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size/Option</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {variants.map((variant, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">{variant.size || 'N/A'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">₹{parseFloat(variant.price).toFixed(2) || '0.00'}</td>
                            <td className="px-4 py-3 whitespace-nowrap">{variant.stock || '0'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Images Review */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-purple-700 quantico-bold-italic">Product Images</h3>
                    <button 
                      type="button" 
                      onClick={() => goToStep(4)}
                      className="text-purple-700 hover:text-purple-900 flex items-center text-sm font-medium"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Background Image</p>
                      {productBG ? (
                        <img 
                          src={productBG} 
                          alt="Background" 
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'}
                        />
                      ) : (
                        <p className="text-red-500">Not provided</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Thumbnail</p>
                      {thumbnail ? (
                        <img 
                          src={thumbnail} 
                          alt="Thumbnail" 
                          className="w-full h-32 object-contain rounded-lg border border-gray-200"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+Image+URL'}
                        />
                      ) : (
                        <p className="text-red-500">Not provided</p>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">Additional Images ({images.length})</p>
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {images.slice(0, 4).map((img, index) => (
                        <img 
                          key={index}
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/100x100?text=Invalid+Image'}
                        />
                      ))}
                      {images.length > 4 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 h-24">
                          <p className="text-gray-500 font-medium">+{images.length - 4} more</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No additional images</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-colors quantico-bold-italic"
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="flex items-center px-6 py-3 ml-auto bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow quantico-bold-italic"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className={`flex items-center px-8 py-3 ml-auto bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white rounded-lg shadow-md hover:shadow-lg transition-shadow quantico-bold-italic ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={uploading}
              >
                {uploading ? (
                  <>
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
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" /> {isEditMode ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
