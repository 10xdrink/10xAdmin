// src/contexts/ProductContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  searchProducts, // Ensure this is correctly imported
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkUpdateProducts,
  uploadProductImage,
} from "../api/productService";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext"; // Import useAuth for handling unauthorized errors

const ProductContext = createContext();

// Custom hook to use the ProductContext
export const useProducts = () => {
  return useContext(ProductContext);
};

// Utility function to remove empty fields from params
const cleanParams = (params) => {
  const cleaned = { ...params };
  Object.keys(cleaned).forEach(key => {
    if (
      cleaned[key] === "" ||
      (Array.isArray(cleaned[key]) && cleaned[key].length === 0)
    ) {
      delete cleaned[key];
    }
  });
  return cleaned;
};

// Provider component
export const ProductProvider = ({ children }) => {
  const { logout } = useAuth(); // Destructure logout from AuthContext

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    tags: [],
    search: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products whenever filters change
  useEffect(() => {
    if (filters.search) {
      // If there's a search query, use the search function
      performSearch(filters.search);
    } else {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [filters]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Clean up filters to remove empty strings and empty arrays
      let params = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.category.trim() !== "") {
        params.category = filters.category.trim();
      }

      if (filters.search.trim() !== "") {
        params.search = filters.search.trim();
      }

      if (filters.tags.length > 0) {
        // Assuming the backend expects tags as a comma-separated string of tag IDs
        params.tags = filters.tags.map(tag => tag.value).join(",");
      }

      // Clean params to remove empty fields
      params = cleanParams(params);

      const data = await getAllProducts(params);
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalProducts(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error(error.message || "Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, logout]);

  const performSearch = useCallback(async (queryStr) => {
    setLoading(true);
    try {
      const data = await searchProducts(queryStr.trim());
      setProducts(data.products);
      setTotalPages(1);
      setTotalProducts(data.products.length);
      setFilters(prev => ({
        ...prev,
        search: queryStr.trim(),
        category: "",
        tags: [],
        page: 1,
      }));
    } catch (error) {
      console.error("Error searching products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error(error.message || "Failed to search products");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const search = useCallback(async (queryStr) => {
    if (queryStr.trim() === "") {
      // If search query is empty, fetch all products
      setFilters(prev => ({
        ...prev,
        search: "",
        category: "",
        tags: [],
        page: 1,
      }));
    } else {
      performSearch(queryStr);
    }
  }, [performSearch]);

  const getProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      return data.data;
    } catch (error) {
      console.error("Error getting product:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to get product details");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const getProductSlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const data = await getProductBySlug(slug);
      return data.data;
    } catch (error) {
      console.error("Error getting product by slug:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to get product details");
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    try {
      const data = await createProduct(productData);
      setProducts((prev) => [data.data, ...prev]);
      toast.success("Product created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error(error.message || "Failed to create product");
      }
      throw error; // Re-throw to handle in UI if needed
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const editProduct = useCallback(async (id, productData) => {
    setLoading(true);
    try {
      const data = await updateProduct(id, productData);
      setProducts(
        products.map((product) => (product._id === id ? data.data : product))
      );
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to update product");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout, products]);

  const removeProduct = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      toast.success("Product deactivated successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to deactivate product");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, products]);

  const updateStock = useCallback(async (id, stock) => {
    setLoading(true);
    try {
      const data = await updateProductStock(id, stock);
      setProducts(
        products.map((product) => (product._id === id ? data.data : product))
      );
      toast.success("Product stock updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to update stock");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, products]);

  const bulkUpdate = useCallback(async (updates) => {
    setLoading(true);
    try {
      const data = await bulkUpdateProducts(updates);
      toast.success(data.message || "Bulk update successful");
      fetchProducts();
    } catch (error) {
      console.error("Error bulk updating products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error(error.message || "Failed to bulk update products");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, fetchProducts]);

  const uploadImage = useCallback(async (imageFile) => {
    try {
      const data = await uploadProductImage(imageFile);
      toast.success("Image uploaded successfully");
      return data.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout(); // Automatically logout on unauthorized error
      } else {
        toast.error("Failed to upload image");
      }
      throw error;
    }
  }, [logout]);

  const value = {
    products,
    loading,
    filters,
    totalPages,
    totalProducts,
    setFilters,
    fetchProducts,
    search,
    getProduct,
    getProductSlug,
    addProduct,
    editProduct,
    removeProduct,
    updateStock,
    bulkUpdate,
    uploadImage,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
