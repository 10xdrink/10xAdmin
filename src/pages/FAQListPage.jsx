// src/pages/FAQListPage.jsx

import React, { useState, useEffect } from 'react';
import FAQList from '../components/FAQs/FAQList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useFAQs from '../hooks/useFAQs';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import FAQDetails from '../components/FAQs/FAQDetails';
import FAQForm from '../components/FAQs/FAQForm';
import Modal from '../components/Common/Modal';

/**
 * FAQListPage component to display and manage FAQs
 * @returns {JSX.Element}
 */
const FAQListPage = () => {
  // Destructure necessary functions and state from useFAQs
  const {
    faqs,
    totalFAQs,
    fetchFAQs,
    loading,
    error,
    deleteExistingFAQ,
    updateExistingFAQ,
    createNewFAQ,
    getFAQ,
  } = useFAQs();

  const [selectedFAQIds, setSelectedFAQIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('question');
  const [sortOrder, setSortOrder] = useState('asc');

  // Initialize usePagination with totalFAQs
  const { currentPage, goToPage } = usePagination(Math.ceil(totalFAQs / 10), 1); // Assuming 10 per page

  const [viewingFAQ, setViewingFAQ] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formFAQId, setFormFAQId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);

  // Fetch FAQs whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchQuery,
      sortField,
      sortOrder,
    };
    const fetchData = async () => {
      try {
        await fetchFAQs(params);
      } catch (err) {
        // Error handled in context
      }
    };
    fetchData();
  }, [fetchFAQs, currentPage, searchQuery, sortField, sortOrder]);

  /**
   * Handle selecting a single FAQ
   * @param {String} id - FAQ ID
   */
  const handleSelect = (id) => {
    setSelectedFAQIds((prev) =>
      prev.includes(id) ? prev.filter((faqId) => faqId !== id) : [...prev, id]
    );
  };

  /**
   * Handle selecting or deselecting all FAQs
   * @param {Boolean} isChecked - Checkbox state
   */
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = faqs.map((faq) => faq._id);
      setSelectedFAQIds(allIds);
    } else {
      setSelectedFAQIds([]);
    }
  };

  /**
   * Handle viewing FAQ details
   * @param {String} id - FAQ ID
   */
  const handleView = async (id) => {
    try {
      const data = await getFAQ(id);
      setViewingFAQ(data.data);
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle editing a FAQ
   * @param {String} id - FAQ ID
   */
  const handleEdit = (id) => {
    setFormFAQId(id);
    setIsFormModalOpen(true);
  };

  /**
   * Handle deleting a FAQ
   * @param {String} id - FAQ ID
   */
  const handleDelete = (id) => {
    setFaqToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirm deletion of a FAQ
   */
  const confirmDelete = async () => {
    try {
      await deleteExistingFAQ(faqToDelete);
      toast.success('FAQ deleted successfully.');
      setIsDeleteModalOpen(false);
      setFaqToDelete(null);
      // Refetch FAQs to reflect deletion
      fetchFAQs({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle form submission for creating or editing a FAQ
   */
  const handleFormSubmit = async () => {
    // Close the form modal after submission
    setIsFormModalOpen(false);
    setFormFAQId(null);
    // Refetch FAQs to reflect changes
    fetchFAQs({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      sortField,
      sortOrder,
    });
  };

  /**
   * Handle initiating the creation of a new FAQ
   */
  const handleCreate = () => {
    setFormFAQId(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">FAQ Management</h1>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by question"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sortField" className="text-sm font-medium text-gray-700">
            Sort By:
          </label>
          <select
            id="sortField"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="question">Question</option>
            <option value="createdAt">Created At</option>
            <option value="updatedAt">Updated At</option>
          </select>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Create FAQ
        </Button>
      </div>

      {/* FAQ List */}
      <FAQList
        faqs={faqs}
        selectedFAQIds={selectedFAQIds}
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
        totalPages={Math.ceil(totalFAQs / 10)}
        onPageChange={(page) => {
          goToPage(page);
        }}
      />

      {/* View FAQ Details Modal */}
      {viewingFAQ && (
        <Modal
          isOpen={!!viewingFAQ}
          onClose={() => setViewingFAQ(null)}
          title="FAQ Details"
        >
          <FAQDetails
            faq={viewingFAQ}
            onClose={() => setViewingFAQ(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Modal>
      )}

      {/* Create/Edit FAQ Modal */}
      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setFormFAQId(null);
          }}
          title={formFAQId ? 'Edit FAQ' : 'Create FAQ'}
        >
          <FAQForm
            faqId={formFAQId}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormFAQId(null);
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
            <p>Are you sure you want to delete this FAQ? This action cannot be undone.</p>
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

export default FAQListPage;
