// src/pages/EditUserPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#A467F7]"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Button onClick={() => navigate(-1)} className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          Go Back
        </Button>
      </div>
    </div>
  );
  
  if (!initialData) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
        <div className="text-yellow-500 text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Not Found</h2>
        <Button onClick={() => navigate(-1)} className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          Go Back
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-gray-50 min-h-screen flex justify-center"
    >
      <div className="w-full max-w-2xl">
        <motion.div variants={itemVariants} className="mb-6">
        <Button
          onClick={() => navigate('/users')}
          className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all duration-300 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Users
        </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] p-4">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <FiUser className="mr-2" />
              Edit User
            </h3>
          </div>
          <div className="p-6">
            <UserForm initialData={initialData} onSubmit={handleSubmit} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditUserPage;
