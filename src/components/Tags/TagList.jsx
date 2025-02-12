// src/components/Tags/TagList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Common/Button';
import HighlightText from '../Users/HighlightText';
import clsx from 'clsx';

/**
 * TagList component to display a list of tags
 * @param {Object} props - Component props
 * @param {Array} props.tags - List of tags
 * @param {Array} props.selectedTagIds - Selected tag IDs
 * @param {Function} props.handleSelect - Function to handle individual selection
 * @param {Function} props.handleSelectAll - Function to handle selecting all
 * @param {Function} props.onView - Function to view tag details
 * @param {Function} props.onEdit - Function to edit a tag
 * @param {Function} props.onDelete - Function to delete a tag
 * @param {Function} props.onDeactivate - Function to deactivate a tag
 * @param {Function} props.onActivate - Function to activate a tag
 * @param {String} props.searchQuery - Current search query
 * @param {String} props.sortField - Current sort field
 * @param {String} props.sortOrder - Current sort order
 * @returns {JSX.Element}
 */
const TagList = ({
  tags,
  selectedTagIds,
  handleSelect,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  onActivate,
  searchQuery = '',
  sortField = 'name',
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
                checked={selectedTagIds.length === tags.length && tags.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Name
            </th>
            <th className="py-3 px-6 text-left">
              Description
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
          {tags.map((tag) => (
            <tr
              key={tag._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(tag._id)}
                  onChange={() => handleSelect(tag._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText
                  text={tag.name}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6">
                {tag.description || 'N/A'}
              </td>
              <td className="py-4 px-6">
                {tag.isActive ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(tag._id)}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(tag._id)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Edit
                  </Button>
                  {tag.isActive ? (
                    <Button
                      onClick={() => onDeactivate(tag._id)}
                      className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Deactivate
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onActivate(tag._id)}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    onClick={() => onDelete(tag._id)}
                    className="bg-gradient-to-r from-gray-500 to-gray-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {tags.length === 0 && (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="5">
                No tags found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

TagList.propTypes = {
  tags: PropTypes.array.isRequired,
  selectedTagIds: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeactivate: PropTypes.func.isRequired,
  onActivate: PropTypes.func.isRequired,
  searchQuery: PropTypes.string,
  sortField: PropTypes.string,
  sortOrder: PropTypes.string,
};

export default TagList;
