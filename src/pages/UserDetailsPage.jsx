// src/pages/UserDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDetails from '../components/Users/UserDetails';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';
import ResetPasswordModal from '../components/Modals/ResetPasswordModal'; // Import the modal

const UserDetailsPage = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const navigate = useNavigate();
  const {
    getUserById,
    changeUserStatus,
    resetUserPassword,
    getUserActivity,
    getUserAuditLogs,
    getUserMetrics, // Assume this fetches Product Purchased Count and Login Frequency
  } = useUsers();
  const [user, setUser] = useState(null);
  const [activity, setActivity] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    productPurchasedCount: 0,
    loginFrequency: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user details, activity, audit logs, and metrics on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id) {
          throw new Error('User ID is missing.');
        }
        const fetchedUser = await getUserById(id);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          throw new Error('User data is unavailable.');
        }

        const userActivity = await getUserActivity(id);
        setActivity(userActivity);

        const userAuditLogs = await getUserAuditLogs(id);
        setAuditLogs(userAuditLogs);

        const userMetrics = await getUserMetrics(id);
        setMetrics(userMetrics);
      } catch (err) {
        setError(err.message || 'Error fetching user data.');
        toast.error(`Error fetching user data: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById, getUserActivity, getUserAuditLogs, getUserMetrics]);

  // Handle editing the user
  const handleEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  // Handle activating/deactivating the user
  const handleDeactivate = async () => {
    try {
      await changeUserStatus(id, !user.isActive);
      setUser({ ...user, isActive: !user.isActive });
      toast.success(`User has been ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
    } catch (err) {
      toast.error(`Failed to change user status: ${err}`);
    }
  };

  // Handle opening the reset password modal
  const handleOpenResetPasswordModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the reset password modal
  const handleCloseResetPasswordModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p className="text-center py-4 text-lg md:text-xl text-black quantico-regular">Loading user details...</p>;
  if (error) return <p className="text-red-500 text-center mb-4 text-lg md:text-xl quantico-regular">{error}</p>;
  if (!user) return <p className="text-center text-xl md:text-2xl text-black quantico-regular">User not found.</p>;

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back to Users
      </Button>
      <UserDetails
        user={user}
        metrics={metrics}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        onResetPassword={handleOpenResetPasswordModal}
      />
      {/* Additional Sections */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {activity.length === 0 ? (
            <p className="text-gray-700">No recent activity.</p>
          ) : (
            <ul className="list-disc list-inside">
              {activity.map((act, index) => (
                <li key={index} className="text-gray-700">
                  {act.description} on {new Date(act.date).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Audit Logs */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Audit Logs</h3>
          {auditLogs.length === 0 ? (
            <p className="text-gray-700">No audit logs available.</p>
          ) : (
            <ul className="list-disc list-inside">
              {auditLogs.map((log, index) => (
                <li key={index} className="text-gray-700">
                  {log.action} by {log.admin} on {new Date(log.date).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseResetPasswordModal}
        userId={user._id}
        userName={user.name}
      />
    </div>
  );
};

export default UserDetailsPage;
