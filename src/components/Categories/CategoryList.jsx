// src/components/Categories/CategoryList.jsx

import React from 'react';
import Button from '../Common/Button';
import HighlightText from '../HighlightText';
import clsx from 'clsx';

const CategoryList = ({
  categories,
  selectedCategoryIds,
  handleSelect,
  handleSelectAll,
  onView,
  onEdit,
  onDelete,
  searchQuery,
  sortField,
  sortOrder,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedCategoryIds.length === categories.length && categories.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </th>
            <th className="py-3 px-6 text-left cursor-pointer">
              Name
            </th>
            <th className="py-3 px-6 text-left">
              Type
            </th>
            <th className="py-3 px-6 text-left">
              Description
            </th>
            <th className="py-3 px-6 text-left">
              Parent
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
          {categories.map((category) => (
            <tr
              key={category._id}
              className="border-b hover:bg-gray-100"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(category._id)}
                  onChange={() => handleSelect(category._id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>

              <td className="py-4 px-6">
                <HighlightText
                  text={category.name}
                  highlight={searchQuery}
                />
              </td>
              <td className="py-4 px-6 capitalize">
                {category.type}
              </td>
              <td className="py-4 px-6">
                {category.description}
              </td>
              <td className="py-4 px-6">
                {category.parent ? (
                  category.parent.name ? (
                    <span>{category.parent.name}</span>
                  ) : (
                    'N/A'
                  )
                ) : (
                  'N/A'
                )}
              </td>
              <td className="py-4 px-6">
                {category.isActive ? 'Active' : 'Inactive'}
              </td>
              <td className="py-4 px-6">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onView(category._id)}
                    className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow"
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => onEdit(category._id)}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(category._id)}
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 shadow-lg quantico-bold-italic text-[14px] hover:shadow-xl transition-shadow"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td className="py-4 px-6 text-center" colSpan="7">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
