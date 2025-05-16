// src/pages/BlogListPage.jsx

import React, { useState, useEffect } from 'react';
import BlogList from '../components/Blogs/BlogList';
import PageLoader from '../components/Common/PageLoader';

const BlogListPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your existing loading logic
    const loadBlogs = async () => {
      try {
        // Your blog fetching logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Remove this in production
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  if (loading) {
    return (
      <PageLoader 
        title="Loading Blog Posts" 
        subtitle="Please wait while we fetch blog data..."
      />
    );
  }

  return (
    <div className="p-6">
      <BlogList />
    </div>
  );
};

export default BlogListPage;
