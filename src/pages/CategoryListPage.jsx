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
import EnlargedX from '../assets/EnlargedX.png'; // Import the logo image
import PageLoader from '../components/Common/PageLoader';

/**
 * CategoryListPage component to display and manage categories
 * @returns {JSX.Element}
 */
const CategoryListPage = () => {
  // Rename the context loading to contextLoading
  const { categories, totalCategories, loading: contextLoading, error, fetchCategories } = useCategories();
  
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Initialize usePagination with totalPages
  const { currentPage, goToPage } = usePagination(totalCategories, 1); // Initialize with 1

  const [viewingCategory, setViewingCategory] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formCategoryId, setFormCategoryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories(params);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, [fetchCategories]);

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

  if (isLoading || contextLoading) {
    return (
      <PageLoader 
        title="Loading Categories" 
        subtitle="Please wait while we fetch category data..."
      />
    );
  }

  return (
    <div>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              CATEGORIES
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Organize your products and content efficiently!
            </p>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 h-32 overflow-hidden items-center justify-end mr-24">
            <img
              className="w-32 object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-10"
              src={EnlargedX}
              alt="10X Logo"
            />
          </div>
        </div>
      </div>
      
      <div className="p-6">
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
          totalPages={totalCategories} // Now correctly defined
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
    </div>
  );
};

export default CategoryListPage;
