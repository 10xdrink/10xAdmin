// components/Blogs/EditBlogPage.jsx

import React, { useEffect, useState } from 'react';
import BlogForm from './BlogForm';
import useBlogs from '../../hooks/useBlogs';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../Common/Button';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, updateBlog } = useBlogs();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogById(id);
        setInitialData(blog);
      } catch (err) {
        toast.error('Failed to fetch blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [getBlogById, id]);

  const handleSubmit = async () => {
    // Navigate after successful update
    navigate('/admin/blogs');
  };

  if (loading) return <p>Loading blog post...</p>;

  if (!initialData) return <p>Blog post not found.</p>;

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button onClick={() => navigate('/admin/blogs')} className="bg-gray-500 hover:bg-gray-600">
          Back to Blogs
        </Button>
      </div>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md">
        {/* <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1> */}
        <BlogForm initialData={initialData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default EditBlogPage;
