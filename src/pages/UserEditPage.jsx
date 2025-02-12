// src/pages/UserEditPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../components/Users/UserForm';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';

const UserEditPage = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const navigate = useNavigate();
  const { getUserById, updateUser } = useUsers();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) {
          throw new Error('User ID is missing.');
        }
        const userResponse = await getUserById(id);
        if (userResponse) {
          setInitialData(userResponse);
        } else {
          throw new Error('User data is unavailable.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching user data.');
        toast.error(`Error fetching user data: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getUserById]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await updateUser(id, formData);
      toast.success('User updated successfully.');
      navigate(`/users/${id}`);
    } catch (err) {
      toast.error(`Failed to update user: ${err}`);
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!initialData) return <p>User not found.</p>;

  return (
    <div className="p-6">
      <Button onClick={() => navigate(-1)} className="mb-4">
        Back to Users
      </Button>
      <UserForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default UserEditPage;
