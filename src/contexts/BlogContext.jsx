// src/contexts/BlogContext.jsx

import React, { createContext, useState, useCallback } from 'react';
import blogService from '../api/blogService'; // Using absolute import
import toast from 'react-hot-toast';

const BlogContext = createContext();

/**
 * BlogProvider component to wrap around parts of the app that need blog data.
 */
export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all blog posts with optional filters.
   * @param {Object} params - Query parameters for filtering, pagination, sorting.
   */
  const fetchBlogs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAllBlogs(params);
      setBlogs(data.data);
      setTotalBlogs(data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch blog posts.');
      toast.error(err.message || 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a single blog post by ID.
   * @param {String} id - Blog post ID.
   * @returns {Object} - Blog post data.
   */
  const getBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogById(id);
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch blog post.');
      toast.error(err.message || 'Failed to fetch blog post.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new blog post.
   * @param {Object} blogData - Data for the new blog post.
   */
  const createBlog = useCallback(async (blogData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.createBlog(blogData);
      setBlogs((prev) => [data.data, ...prev]);
      setTotalBlogs((prev) => prev + 1);
      toast.success(data.message || 'Blog post created successfully.');
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to create blog post.');
      toast.error(err.message || 'Failed to create blog post.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing blog post.
   * @param {String} id - Blog post ID.
   * @param {Object} blogData - Updated data for the blog post.
   */
  const updateBlog = useCallback(async (id, blogData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.updateBlog(id, blogData);
      setBlogs((prev) =>
        prev.map((blog) => (blog._id === id ? data.data : blog))
      );
      toast.success(data.message || 'Blog post updated successfully.');
      return data.data;
    } catch (err) {
      setError(err.message || 'Failed to update blog post.');
      toast.error(err.message || 'Failed to update blog post.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a blog post.
   * @param {String} id - Blog post ID.
   */
  const deleteBlog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      setTotalBlogs((prev) => prev - 1);
      toast.success(data.message || 'Blog post deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete blog post.');
      toast.error(err.message || 'Failed to delete blog post.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Upload an image for a blog post.
   * @param {File} file - Image file to upload.
   * @returns {String} - URL of the uploaded image.
   */
  const uploadImage = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.uploadBlogImage(file);
      toast.success(data.message || 'Image uploaded successfully.');
      return data.data.imageUrl;
    } catch (err) {
      setError(err.message || 'Failed to upload image.');
      toast.error(err.message || 'Failed to upload image.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        totalBlogs,
        loading,
        error,
        fetchBlogs,
        getBlogById,
        createBlog,
        updateBlog,
        deleteBlog,
        uploadImage,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
