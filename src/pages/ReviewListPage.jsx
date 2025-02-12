// src/pages/ReviewListPage.jsx

import React, { useEffect, useState } from 'react';
import ReviewList from '../components/Reviews/ReviewList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useReviews from '../hooks/useReviews';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import ReviewDetails from '../components/Reviews/ReviewDetails';
import ReviewForm from '../components/Reviews/ReviewForm';
import Modal from '../components/Common/Modal';

/**
 * ReviewListPage component to display and manage reviews
 * @returns {JSX.Element}
 */
const ReviewListPage = () => {
  // Destructure necessary functions and state from useReviews
  const {
    reviews,
    totalReviews,
    fetchReviews,
    loading,
    error,
    updateExistingReview,
    deleteExistingReview,
    getReview,
  } = useReviews();

  const [selectedReviewIds, setSelectedReviewIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isApprovedFilter, setIsApprovedFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Initialize usePagination with totalReviews
  const { currentPage, goToPage } = usePagination(Math.ceil(totalReviews / 10), 1); // Assuming 10 per page

  const [viewingReview, setViewingReview] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formReviewId, setFormReviewId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Fetch reviews whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      product: searchQuery, // Assuming search by product ID; adjust as needed
      isApproved: isApprovedFilter !== '' ? isApprovedFilter : undefined, // 'true' or 'false'
      sortField,
      sortOrder,
    };
    const fetchData = async () => {
      try {
        await fetchReviews(params);
      } catch (err) {
        // Error handled in context
      }
    };
    fetchData();
  }, [fetchReviews, currentPage, searchQuery, isApprovedFilter, sortField, sortOrder]);

  /**
   * Handle selecting a single review
   * @param {String} id - Review ID
   */
  const handleSelect = (id) => {
    setSelectedReviewIds((prev) =>
      prev.includes(id) ? prev.filter((reviewId) => reviewId !== id) : [...prev, id]
    );
  };

  /**
   * Handle selecting or deselecting all reviews
   * @param {Boolean} isChecked - Checkbox state
   */
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = reviews.map((review) => review._id);
      setSelectedReviewIds(allIds);
    } else {
      setSelectedReviewIds([]);
    }
  };

  /**
   * Handle viewing review details
   * @param {String} id - Review ID
   */
  const handleView = async (id) => {
    try {
      const data = await getReview(id);
      setViewingReview(data.data);
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle approving/rejecting a review
   * @param {String} id - Review ID
   * @param {Boolean} isApproved - Approval status
   * @param {String} comment - Optional comment
   */
  const handleUpdate = (id, isApproved) => {
    setFormReviewId(id);
    setIsFormModalOpen(true);
  };

  /**
   * Handle deleting a review
   * @param {String} id - Review ID
   */
  const handleDelete = (id) => {
    setReviewToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirm approval/rejection of a review
   */
  const confirmUpdate = async (isApproved, comment) => {
    try {
      await updateExistingReview(formReviewId, { isApproved, comment });
      setIsFormModalOpen(false);
      setFormReviewId(null);
      // Optionally refetch reviews
      fetchReviews({
        page: currentPage,
        limit: 10,
        product: searchQuery,
        isApproved: isApprovedFilter !== '' ? isApprovedFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Confirm deletion of a review
   */
  const confirmDelete = async () => {
    try {
      await deleteExistingReview(reviewToDelete);
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
      // Optionally refetch reviews
      fetchReviews({
        page: currentPage,
        limit: 10,
        product: searchQuery,
        isApproved: isApprovedFilter !== '' ? isApprovedFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle initiating the creation of a new review (if applicable)
   */
  const handleCreate = () => {
    // Implement if admin can create reviews
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reviews Management</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Product Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Approval Status Filter */}
        <select
          value={isApprovedFilter}
          onChange={(e) => setIsApprovedFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Approval Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>

        {/* Create Button (Optional) */}
        {/* <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
        >
          Create Review
        </Button> */}
      </div>

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        selectedReviewIds={selectedReviewIds}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        onView={handleView}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalReviews / 10)}
        onPageChange={(page) => {
          goToPage(page);
        }}
      />

      {/* View Review Details Modal */}
      {viewingReview && (
        <Modal
          isOpen={!!viewingReview}
          onClose={() => setViewingReview(null)}
          title="Review Details"
        >
          <ReviewDetails
            review={viewingReview}
            onClose={() => setViewingReview(null)}
          />
        </Modal>
      )}

      {/* Approve/Reject Review Modal */}
      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setFormReviewId(null);
          }}
          title="Update Review Status"
        >
          <ReviewForm
            onSubmit={confirmUpdate}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormReviewId(null);
            }}
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
            <p>Are you sure you want to delete this review? This action cannot be undone.</p>
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

export default ReviewListPage;
