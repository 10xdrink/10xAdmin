// src/components/Categories/CategoryForm.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useCategories from '../../hooks/useCategories';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

/**
 * CategoryForm component for creating and editing categories
 * @param {Object} props - Component props
 * @param {String|null} props.categoryId - ID of the category to edit (null for creating)
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element}
 */
const CategoryForm = ({ categoryId = null, onClose, onSubmit }) => {
  const { createCategory, updateCategory, getCategoryById, fetchCategories } = useCategories();
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    description: '',
    parent: '',
    isActive: true,
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch category data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        try {
          const data = await getCategoryById(categoryId);
          if (data && data.data) {
            setFormData({
              name: data.data.name,
              type: data.data.type,
              description: data.data.description || '',
              parent: data.data.parent ? data.data.parent._id : '',
              isActive: data.data.isActive,
            });
          }
        } catch (err) {
          toast.error('Failed to fetch category details.');
        }
      }
    };
    fetchData();
  }, [categoryId, getCategoryById]);

  // Fetch parent categories based on type
  useEffect(() => {
    const fetchParentCategories = async () => {
      try {
        const params = { type: formData.type };
        const data = await fetchCategories(params);
        setParentCategories(data.data);
      } catch (err) {
        toast.error('Failed to fetch parent categories.');
      }
    };
    fetchParentCategories();
  }, [formData.type, fetchCategories]);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      parent: formData.parent || null,
      isActive: formData.isActive,
    };

    try {
      if (categoryId) {
        await updateCategory(categoryId, payload);
        toast.success('Category updated successfully.');
      } else {
        await createCategory(payload);
        toast.success('Category created successfully.');
      }
      onSubmit();
    } catch (err) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Type Field */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="product">Product</option>
          <option value="blog">Blog</option>
        </select>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          rows="3"
        ></textarea>
      </div>

      {/* Parent Category Field */}
      <div>
        <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
          Parent Category
        </label>
        <select
          name="parent"
          id="parent"
          value={formData.parent}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="">No Parent</option>
          {parentCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* isActive Checkbox */}
      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          {categoryId ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  categoryId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CategoryForm;
