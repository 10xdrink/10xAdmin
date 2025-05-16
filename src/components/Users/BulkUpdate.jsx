// src/components/Users/BulkUpdate.jsx

import React, { useState } from 'react';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import { useUsers } from '../../contexts/UserContext';
import { USER_ROLES } from '../../utils/constants';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const BulkUpdate = ({ selectedUserIds, onBulkUpdate }) => {
  const { exportUsers } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Action States
  const [newRole, setNewRole] = useState('');
  const [statusAction, setStatusAction] = useState(''); // 'activate' or 'deactivate'
  const [isDelete, setIsDelete] = useState(false);

  // Confirmation State for Deletion
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSubmit = async () => {
    const actions = [];

    if (newRole) {
      actions.push({
        action: 'changeRole',
        data: {
          role: newRole,
        },
      });
    }

    if (statusAction) {
      actions.push({
        action: 'changeStatus',
        data: {
          isActive: statusAction === 'activate',
        },
      });
    }

    if (isDelete) {
      actions.push({
        action: 'deleteUsers',
      });
    }

    if (actions.length === 0) {
      toast.error('Please select at least one action to perform.');
      return;
    }

    try {
      await onBulkUpdate({
        userIds: selectedUserIds,
        actions: actions,
      });
      // Optionally, perform additional actions like refetching users
    } catch (error) {
      console.error('bulkUpdateUsers error:', error);
      // The error is already handled in the context with toasts
    }

    // Reset States
    setIsModalOpen(false);
    setNewRole('');
    setStatusAction('');
    setIsDelete(false);
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    handleSubmit();
    setIsConfirmOpen(false);
  };

  const cancelDelete = () => {
    setIsConfirmOpen(false);
  };

  // Handle Export Selected Users
  const handleExportSelected = async () => {
    try {
      await exportUsers("csv", selectedUserIds);
      toast.success("Selected users exported successfully.");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)} 
        disabled={selectedUserIds.length === 0}
        className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
        Bulk Update
      </Button>

      {/* Bulk Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Bulk Update Users">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Change Role Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Change Role</h3>
            <div className="relative">
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">-- Select New Role --</option>
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role}>
                    {role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Change Status Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Change Status</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="relative flex items-center p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-purple-500 transition-all duration-200">
                <input
                  type="radio"
                  name="status"
                  value="activate"
                  checked={statusAction === 'activate'}
                  onChange={() => setStatusAction('activate')}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${statusAction === 'activate' ? 'border-purple-600' : 'border-gray-400'}`}>
                  {statusAction === 'activate' && (
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Activate</span>
                  <p className="text-xs text-gray-500 mt-1">Enable user accounts</p>
                </div>
              </label>
              
              <label className="relative flex items-center p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-purple-500 transition-all duration-200">
                <input
                  type="radio"
                  name="status"
                  value="deactivate"
                  checked={statusAction === 'deactivate'}
                  onChange={() => setStatusAction('deactivate')}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${statusAction === 'deactivate' ? 'border-purple-600' : 'border-gray-400'}`}>
                  {statusAction === 'deactivate' && (
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Deactivate</span>
                  <p className="text-xs text-gray-500 mt-1">Suspend user accounts</p>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Delete Users Section */}
          <motion.div
            variants={itemVariants}
            className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"
          >
            <label className="flex items-start cursor-pointer group">
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  checked={isDelete}
                  onChange={(e) => setIsDelete(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded ${isDelete ? 'bg-red-600' : 'bg-white border-2 border-gray-300 group-hover:border-red-500'} transition-all duration-200`}>
                  {isDelete && (
                    <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="ml-3">
                <span className="font-medium text-red-700">Delete Selected Users</span>
                <p className="text-sm text-red-600 mt-1">
                  This action cannot be undone and will permanently remove the selected users.
                </p>
              </div>
            </label>
          </motion.div>

          {/* Export Selected Users */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Export Selected Users</h3>
            <Button
              onClick={handleExportSelected}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export
            </Button>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end gap-3 pt-4 border-t border-gray-200"
          >
            <Button 
              onClick={() => setIsModalOpen(false)} 
              className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium shadow hover:shadow-lg transition-all duration-200"
            >
              Update
            </Button>
          </motion.div>
        </motion.div>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      {isConfirmOpen && (
        <Modal isOpen={isConfirmOpen} onClose={cancelDelete} title="Confirm Deletion">
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-red-50 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center">Delete Selected Users</h3>
            <p className="text-gray-600 text-center">
              Are you sure you want to delete the selected users? 
              <br />This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <Button 
                onClick={cancelDelete} 
                className="px-6 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow hover:shadow-lg transition-all duration-200"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BulkUpdate;
