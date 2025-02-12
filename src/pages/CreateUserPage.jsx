// src/pages/CreateUserPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../components/Users/UserForm';
import useUsers from '../hooks/useUsers';
import toast from 'react-hot-toast';
import Button from '../components/Common/Button';

const CreateUserPage = () => {
  const { createUser } = useUsers(); // Access the createUser function from UserContext
  const navigate = useNavigate(); // For navigation after successful creation

  /**
   * Handle form submission for creating a new user.
   * @param {FormData} formData - The data submitted from the UserForm.
   */
  const handleSubmit = async (formData) => {
    try {
      await createUser(formData); // Call the createUser function with form data
      toast.success('User created successfully!');
      navigate('/users'); // Redirect to the user list page
    } catch (error) {
      toast.error(`Error creating user: ${error}`);
      console.error('Error creating user:', error);
      // Additional error handling can be implemented here if needed
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <Button onClick={() => navigate(-1)} className="mr-4 bg-gray-500 hover:bg-gray-600">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Users
        </Button>
        <h1 className="text-3xl font-bold">Create New User</h1>
      </div>
      <div className="max-w-lg mx-auto bg-white shadow-md rounded-md p-6">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateUserPage;
