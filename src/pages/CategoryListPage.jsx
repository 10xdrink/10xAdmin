// src/pages/CategoryListPage.jsx

import React, { useState, useEffect } from 'react';
import CategoryList from '../components/Categories/CategoryList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useCategories from '../hooks/useCategories'; // Ensure correct relative path
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import CategoryDetails from '../components/Categories/CategoryDetails';
import CategoryForm from '../components/Categories/CategoryForm';
import Modal from '../components/Common/Modal';

/**
 * CategoryListPage component to display and manage categories
 * @returns {JSX.Element}
 */
const CategoryListPage = () => {
  // Destructure totalPages from useCategories
  const {
    categories,
    fetchCategories,
    loading,
    error,
    deleteCategory,
    updateCategory,
    createCategory,
    getCategoryById,
    totalPages, // Now correctly defined
  } = useCategories(); // Ensure useCategories is correctly imported and provided

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Initialize usePagination with totalPages
  const { currentPage, goToPage } = usePagination(totalPages, 1); // Initialize with 1

  const [viewingCategory, setViewingCategory] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formCategoryId, setFormCategoryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchQuery,
      type: typeFilter || undefined, // Send 'undefined' if empty
      sortField,
      sortOrder,
    };
    const fetchData = async () => {
      try {
        await fetchCategories(params);
      } catch (err) {
        toast.error(`Error fetching categories: ${err.message}`);
      }
    };
    fetchData();
  }, [fetchCategories, currentPage, searchQuery, typeFilter, sortField, sortOrder]);

  /**
   * Handle selecting a single category
   * @param {String} id - Category ID
   */
  const handleSelect = (id) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  /**
   * Handle selecting or deselecting all categories
   * @param {Boolean} isChecked - Checkbox state
   */
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = categories.map((cat) => cat._id);
      setSelectedCategoryIds(allIds);
    } else {
      setSelectedCategoryIds([]);
    }
  };

  /**
   * Handle viewing category details
   * @param {String} id - Category ID
   */
  const handleView = async (id) => {
    try {
      const data = await getCategoryById(id);
      setViewingCategory(data.data);
    } catch (err) {
      toast.error(`Failed to view category: ${err.message}`);
    }
  };

  /**
   * Handle editing a category
   * @param {String} id - Category ID
   */
  const handleEdit = (id) => {
    setFormCategoryId(id);
    setIsFormModalOpen(true);
  };

  /**
   * Handle deleting a category
   * @param {String} id - Category ID
   */
  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirm deletion of a category
   */
  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete);
      toast.success('Category deleted successfully.');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      // Refetch categories to reflect deletion
      fetchCategories({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        type: typeFilter || undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      toast.error(`Failed to delete category: ${err.message}`);
    }
  };

  /**
   * Handle form submission for creating or editing a category
   */
  const handleFormSubmit = async () => {
    // Close the form modal after submission
    setIsFormModalOpen(false);
    setFormCategoryId(null);
    // Refetch categories to reflect changes
    fetchCategories({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      type: typeFilter || undefined,
      sortField,
      sortOrder,
    });
  };

  /**
   * Handle initiating the creation of a new category
   */
  const handleCreate = () => {
    setFormCategoryId(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="product">Product</option>
          <option value="blog">Blog</option>
        </select>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Create Category
        </Button>
      </div>

      {/* Category List */}
      <CategoryList
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={searchQuery}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages} // Now correctly defined
        onPageChange={(page) => {
          goToPage(page);
        }}
      />

      {/* View Category Details Modal */}
      {viewingCategory && (
        <Modal
          isOpen={!!viewingCategory}
          onClose={() => setViewingCategory(null)}
          title="Category Details"
        >
          <CategoryDetails
            category={viewingCategory}
            onClose={() => setViewingCategory(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Modal>
      )}

      {/* Create/Edit Category Modal */}
      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setFormCategoryId(null);
          }}
          title={formCategoryId ? 'Edit Category' : 'Create Category'}
        >
          <CategoryForm
            categoryId={formCategoryId}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormCategoryId(null);
            }}
            onSubmit={handleFormSubmit}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
        >
          <div className="space-y-4">
            <p>Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await confirmDelete();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CategoryListPage;
