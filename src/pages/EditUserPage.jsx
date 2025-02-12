// src/pages/EditUserPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../components/Users/UserForm';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';

const EditUserPage = () => {
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

  if (loading) return <p className="text-center py-4 text-lg md:text-xl text-black quantico-regular">Loading user data...</p>;
  if (error) return <p className="text-red-500 text-center mb-4 text-lg md:text-xl quantico-regular">{error}</p>;
  if (!initialData) return <p className="text-center text-xl md:text-2xl text-black quantico-regular">User not found.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Button onClick={() => navigate(-1)} className="mr-4 bg-gray-500 hover:bg-gray-600">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Users
        </Button>
        <h1 className="text-3xl font-bold">Edit User</h1>
      </div>
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
        <UserForm initialData={initialData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditUserPage;
