// src/pages/BulkUpdatePage.jsx

import React, { useState } from 'react';
import BulkUpdate from '../components/Users/BulkUpdate';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';

const BulkUpdatePage = () => {
  const { bulkUpdateUsers, fetchUsers } = useUsers();
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Handle bulk update action
  const handleBulkUpdate = async (updates) => {
    try {
      await bulkUpdateUsers(updates);
      toast.success('Bulk update successful.');
      setSelectedUserIds([]);
      // Optionally, refetch users or update the state
      fetchUsers();
    } catch (err) {
      toast.error(`Bulk update failed: ${err}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bulk Update Users</h1>
      <BulkUpdate
        selectedUserIds={selectedUserIds}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  );
};

export default BulkUpdatePage;
