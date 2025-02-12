// src/components/FAQs/FAQForm.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useFAQs from '../../hooks/useFAQs';
import Button from '../Common/Button';
import toast from 'react-hot-toast';

/**
 * FAQForm component for creating and editing FAQs
 * @param {Object} props - Component props
 * @param {String|null} props.faqId - ID of the FAQ to edit (null for creating)
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmit - Function to handle form submission
 * @returns {JSX.Element}
 */
const FAQForm = ({ faqId = null, onClose, onSubmit }) => {
  const { createNewFAQ, getFAQ, updateExistingFAQ } = useFAQs();
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    tags: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  // Fetch FAQ data if editing
  useEffect(() => {
    const fetchData = async () => {
      if (faqId) {
        try {
          const data = await getFAQ(faqId);
          if (data && data.data) {
            setFormData({
              question: data.data.question,
              answer: data.data.answer,
              tags: data.data.tags.join(', '),
              isActive: data.data.isActive,
            });
          }
        } catch (err) {
          // Error handled in context
        }
      }
    };
    fetchData();
  }, [faqId, getFAQ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.question.trim()) {
      toast.error('Question is required.');
      return;
    }
    if (!formData.answer.trim()) {
      toast.error('Answer is required.');
      return;
    }

    setLoading(true);

    const payload = {
      question: formData.question.trim(),
      answer: formData.answer.trim(),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isActive: formData.isActive,
    };

    try {
      if (faqId) {
        await updateExistingFAQ(faqId, payload);
      } else {
        await createNewFAQ(payload);
      }
      onSubmit();
    } catch (err) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Question Field */}
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          Question
        </label>
        <input
          type="text"
          name="question"
          id="question"
          value={formData.question}
          onChange={handleChange}
          required
          disabled={!!faqId} // Disable editing question when editing a FAQ
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>

      {/* Answer Field */}
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
          Answer
        </label>
        <textarea
          name="answer"
          id="answer"
          value={formData.answer}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-32"
        ></textarea>
      </div>

      {/* Tags Field */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
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
          {faqId ? 'Update FAQ' : 'Create FAQ'}
        </Button>
      </div>
    </form>
  );
};

FAQForm.propTypes = {
  faqId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FAQForm;
