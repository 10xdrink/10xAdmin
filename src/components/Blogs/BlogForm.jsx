// src/components/Blogs/BlogForm.jsx

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import useBlogs from '../../hooks/useBlogs';
import useCategories from '../../hooks/useCategories';
import useTags from '../../hooks/useTags';
import Button from '../Common/Button';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaImage, FaTimes } from 'react-icons/fa';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ClipLoader } from 'react-spinners'; // For loading spinner
import { Transition } from '@headlessui/react'; // For animations

const BlogForm = ({ initialData = null, onSubmit }) => {
  const isEditMode = Boolean(initialData);
  const { createBlog, updateBlog, uploadImage } = useBlogs();
  const { categories, fetchCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { tags, fetchTags, loading: tagsLoading, error: tagsError } = useTags();

  // State variables
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [status, setStatus] = useState('draft');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const quillRef = useRef(null);

  // Fetch categories and tags on mount
  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (tags.length === 0) fetchTags();
  }, [fetchCategories, fetchTags, categories.length, tags.length]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setSelectedCategories(
        initialData.categories.map(cat => ({ value: cat._id, label: cat.name }))
      );
      setSelectedTags(
        initialData.tags.map(tag => ({ value: tag._id, label: tag.name }))
      );
      setStatus(initialData.status || 'draft');
      setImages(initialData.images || []);
    }
  }, [isEditMode, initialData]);

  // Handle title change
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    if (errors.title) setErrors(prev => ({ ...prev, title: null }));
  }, [errors.title]);

  // Handle content change
  const handleContentChange = useCallback((value) => {
    setContent(value);
    if (errors.content) setErrors(prev => ({ ...prev, content: null }));
  }, [errors.content]);

  // Handle category change
  const handleCategoryChange = useCallback((selectedOptions) => {
    setSelectedCategories(selectedOptions);
    if (errors.categories) setErrors(prev => ({ ...prev, categories: null }));
  }, [errors.categories]);

  // Handle tag change
  const handleTagChange = useCallback((selectedOptions) => {
    setSelectedTags(selectedOptions);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback((e) => {
    setStatus(e.target.value);
  }, []);

  // Handle image file selection
  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    if (files.length > 0) setUploading(true);
  }, []);

  // Handle image upload
  useEffect(() => {
    const uploadImages = async () => {
      if (imageFiles.length === 0) {
        setUploading(false);
        return;
      }

      try {
        const uploadedImages = await Promise.all(
          imageFiles.map(file => uploadImage(file))
        );
        setImages(prev => [...prev, ...uploadedImages]);
        setImageFiles([]);
        setUploading(false);
      } catch (error) {
        console.error('Image upload failed:', error);
        setUploading(false);
        // Optionally, set error state
      }
    };

    uploadImages();
  }, [imageFiles, uploadImage]);

  // Handle image removal
  const handleRemoveImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Prepare options for Select components
  const categoryOptions = useMemo(() => {
    return categories.map(cat => ({ value: cat._id, label: cat.name }));
  }, [categories]);

  const tagOptions = useMemo(() => {
    return tags.map(tag => ({ value: tag._id, label: tag.name }));
  }, [tags]);

  // Handle image insertion from ReactQuill
  const handleImageInsert = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setUploading(true);
        try {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);

          // Save the current selection range
          const savedRange = range ? { index: range.index, length: range.length } : null;

          const imageUrl = await uploadImage(file);

          if (savedRange) {
            // Restore the selection range before inserting the image
            quill.setSelection(savedRange.index, savedRange.length);
            quill.insertEmbed(savedRange.index, 'image', imageUrl);
            quill.setSelection(savedRange.index + 1);
          } else {
            quill.insertEmbed(quill.getLength(), 'image', imageUrl);
          }
        } catch (err) {
          // Handle error (optional)
          console.error('Image upload failed:', err);
        } finally {
          setUploading(false);
        }
      }
    };
  }, [uploadImage]);

  // Validate form fields
  const validate = useCallback(() => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    if (selectedCategories.length === 0) newErrors.categories = 'At least one category must be selected.';
    return newErrors;
  }, [title, content, selectedCategories]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setUploading(true);

    try {
      const finalData = {
        title,
        content,
        categories: selectedCategories.map(option => option.value),
        tags: selectedTags.map(option => option.value),
        status,
        images,
      };

      if (isEditMode) {
        await updateBlog(initialData._id, finalData);
      } else {
        await createBlog(finalData);
      }

      setSuccessMessage(isEditMode ? 'Blog post updated successfully!' : 'Blog post created successfully!');
      onSubmit();
    } catch (err) {
      console.error('Blog creation/update failed:', err);
      // Optionally, set error state
    } finally {
      setUploading(false);
    }
  }, [title, content, selectedCategories, selectedTags, status, images, isEditMode, initialData, createBlog, updateBlog, onSubmit, validate]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 transform translate-x-1/2 translate-y-1/2"></div>

      {/* Success Message */}
      <Transition
        show={successMessage !== ''}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {successMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
      </Transition>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center uppercase">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="relative">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
            placeholder="Enter blog title"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Content */}
        <div className="relative">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['link', 'image'],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  ['clean']
                ],
                handlers: {
                  image: handleImageInsert
                }
              }
            }}
            formats={[
              'header',
              'bold', 'italic', 'underline', 'strike', 'blockquote',
              'list', 'bullet',
              'link', 'image',
              'size'
            ]}
            className={`h-64 rounded-lg ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
          />
          {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
        </div>

        {/* Categories */}
        <div className="">
          <label htmlFor="categories" className="block text-sm font-semibold text-gray-700 mb-2 mt-14">
            Categories <span className="text-red-500">*</span>
          </label>
          <Select
            id="categories"
            isMulti
            options={categoryOptions}
            value={selectedCategories}
            onChange={handleCategoryChange}
            classNamePrefix="react-select"
            placeholder="Select categories"
            className={`mt-1 ${errors.categories ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.categories && <p className="mt-2 text-sm text-red-600">{errors.categories}</p>}
        </div>

        {/* Tags */}
        <div className="relative">
          <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
            Tags
          </label>
          <Select
            id="tags"
            isMulti
            options={tagOptions}
            value={selectedTags}
            onChange={handleTagChange}
            classNamePrefix="react-select"
            placeholder="Select tags"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Image Uploader */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
            <label className="flex items-center justify-center w-full sm:w-1/3 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition duration-200">
              <span className="text-gray-400 flex flex-col items-center">
                <AiOutlineCloudUpload size={40} className="mb-2" />
                <span className="text-[10px]">Drag & Drop or Click to Upload</span>
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {uploading && (
              <div className="flex items-center space-x-2">
                <ClipLoader size={20} color="#6366F1" />
                <span className="text-sm text-gray-500">Uploading image...</span>
              </div>
            )}
          </div>
          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Blog Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm transition-transform transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            type="submit"
            className={`inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={uploading}
          >
            {uploading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isEditMode ? 'Update Blog Post' : 'Create Blog Post'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
