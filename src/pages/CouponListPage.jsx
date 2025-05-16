// src/pages/CouponListPage.jsx

import React, { useState, useEffect } from 'react';
import CouponList from '../components/Coupons/CouponList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useCoupons from '../hooks/useCoupons';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import CouponDetails from '../components/Coupons/CouponDetails';
import CouponForm from '../components/Coupons/CouponForm';
import Modal from '../components/Common/Modal';
import EnlargedX from '../assets/EnlargedX.png'; // Import the logo image
import PageLoader from '../components/Common/PageLoader';

/**
 * CouponListPage component to display and manage coupons
 * @returns {JSX.Element}
 */
const CouponListPage = () => {
  // Destructure necessary functions and state from useCoupons
  const {
    coupons,
    totalCoupons,
    fetchCoupons,
    loading: contextLoading,
    error,
    deleteExistingCoupon,
    deactivateCoupon,
    activateCoupon,
    updateExistingCoupon,
    createNewCoupon,
    getCoupon,
  } = useCoupons();

  const [selectedCouponIds, setSelectedCouponIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expiredFilter, setExpiredFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortField, setSortField] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');

  // Initialize usePagination with totalCoupons
  const { currentPage, goToPage } = usePagination(Math.ceil(totalCoupons / 10), 1); // Assuming 10 per page

  const [viewingCoupon, setViewingCoupon] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formCouponId, setFormCouponId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch coupons whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchQuery,
      expired: expiredFilter !== '' ? expiredFilter : undefined, // 'true' or 'false'
      active: activeFilter !== '' ? activeFilter : undefined, // 'true' or 'false'
      sortField,
      sortOrder,
    };
    const loadCoupons = async () => {
      try {
        await fetchCoupons(params);
      } catch (error) {
        console.error('Error loading coupons:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCoupons();
  }, [fetchCoupons, currentPage, searchQuery, expiredFilter, activeFilter, sortField, sortOrder]);

  /**
   * Handle selecting a single coupon
   * @param {String} id - Coupon ID
   */
  const handleSelect = (id) => {
    setSelectedCouponIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  /**
   * Handle selecting or deselecting all coupons
   * @param {Boolean} isChecked - Checkbox state
   */
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = coupons.map((cat) => cat._id);
      setSelectedCouponIds(allIds);
    } else {
      setSelectedCouponIds([]);
    }
  };

  /**
   * Handle viewing coupon details
   * @param {String} id - Coupon ID
   */
  const handleView = async (id) => {
    try {
      const data = await getCoupon(id);
      setViewingCoupon(data.data);
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle editing a coupon
   * @param {String} id - Coupon ID
   */
  const handleEdit = (id) => {
    setFormCouponId(id);
    setIsFormModalOpen(true);
  };

  /**
   * Handle deleting a coupon
   * @param {String} id - Coupon ID
   */
  const handleDelete = (id) => {
    setCouponToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handle deactivating a coupon
   * @param {String} id - Coupon ID
   */
  const handleDeactivate = async (id) => {
    try {
      await deactivateCoupon(id);
      toast.success('Coupon deactivated successfully.');
      // Refetch coupons to reflect changes
      fetchCoupons({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        expired: expiredFilter !== '' ? expiredFilter : undefined,
        active: activeFilter !== '' ? activeFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle activating a coupon
   * @param {String} id - Coupon ID
   */
  const handleActivate = async (id) => {
    try {
      await activateCoupon(id);
      toast.success('Coupon activated successfully.');
      // Refetch coupons to reflect changes
      fetchCoupons({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        expired: expiredFilter !== '' ? expiredFilter : undefined,
        active: activeFilter !== '' ? activeFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Confirm deletion of a coupon
   */
  const confirmDelete = async () => {
    try {
      await deleteExistingCoupon(couponToDelete);
      toast.success('Coupon deleted successfully.');
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
      // Refetch coupons to reflect deletion
      fetchCoupons({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        expired: expiredFilter !== '' ? expiredFilter : undefined,
        active: activeFilter !== '' ? activeFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle form submission for creating or editing a coupon
   */
  const handleFormSubmit = async () => {
    // Close the form modal after submission
    setIsFormModalOpen(false);
    setFormCouponId(null);
    // Refetch coupons to reflect changes
    fetchCoupons({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      expired: expiredFilter !== '' ? expiredFilter : undefined,
      active: activeFilter !== '' ? activeFilter : undefined,
      sortField,
      sortOrder,
    });
  };

  /**
   * Handle initiating the creation of a new coupon
   */
  const handleCreate = () => {
    setFormCouponId(null);
    setIsFormModalOpen(true);
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Coupons" 
        subtitle="Please wait while we fetch coupon data..."
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
              COUPONS
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Manage discounts and promotions efficiently!
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
            placeholder="Search by code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Expired Filter */}
          <select
            value={expiredFilter}
            onChange={(e) => setExpiredFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Expiration Statuses</option>
            <option value="true">Expired</option>
            <option value="false">Valid</option>
          </select>

          {/* Active Filter */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Activation Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-shadow"
          >
            Create Coupon
          </Button>
        </div>

        {/* Coupon List */}
        <CouponList
          coupons={coupons}
          selectedCouponIds={selectedCouponIds}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          searchQuery={searchQuery}
          sortField={sortField}
          sortOrder={sortOrder}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCoupons / 10)}
          onPageChange={(page) => {
            goToPage(page);
          }}
        />

        {/* View Coupon Details Modal */}
        {viewingCoupon && (
          <Modal
            isOpen={!!viewingCoupon}
            onClose={() => setViewingCoupon(null)}
            title="Coupon Details"
          >
            <CouponDetails
              coupon={viewingCoupon}
              onClose={() => setViewingCoupon(null)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Modal>
        )}

        {/* Create/Edit Coupon Modal */}
        {isFormModalOpen && (
          <Modal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormCouponId(null);
            }}
            title={formCouponId ? 'Edit Coupon' : 'Create Coupon'}
          >
            <CouponForm
              couponId={formCouponId}
              onClose={() => {
                setIsFormModalOpen(false);
                setFormCouponId(null);
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
              <p>Are you sure you want to permanently delete this coupon? This action cannot be undone.</p>
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

export default CouponListPage;
