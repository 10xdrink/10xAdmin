// src/components/Tags/TagForm.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useTags from '../../hooks/useTags';
import Button from '../Common/Button';

/**
 * TagForm component for creating or editing a tag
 * @param {Object} props - Component props
 * @param {String|null} props.tagId - Tag ID for editing, null for creating
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element}
 */
const TagForm = ({ tagId, onClose, onSubmit }) => {
  const { getTag, createNewTag, updateExistingTag } = useTags();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tagId) {
      const fetchTag = async () => {
        setLoading(true);
        try {
          const data = await getTag(tagId);
          setFormData({
            name: data.data.name,
            description: data.data.description || '',
            isActive: data.data.isActive,
          });
        } catch (err) {
          // Error handled in context
        } finally {
          setLoading(false);
        }
      };
      fetchTag();
    }
  }, [tagId, getTag]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tagId) {
        await updateExistingTag(tagId, formData);
      } else {
        await createNewTag(formData);
      }
      onSubmit(); // Notify parent to refresh data
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={!!tagId} // Disable editing name when editing a tag to prevent duplicates
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      {tagId && (
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Active</label>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

TagForm.propTypes = {
  tagId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

TagForm.defaultProps = {
  tagId: null,
};

export default TagForm;
