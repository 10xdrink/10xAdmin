// src/components/ProductList.jsx

import React, { useEffect, useState } from "react";
import { useProducts } from "../contexts/ProductContext";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Select from "react-select";
import { toast } from "react-toastify";
import categoryService from "../api/categoryService"; // Import categoryService
import tagService from "../api/tagService"; // Import tagService
import { useAuth } from "../contexts/AuthContext"; // Import useAuth for handling unauthorized errors
import EnlargedX from "../assets/EnlargedX.png";

const ProductList = () => {
  const {
    products,
    loading,
    filters,
    setFilters,
    totalPages,
    totalProducts,
    removeProduct,
    search,
    fetchProducts,
  } = useProducts();

  const [categories, setCategories] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  const { logout } = useAuth(); // Destructure logout from AuthContext

  // Fetch categories and tags for filters
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        // Fetch categories and tags using their respective services
        const resCategories = await categoryService.getCategories();
        const resTags = await tagService.getAllTags();

        // Handle different API response structures
        const fetchedCategories = Array.isArray(resCategories.data.categories)
          ? resCategories.data.categories
          : Array.isArray(resCategories.data)
          ? resCategories.data
          : [];

        const fetchedTags = Array.isArray(resTags.data.tags)
          ? resTags.data.tags
          : Array.isArray(resTags.data)
          ? resTags.data
          : [];

        setCategories(
          fetchedCategories.map((cat) => ({
            value: cat.name,
            label: cat.name,
          }))
        );
        setTagsOptions(
          fetchedTags.map((tag) => ({
            value: tag._id,
            label: tag.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching filter data:", error);
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          logout(); // Automatically logout on unauthorized error
        } else {
          toast.error("Failed to fetch filter data");
        }
      }
    };
    fetchFiltersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this product?"))
      return;
    try {
      await removeProduct(id);
      toast.success("Product deactivated successfully.");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        // Error handling is already managed in context
        toast.error("Failed to deactivate product");
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      search(query);
    } else {
      fetchProducts();
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="main-div bg-gradient-to-r from-[#A467F7] to-[#4C03CB] flex flex-col md:flex-row items-center">
        <div className="left-col px-6 py-12 md:px-20 md:py-28 w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-6xl md:text-8xl lg:text-9xl quantico-bold-italic text-white text-center md:text-left">
            Products
          </h1>
          <p className="text-white pt-sans-regular text-xl md:text-2xl mt-4 text-center md:text-left">
            Manage your products efficiently!
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

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0 mb-6">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="w-full md:w-1/3 flex items-center"
          >
            <input
              type="text"
              name="search"
              className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by title or description"
            />
            <button
              type="submit"
              className="px-6 py-[17px] bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaSearch />
            </button>
          </form>

          {/* Category Filter */}
          <div className="w-full md:w-1/3">
            <Select
              options={categories}
              value={
                categories.find((cat) => cat.value === filters.category) || null
              }
              onChange={(selectedOption) =>
                handleFilterChange(
                  "category",
                  selectedOption ? selectedOption.value : ""
                )
              }
              isClearable
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select category"
            />
          </div>

          {/* Tags Filter */}
          <div className="w-full md:w-1/3">
            <Select
              isMulti
              options={tagsOptions}
              value={filters.tags}
              onChange={(selected) => handleFilterChange("tags", selected)}
              className="react-select-container"
              classNamePrefix="react-select"
              placeholder="Select tags"
            />
          </div>
          <Link to={"/admin/products/create"}>
            <button className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-2 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow w-40">
              <FaPlus className="inline mr-2" /> Product
            </button>
          </Link>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#6366F1" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left">Title</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-left">Price</th>
                    <th className="py-3 px-6 text-left">Stock</th>
                    <th className="py-3 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {products && products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    products &&
                    products.map((product) => {
                      // Calculate min and max price from variants
                      const variantPrices = product.variants.map(
                        (v) => v.price
                      );
                      const minPrice = Math.min(...variantPrices);
                      const maxPrice = Math.max(...variantPrices);
                      const priceDisplay =
                        minPrice === maxPrice
                          ? `$${minPrice.toFixed(2)}`
                          : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

                      // Calculate min and max stock from variants
                      const variantStocks = product.variants.map(
                        (v) => v.stock
                      );
                      const minStock = Math.min(...variantStocks);
                      const maxStock = Math.max(...variantStocks);
                      const stockDisplay =
                        minStock === maxStock
                          ? `${minStock}`
                          : `${minStock} - ${maxStock}`;

                      return (
                        <tr
                          key={product._id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="py-3 px-6">
                            {product.title || "N/A"}
                          </td>
                          <td className="py-3 px-6">
                            {product.category || "N/A"}
                          </td>
                          <td className="py-3 px-6">{priceDisplay}</td>
                          <td className="py-3 px-6">
                            {product.variants && product.variants.length > 0 ? (
                              <>
                                {minStock} - {maxStock}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="py-3 px-6 flex space-x-4">
                            <Link
                              to={`/admin/products/edit/${product._id}`} // Updated path to match routing setup
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: index + 1 }))
                    }
                    className={`px-3 py-1 rounded-md ${
                      filters.page === index + 1
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductList;
