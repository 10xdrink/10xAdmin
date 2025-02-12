// components/Blogs/CreateBlogPage.jsx

import React from 'react';
import BlogForm from './BlogForm';
import useBlogs from '../../hooks/useBlogs';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

const CreateBlogPage = () => {
  const { createBlog } = useBlogs();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Navigate after successful creation
    navigate('/admin/blogs');
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={() => navigate('/admin/blogs')} className="bg-gray-500 hover:bg-gray-600">
          Back to Blogs
        </Button>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md ">
        {/* <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1> */}
        <BlogForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateBlogPage;
