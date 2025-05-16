// src/contexts/ProductContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  getAllProducts,
  searchProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  bulkUpdateProducts,
  bulkActivateProducts,
  bulkDeactivateProducts,
  bulkUpdateStock,
  bulkUpdatePrice,
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
    priceMin: "",
    priceMax: "",
    stockMin: "",
    stockMax: "",
    dateStart: "",
    dateEnd: "",
    isActive: "",
    sortBy: "updatedAt",
    sortDirection: -1, // -1 for descending (newest first)
  });
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Reference to track if this is the initial render
  const initialRenderRef = useRef(true);
  const prevFiltersRef = useRef({});

  // Fetch products whenever filters change, but avoid infinite loops
  useEffect(() => {
    // Skip the first render
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      prevFiltersRef.current = {...filters};
      fetchProducts();
      return;
    }

    // Check if anything other than search has changed
    const hasNonSearchChanged = Object.keys(filters).some(key => {
      return key !== 'search' && filters[key] !== prevFiltersRef.current[key];
    });

    // Only fetch if non-search filters changed or if search was cleared
    if (hasNonSearchChanged || 
        (prevFiltersRef.current.search && !filters.search)) {
      fetchProducts();
    }
    
    // Update the previous filters reference
    prevFiltersRef.current = {...filters};
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

      // Add category filter
      if (filters.category && filters.category.trim() !== "") {
        params.category = filters.category.trim();
      }

      // Add search filter
      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search.trim();
      }

      // Add tags filter
      if (filters.tags && filters.tags.length > 0) {
        // Handle tags as array of objects with value property
        params.tags = filters.tags;
      }

      // Add price range filters
      if (filters.priceMin && filters.priceMin !== "") {
        params.priceMin = filters.priceMin;
      }
      if (filters.priceMax && filters.priceMax !== "") {
        params.priceMax = filters.priceMax;
      }

      // Add stock range filters
      if (filters.stockMin && filters.stockMin !== "") {
        params.stockMin = filters.stockMin;
      }
      if (filters.stockMax && filters.stockMax !== "") {
        params.stockMax = filters.stockMax;
      }

      // Add date range filters
      if (filters.dateStart && filters.dateStart !== "") {
        params.dateStart = filters.dateStart;
      }
      if (filters.dateEnd && filters.dateEnd !== "") {
        params.dateEnd = filters.dateEnd;
      }

      // Add active status filter
      if (filters.isActive !== "") {
        params.isActive = filters.isActive;
      }

      // Add sorting
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }
      if (filters.sortDirection) {
        params.sortDirection = filters.sortDirection;
      }

      // Clean params to remove empty fields
      params = cleanParams(params);

      console.log('Fetching products with params:', params);
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

  // Direct search function that doesn't update filters to avoid loops
  const performSearch = useCallback(async (queryStr) => {
    if (!queryStr.trim()) return;
    
    setLoading(true);
    try {
      // Log the search query for debugging
      console.log('Performing search with query:', queryStr.trim());
      
      // Call the search API
      const data = await searchProducts(queryStr.trim());
      
      // Log the search results for debugging
      console.log('Search results:', data);
      
      // Make sure we're handling both possible response formats
      const products = data.products || [];
      
      // Update state with search results
      setProducts(products);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.total || products.length);
      
      // Update search suggestions based on results
      if (products && products.length > 0) {
        const suggestions = products
          .slice(0, 5) // Limit to first 5 products for suggestions
          .map(product => ({
            id: product._id,
            title: product.title,
            sku: product.sku,
            image: product.images && product.images.length > 0 ? product.images[0] : null
          }));
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(error.message || "Failed to search products");
      }
      setSearchSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const search = useCallback(async (queryStr) => {
    const trimmedQuery = queryStr.trim();
    
    // Skip if the search query is the same as current filters
    if (trimmedQuery === filters.search) return;
    
    if (trimmedQuery === "") {
      // If search query is empty, update filters to clear search
      // This will trigger fetchProducts through the useEffect
      prevFiltersRef.current = {
        ...filters,
        search: ""
      };
      
      setFilters(prev => ({
        ...prev,
        search: "",
        category: "",
        tags: [],
        page: 1,
      }));
    } else {
      // First perform the search directly without updating filters
      await performSearch(trimmedQuery);
      
      // Then update filters without triggering another API call
      prevFiltersRef.current = {
        ...filters,
        search: trimmedQuery
      };
      
      setFilters(prev => ({
        ...prev,
        search: trimmedQuery,
        category: "",
        tags: [],
        page: 1,
      }));
    }
  }, [performSearch, filters]);

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

  // Bulk activate products
  const activateProducts = useCallback(async (productIds) => {
    setLoading(true);
    try {
      const data = await bulkActivateProducts(productIds);
      toast.success(data.message || `${productIds.length} products activated successfully`);
      fetchProducts();
    } catch (error) {
      console.error("Error activating products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(error.message || "Failed to activate products");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, fetchProducts]);

  // Bulk deactivate products
  const deactivateProducts = useCallback(async (productIds) => {
    setLoading(true);
    try {
      const data = await bulkDeactivateProducts(productIds);
      toast.success(data.message || `${productIds.length} products deactivated successfully`);
      fetchProducts();
    } catch (error) {
      console.error("Error deactivating products:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(error.message || "Failed to deactivate products");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, fetchProducts]);

  // Bulk update product stock
  const updateBulkStock = useCallback(async (productIds, stockValue) => {
    setLoading(true);
    try {
      const data = await bulkUpdateStock(productIds, stockValue);
      toast.success(data.message || `Stock updated for ${productIds.length} products`);
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock in bulk:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(error.message || "Failed to update stock");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, fetchProducts]);

  // Bulk update product price
  const updateBulkPrice = useCallback(async (productIds, priceValue) => {
    setLoading(true);
    try {
      const data = await bulkUpdatePrice(productIds, priceValue);
      toast.success(data.message || `Price updated for ${productIds.length} products`);
      fetchProducts();
    } catch (error) {
      console.error("Error updating price in bulk:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
      } else {
        toast.error(error.message || "Failed to update price");
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
  
  // Handle bulk actions for selected products
  const handleBulkAction = useCallback(async (action, customValue = null) => {
    if (selectedProducts.length === 0) {
      toast.warning("Please select at least one product");
      return;
    }

    try {
      setLoading(true);
      switch (action) {
        case 'delete':
          if (!window.confirm(`Are you sure you want to deactivate ${selectedProducts.length} products?`)) return;
          await deactivateProducts(selectedProducts);
          break;
        case 'activate':
          await activateProducts(selectedProducts);
          break;
        case 'updateStock':
          const stockValue = customValue || prompt("Enter new stock value for selected products:");
          if (stockValue === null) return;
          const newStock = parseInt(stockValue);
          if (isNaN(newStock) || newStock < 0) {
            toast.error("Please enter a valid non-negative number");
            return;
          }
          await updateBulkStock(selectedProducts, newStock);
          break;
        case 'updatePrice':
          const priceValue = customValue || prompt("Enter new price value for selected products:");
          if (priceValue === null) return;
          const newPrice = parseFloat(priceValue);
          if (isNaN(newPrice) || newPrice < 0) {
            toast.error("Please enter a valid non-negative number");
            return;
          }
          await updateBulkPrice(selectedProducts, newPrice);
          break;
        default:
          toast.error("Invalid action");
      }
      
      // Clear selected products after successful action
      setSelectedProducts([]);
      
      // Refresh the product list
      fetchProducts();
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
      toast.error(`Failed to perform bulk action: ${error.message || 'Unknown error'}`); 
    } finally {
      setLoading(false);
    }
  }, [selectedProducts, deactivateProducts, activateProducts, updateBulkStock, updateBulkPrice, fetchProducts]);

  const value = {
    products,
    loading,
    filters,
    totalPages,
    totalProducts,
    selectedProducts,
    setSelectedProducts,
    searchSuggestions,
    editingProduct,
    setEditingProduct,
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
    // New bulk operations
    activateProducts,
    deactivateProducts,
    updateBulkStock,
    updateBulkPrice,
    handleBulkAction,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export default ProductContext;
