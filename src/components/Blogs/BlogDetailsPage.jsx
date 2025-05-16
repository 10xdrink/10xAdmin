// components/Blogs/BlogDetailsPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogDetails from './BlogDetails';
import useBlogs from '../../hooks/useBlogs';
import toast from 'react-hot-toast';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBlogById, deleteBlog } = useBlogs();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await getBlogById(id);
        setBlog(fetchedBlog);
      } catch (err) {
        setError(err.message || 'Failed to fetch blog post.');
        toast.error(err.message || 'Failed to fetch blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [getBlogById, id]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBlog(id);
      toast.success('Blog post deleted successfully.');
      navigate('/admin/blogs');
    } catch (err) {
      toast.error('Failed to delete blog post.');
    }
  };

  if (loading) return <p>Loading blog post...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!blog) return <p>Blog post not found.</p>;

  return (
    <div className="p-6">
      <Button onClick={() => navigate('/admin/blogs')} className="mb-4 bg-gray-500 hover:bg-gray-600">
        Back to Blogs
      </Button>
      <BlogDetails
        blog={blog}
        onEdit={() => navigate(`/admin/blogs/edit/${blog._id}`)}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
        >
          <div className="space-y-4">
            <p>Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
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

export default BlogDetailsPage;