// src/pages/TagListPage.jsx

import React, { useState, useEffect } from 'react';
import TagList from '../components/Tags/TagList';
import Pagination from '../components/Common/Pagination';
import Button from '../components/Common/Button';
import useTags from '../hooks/useTags';
import usePagination from '../hooks/usePagination';
import toast from 'react-hot-toast';
import TagDetails from '../components/Tags/TagDetails';
import TagForm from '../components/Tags/TagForm';
import Modal from '../components/Common/Modal';

/**
 * TagListPage component to display and manage tags
 * @returns {JSX.Element}
 */
const TagListPage = () => {
  // Destructure necessary functions and state from useTags
  const {
    tags,
    totalTags,
    fetchTags,
    loading,
    error,
    deleteExistingTag,
    activateTag,
    permanentDeleteExistingTag, // Destructure here
    getTag, // Make sure to destructure getTag
  } = useTags();

  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Initialize usePagination with totalTags
  const { currentPage, goToPage } = usePagination(Math.ceil(totalTags / 10), 1); // Assuming 10 per page

  const [viewingTag, setViewingTag] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formTagId, setFormTagId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  // Fetch tags whenever dependencies change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      search: searchQuery,
      isActive: isActiveFilter !== '' ? isActiveFilter : undefined, // 'true' or 'false'
      sortField,
      sortOrder,
    };
    const fetchData = async () => {
      try {
        await fetchTags(params);
      } catch (err) {
        // Error handled in context
      }
    };
    fetchData();
  }, [fetchTags, currentPage, searchQuery, isActiveFilter, sortField, sortOrder]);

  /**
   * Handle selecting a single tag
   * @param {String} id - Tag ID
   */
  const handleSelect = (id) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  /**
   * Handle selecting or deselecting all tags
   * @param {Boolean} isChecked - Checkbox state
   */
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = tags.map((tag) => tag._id);
      setSelectedTagIds(allIds);
    } else {
      setSelectedTagIds([]);
    }
  };

  /**
   * Handle viewing tag details
   * @param {String} id - Tag ID
   */
  const handleView = async (id) => {
    try {
      const data = await getTag(id);
      setViewingTag(data.data);
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle editing a tag
   * @param {String} id - Tag ID
   */
  const handleEdit = (id) => {
    setFormTagId(id);
    setIsFormModalOpen(true);
  };

  /**
   * Handle deleting a tag (permanent deletion)
   * @param {String} id - Tag ID
   */
  const handleDelete = (id) => {
    setTagToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Handle deactivating a tag
   * @param {String} id - Tag ID
   */
  const handleDeactivate = async (id) => {
    try {
      await deleteExistingTag(id); // Use deleteExistingTag for deactivation
      toast.success('Tag deactivated successfully.');
      // Refetch tags to reflect changes
      fetchTags({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        isActive: isActiveFilter !== '' ? isActiveFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle activating a tag
   * @param {String} id - Tag ID
   */
  const handleActivate = async (id) => {
    try {
      await activateTag(id);
      toast.success('Tag activated successfully.');
      // Refetch tags to reflect changes
      fetchTags({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        isActive: isActiveFilter !== '' ? isActiveFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Confirm permanent deletion of a tag
   */
  const confirmDelete = async () => {
    try {
      await permanentDeleteExistingTag(tagToDelete); // Use permanentDeleteExistingTag for permanent deletion
      toast.success('Tag permanently deleted successfully.');
      setIsDeleteModalOpen(false);
      setTagToDelete(null);
      // Refetch tags to reflect deletion
      fetchTags({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        isActive: isActiveFilter !== '' ? isActiveFilter : undefined,
        sortField,
        sortOrder,
      });
    } catch (err) {
      // Error handled in context
    }
  };

  /**
   * Handle form submission for creating or editing a tag
   */
  const handleFormSubmit = async () => {
    // Close the form modal after submission
    setIsFormModalOpen(false);
    setFormTagId(null);
    // Refetch tags to reflect changes
    fetchTags({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      isActive: isActiveFilter !== '' ? isActiveFilter : undefined,
      sortField,
      sortOrder,
    });
  };

  /**
   * Handle initiating the creation of a new tag
   */
  const handleCreate = () => {
    setFormTagId(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tag Management</h1>

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

        {/* Active Filter */}
        <select
          value={isActiveFilter}
          onChange={(e) => setIsActiveFilter(e.target.value)}
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
          Create Tag
        </Button>
      </div>

      {/* Tag List */}
      <TagList
        tags={tags}
        selectedTagIds={selectedTagIds}
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
        totalPages={Math.ceil(totalTags / 10)}
        onPageChange={(page) => {
          goToPage(page);
        }}
      />

      {/* View Tag Details Modal */}
      {viewingTag && (
        <Modal
          isOpen={!!viewingTag}
          onClose={() => setViewingTag(null)}
          title="Tag Details"
        >
          <TagDetails
            tag={viewingTag}
            onClose={() => setViewingTag(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Modal>
      )}

      {/* Create/Edit Tag Modal */}
      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setFormTagId(null);
          }}
          title={formTagId ? 'Edit Tag' : 'Create Tag'}
        >
          <TagForm
            tagId={formTagId}
            onClose={() => {
              setIsFormModalOpen(false);
              setFormTagId(null);
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
            <p>Are you sure you want to permanently delete this tag? This action cannot be undone.</p>
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

export default TagListPage;
