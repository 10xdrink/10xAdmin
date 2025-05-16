// components/Blogs/BlogDetails.jsx

import React from 'react';
import { formatDate } from '../../utils/helpers';
import Button from '../Common/Button';

const BlogDetails = ({ blog, onClose, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{blog.title}</h2>
      <p className="text-gray-600">
        By {blog.author ? blog.author.name : 'Unknown'} on {formatDate(blog.createdAt)}
      </p>
      <div className="space-y-2">
        <p>{blog.content}</p>
      </div>
      <div>
        <h3 className="font-semibold">Categories:</h3>
        <p>{blog.categories.map(cat => cat.name).join(', ')}</p>
      </div>
      <div>
        <h3 className="font-semibold">Tags:</h3>
        <p>{blog.tags.map(tag => tag.name).join(', ')}</p>
      </div>
      <div>
        <h3 className="font-semibold">Status:</h3>
        <span
          className={`px-3 py-1 rounded-full text-white text-sm ${
            blog.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        >
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </span>
      </div>
      <div className="flex space-x-2 mt-4">
        <Button
          onClick={onEdit}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Edit
        </Button>
        <Button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BlogDetails;
