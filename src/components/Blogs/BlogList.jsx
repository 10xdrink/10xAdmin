// src/components/Blogs/BlogList.jsx

import React, { useState, useMemo, useCallback, useEffect } from "react";
import HighlightText from "../Users/HighlightText";
import { formatDate } from "../../utils/helpers";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import Select from "react-select";
import useCategories from "../../hooks/useCategories";
import useTags from "../../hooks/useTags";
import useBlogs from "../../hooks/useBlogs";
import Papa from "papaparse"; // For CSV export
import toast, { Toaster } from "react-hot-toast";
import { debounce } from "lodash";
import Modal from "../Common/Modal";
import BlogDetails from "./BlogDetails";
import Pagination from "../Common/Pagination";
import EnlargedX from "../../assets/EnlargedX.png"; // Ensure the path is correct

const BlogList = () => {
  const navigate = useNavigate();
  const { blogs, totalBlogs, loading, error, fetchBlogs, deleteBlog } =
    useBlogs();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { tags, loading: tagsLoading, error: tagsError } = useTags();

  // State variables
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingBlog, setViewingBlog] = useState(null);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on search
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  // Prepare options for Select components
  const statusOptions = useMemo(
    () => [
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
    ],
    []
  );

  const tagOptions = useMemo(() => {
    return tags.map((tag) => ({ value: tag._id, label: tag.name }));
  }, [tags]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({ value: cat._id, label: cat.name }));
  }, [categories]);

  // Filter blogs based on search and selected filters
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus
        ? blog.status === selectedStatus.value
        : true;

      const matchesTags =
        selectedTags.length > 0
          ? selectedTags.every((tag) =>
              blog.tags.some((blogTag) => blogTag._id === tag.value)
            )
          : true;

      const matchesCategories =
        selectedCategories.length > 0
          ? selectedCategories.every((cat) =>
              blog.categories.some((blogCat) => blogCat._id === cat.value)
            )
          : true;

      return matchesSearch && matchesStatus && matchesTags && matchesCategories;
    });
  }, [blogs, searchQuery, selectedStatus, selectedTags, selectedCategories]);

  // Handlers
  const handleSelect = useCallback((id) => {
    setSelectedBlogIds((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        const allIds = filteredBlogs.map((blog) => blog._id);
        setSelectedBlogIds(allIds);
      } else {
        setSelectedBlogIds([]);
      }
    },
    [filteredBlogs]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this blog post?"))
        return;
      try {
        await deleteBlog(id);
        toast.success("Blog post deleted successfully.");
        // Optionally, refetch blogs or remove the deleted blog from the state
      } catch (err) {
        toast.error("Failed to delete blog post.");
      }
    },
    [deleteBlog]
  );

  const handleView = useCallback((id) => {
    setViewingBlog(id);
  }, []);

  const handleEdit = useCallback(
    (id) => {
      navigate(`/admin/blogs/edit/${id}`);
    },
    [navigate]
  );

  const handleExport = useCallback(() => {
    if (filteredBlogs.length === 0) {
      toast.error("No blogs to export.");
      return;
    }

    const dataToExport = filteredBlogs.map((blog) => ({
      Title: blog.title,
      Author: blog.author ? blog.author.name : "N/A",
      Categories: blog.categories.map((cat) => cat.name).join(", "),
      Tags: blog.tags.map((tag) => tag.name).join(", "),
      Status: blog.status,
      "Created At": formatDate(blog.createdAt),
      "Last Updated": blog.updatedAt ? formatDate(blog.updatedAt) : "N/A",
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "blogs_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Blogs exported successfully.");
  }, [filteredBlogs]);

  // Fetch blogs whenever filters or pagination changes
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      status: selectedStatus ? selectedStatus.value : undefined,
      category:
        selectedCategories.map((cat) => cat.value).join(",") || undefined,
      tags: selectedTags.map((tag) => tag.value).join(",") || undefined,
      sortField,
      sortOrder,
      search: searchQuery || undefined,
    };
    const fetchData = async () => {
      try {
        await fetchBlogs(params);
        setTotalPages(Math.ceil(totalBlogs / 10));
      } catch (err) {
        toast.error("Failed to fetch blogs.");
      }
    };
    fetchData();
  }, [
    fetchBlogs,
    currentPage,
    selectedStatus,
    selectedCategories,
    selectedTags,
    sortField,
    sortOrder,
    searchQuery,
    totalBlogs,
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toaster for toast notifications */}
      <Toaster position="top-right" />

      {/* Top Banner */}
      <div className="main-div bg-gradient-to-r from-[#A467F7] to-[#4C03CB] flex flex-col md:flex-row items-center">
        <div className="left-col px-6 py-12 md:px-20 md:py-28 w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-6xl md:text-8xl lg:text-9xl quantico-bold-italic text-white text-center md:text-left">
            Blogs
          </h1>
          <p className="text-white pt-sans-regular text-xl md:text-2xl mt-4 text-center md:text-left">
            Manage your blog posts efficiently!
          </p>
        </div>
        <div className="right-col hidden md:flex w-full md:w-1/2 h-48 md:h-[400px] overflow-hidden items-center justify-center mt-6 md:mt-0">
          <img
            className="w-44 md:w-[360px] object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-20 md:hover:-translate-y-96"
            src={EnlargedX}
            alt="Enlarged"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-start py-10 md:py-20">
        <div className="w-full px-4 md:px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by title or content..."
              onChange={handleSearchChange}
              className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 quantico-regular"
            />

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {/* Status Filter */}
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                isClearable
                placeholder="Filter by Status"
                className="w-full md:w-48 quantico-regular"
              />

              {/* Tags Filter */}
              <Select
                options={tagOptions}
                value={selectedTags}
                onChange={setSelectedTags}
                isMulti
                isClearable
                placeholder="Filter by Tags"
                className="w-full md:w-64 quantico-regular"
              />

              {/* Categories Filter */}
              <Select
                options={categoryOptions}
                value={selectedCategories}
                onChange={setSelectedCategories}
                isMulti
                isClearable
                placeholder="Filter by Categories"
                className="w-full md:w-64 quantico-regular"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={handleExport}
                className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-2 rounded-md quantico-bold-italic hover:shadow-lg transition-shadow flex items-center"
              >
                <i className="fa-solid fa-file-export mr-2"></i> Export Blogs
              </Button>
              <Button
                onClick={() => navigate("/admin/blogs/create")}
                className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-2 rounded-md quantico-bold-italic hover:shadow-lg transition-shadow flex items-center"
              >
                <i className="fa-solid fa-plus mr-2"></i> Create Blog
              </Button>
            </div>
          </div>

          {/* Loading and Error States */}
          {categoriesLoading || tagsLoading || loading ? (
            <div className="text-center py-4 text-lg md:text-xl text-black quantico-regular">
              Loading...
            </div>
          ) : categoriesError || tagsError || error ? (
            <div className="text-red-500 text-center mb-4 text-lg md:text-xl quantico-regular">
              {categoriesError || tagsError || error}
            </div>
          ) : (
            <>
              {/* Blogs List Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-6 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedBlogIds.length === filteredBlogs.length &&
                            filteredBlogs.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                      </th>
                      <th className="py-3 px-6 text-left">Title</th>
                      <th className="py-3 px-6 text-left">Author</th>
                      <th className="py-3 px-6 text-left">Categories</th>
                      <th className="py-3 px-6 text-left">Tags</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Created At</th>
                      <th className="py-3 px-6 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.map((blog) => (
                        <tr
                          key={blog._id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              checked={selectedBlogIds.includes(blog._id)}
                              onChange={() => handleSelect(blog._id)}
                              className="styled-checkbox form-checkbox h-5 w-5 text-indigo-600"
                            />
                          </td>
                          <td className="py-4 px-6">
                            <HighlightText
                              text={blog.title}
                              highlight={searchQuery}
                            />
                          </td>
                          <td className="py-4 px-6">
                            {blog.author ? blog.author.name : "N/A"}
                          </td>
                          <td className="py-4 px-6">
                            {blog.categories && blog.categories.length > 0
                              ? blog.categories
                                  .map((cat) => cat.name)
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="py-4 px-6">
                            {blog.tags && blog.tags.length > 0
                              ? blog.tags.map((tag) => tag.name).join(", ")
                              : "N/A"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-white text-sm ${
                                blog.status === "published"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            >
                              {blog.status.charAt(0).toUpperCase() +
                                blog.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {formatDate(blog.createdAt)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              {/* <Button
                                onClick={() => handleView(blog._id)}
                                className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 rounded-md quantico-bold-italic hover:shadow-lg transition-shadow flex items-center"
                              >
                                <i className="fa-solid fa-eye mr-2"></i> View
                              </Button> */}
                              <Button
                                onClick={() => handleEdit(blog._id)}
                                className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-2 rounded-md quantico-bold-italic hover:shadow-lg transition-shadow flex items-center"
                              >
                                <i className="fa-solid fa-pen mr-2"></i> Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(blog._id)}
                                className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-2 rounded-md quantico-bold-italic hover:shadow-lg transition-shadow flex items-center"
                              >
                                <i className="fa-solid fa-trash mr-2"></i>{" "}
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-4 px-6 text-center" colSpan="8">
                          No blogs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Blog Details Modal */}
      {viewingBlog && (
        <Modal
          isOpen={!!viewingBlog}
          onClose={() => setViewingBlog(null)}
          title="Blog Post Details"
        >
          <BlogDetails
            blog={blogs.find((blog) => blog._id === viewingBlog)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Modal>
      )}
    </div>
  );
};

export default BlogList;
