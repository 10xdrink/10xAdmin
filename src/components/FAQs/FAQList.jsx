// src/components/FAQs/FAQList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';
import HighlightText from '../HighlightText'; // Ensure this component exists
import clsx from 'clsx';

/**
 * FAQList component to display a list of FAQs
 * @param {Object} props - Component props
 * @param {Array} props.faqs - List of FAQs
 * @param {Array} props.selectedFAQIds - Selected FAQ IDs
 * @param {Function} props.handleSelect - Function to handle individual selection
 * @param {Function} props.handleSelectAll - Function to handle selecting all
 * @param {Function} props.onView - Function to view FAQ details
 * @param {Function} props.onEdit - Function to edit an FAQ
 * @param {Function} props.onDelete - Function to delete an FAQ
 * @param {String} props.searchQuery - Current search query
 * @param {String} props.sortField - Current sort field
 * @param {String} props.sortOrder - Current sort order
 * @returns {JSX.Element}
 */
const FAQList = ({
  faqs,
  selectedFAQIds,
  handleSelect,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  searchQuery = '',
  sortField = 'question',
  sortOrder = 'asc',
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedFAQIds.length === faqs.length && faqs.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Question
            </th>
            <th className="py-3 px-6 text-left">
              Answer
            </th>
            <th className="py-3 px-6 text-left">
              Tags
            </th>
            <th className="py-3 px-6 text-left">
              Status
            </th>
            <th className="py-3 px-6 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr
              key={faq._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedFAQIds.includes(faq._id)}
                  onChange={() => handleSelect(faq._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText
                  text={faq.question}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6">
                {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
              </td>
              <td className="py-4 px-6">
                {faq.tags.join(', ')}
              </td>
              <td className="py-4 px-6">
                {faq.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(faq._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(faq._id)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(faq._id)}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {faqs.length === 0 && (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="6">
                No FAQs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

FAQList.propTypes = {
  faqs: PropTypes.array.isRequired,
  selectedFAQIds: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default FAQList;
