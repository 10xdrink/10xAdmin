// src/components/ProductList.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { Link } from 'react-router-dom';
import {
  FaEdit, FaTrash, FaSearch, FaPlus, FaExclamationTriangle,
  FaToggleOn, FaToggleOff, FaDownload, FaEye, FaSort
} from 'react-icons/fa';
import { BiSolidStar } from 'react-icons/bi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { CSVLink } from 'react-csv';
import { Tooltip } from 'react-tooltip';
import EnlargedX from '../assets/EnlargedX.png';
import { convertAndFormatPrice } from '../utils/currencyUtils';

const ProductList = () => {
  /* ------------------------------------------------------------------ */
  /*  Context data                                                      */
  /* ------------------------------------------------------------------ */
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
    bulkUpdate
  } = useProducts();
  const { logout } = useAuth();

  /* ------------------------------------------------------------------ */
  /*  Local state                                                       */
  /* ------------------------------------------------------------------ */
  const [query, setQuery] = useState('');           // controlled input value
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  /* ------------------------------------------------------------------ */
  /*  Derived helpers                                                   */
  /* ------------------------------------------------------------------ */
  const exportData = products?.map(p => {
    const prices = p.variants.map(v => v.price);
    const stocks = p.variants.map(v => v.stock);
    return {
      Title: p.title,
      SKU: p.sku || `10X-${p._id.substring(0, 6)}`,
      Category: p.category || 'N/A',
      Price: Math.min(...prices) === Math.max(...prices)
        ? convertAndFormatPrice(prices[0])
        : `${convertAndFormatPrice(Math.min(...prices))} - ${convertAndFormatPrice(Math.max(...prices))}`,
      Stock: Math.min(...stocks) === Math.max(...stocks)
        ? stocks[0]
        : `${Math.min(...stocks)} - ${Math.max(...stocks)}`,
      Status: p.isActive ? 'Active' : 'Inactive',
      Created: new Date(p.createdAt).toLocaleDateString(),
      Updated: new Date(p.updatedAt).toLocaleDateString()
    };
  }) ?? [];

  /* ------------------------------------------------------------------ */
  /*  Initial fetch                                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* ------------------------------------------------------------------ */
  /*  Local search and sorting implementation                          */
  /* ------------------------------------------------------------------ */
  const debounceRef = useRef(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localSortConfig, setLocalSortConfig] = useState({ key: null, direction: 'ascending' });

  // Generate search suggestions based on current query
  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (trimmed.length > 2) {
        const suggestions = products
          .slice(0, 150)
          .filter(p =>
            p.title.toLowerCase().includes(trimmed.toLowerCase()) ||
            p.sku?.toLowerCase().includes(trimmed.toLowerCase())
          )
          .map(p => p.title)
          .slice(0, 5);
        setSearchSuggestions(suggestions);
      } else {
        setSearchSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, products]);
  
  // Apply local filtering and sorting
  useEffect(() => {
    // Start with all products or filtered by search
    let result = [...products];
    
    // Apply search filter if query exists
    if (query.trim()) {
      const searchTerm = query.trim().toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        (product.sku && product.sku.toLowerCase().includes(searchTerm)) ||
        (product.category && product.category.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting if a sort config exists
    if (localSortConfig.key) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        // Handle special cases for price and stock which are in variants
        if (localSortConfig.key === 'price') {
          aValue = Math.min(...a.variants.map(v => v.price));
          bValue = Math.min(...b.variants.map(v => v.price));
        } else if (localSortConfig.key === 'stock') {
          aValue = Math.min(...a.variants.map(v => v.stock));
          bValue = Math.min(...b.variants.map(v => v.stock));
        } else {
          // For other fields, access directly
          aValue = a[localSortConfig.key];
          bValue = b[localSortConfig.key];
        }
        
        // Handle string comparison
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        // Compare based on direction
        if (aValue < bValue) {
          return localSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return localSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredProducts(result);
  }, [products, query, localSortConfig]);

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  // Function to clear search and reset product list
  const clearSearch = useCallback(() => {
    setQuery('');
    setSearchSuggestions([]);
    // The useEffect will handle updating filteredProducts
  }, []);

  // Handle search form submission
  const handleSearchSubmit = useCallback(
    e => {
      e.preventDefault();
      // Just update the query - the useEffect will handle the filtering
      setSearchSuggestions([]);
    },
    []
  );
  
  // Set the search query when clicking a suggestion
  const handleSuggestionClick = useCallback((suggestion) => {
    setQuery(suggestion);
    setSearchSuggestions([]);
  }, []);

  const handleDelete = useCallback(
    async id => {
      if (!window.confirm('Are you sure you want to deactivate this product?')) return;
      try {
        await removeProduct(id);
        toast.success('Product deactivated successfully.');
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
          logout();
        } else {
          toast.error('Failed to deactivate product.');
        }
      }
    },
    [removeProduct, logout]
  );

  const requestSort = useCallback(
    key => {
      // Update both the UI sort config and the local sort config
      const direction =
        sortConfig.key === key && sortConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending';
      
      // Update UI sort config
      setSortConfig({ key, direction });
      
      // Update local sort config for actual sorting
      setLocalSortConfig({ key, direction });
      
      // Keep the backend filters in sync (though we're not using them for display)
      setFilters(prev => ({
        ...prev,
        sortBy: key,
        sortDirection: direction === 'ascending' ? 1 : -1,
        page: 1
      }));
    },
    [sortConfig, setFilters]
  );

  const handleSelectAll = useCallback(
    e => setSelectedProducts(e.target.checked ? products.map(p => p._id) : []),
    [products]
  );

  const handleSelectProduct = useCallback(
    id =>
      setSelectedProducts(prev =>
        prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      ),
    []
  );

  const handleBulkAction = useCallback(
    async action => {
      if (!selectedProducts.length) {
        toast.warning('Please select at least one product');
        return;
      }
      try {
        if (action === 'delete') {
          if (!window.confirm(`Deactivate ${selectedProducts.length} products?`)) return;
          await bulkUpdate(selectedProducts.map(id => ({ id, fields: { isActive: false } })));
          toast.success(`${selectedProducts.length} products deactivated`);
        } else if (action === 'activate') {
          await bulkUpdate(selectedProducts.map(id => ({ id, fields: { isActive: true } })));
          toast.success(`${selectedProducts.length} products activated`);
        } else if (action === 'updateStock') {
          const val = prompt('Enter new stock value:');
          if (val === null) return;
          const stock = parseInt(val, 10);
          if (isNaN(stock) || stock < 0) { toast.error('Invalid number'); return; }
          await bulkUpdate(selectedProducts.map(id => ({ id, fields: { stock } })));
          toast.success(`Stock updated for ${selectedProducts.length} products`);
        } else if (action === 'updatePrice') {
          const val = prompt('Enter new price:');
          if (val === null) return;
          const price = parseFloat(val);
          if (isNaN(price) || price < 0) { toast.error('Invalid number'); return; }
          await bulkUpdate(selectedProducts.map(id => ({ id, fields: { price } })));
          toast.success(`Price updated for ${selectedProducts.length} products`);
        } else {
          toast.error('Unknown action');
        }
        setSelectedProducts([]);
      } catch (err) {
        console.error(err);
        toast.error(`Bulk action failed: ${err.message}`);
      }
    },
    [selectedProducts, bulkUpdate]
  );

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              PRODUCTS
          </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
            Manage your products efficiently!
          </p>
        </div>
          <div className="hidden md:flex w-full md:w-1/2 h-32 overflow-hidden items-center justify-end mr-24">
          <img
              className="w-32 object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-10"
            src={EnlargedX}
              alt="10X Logo"
          />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search & Bulk Actions */}
        <div className="mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-1/4 relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  name="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A467F7] focus:border-[#A467F7]"
                  placeholder="Search products..."
                />
                {query && (
                  <div 
                    className="absolute inset-y-0 right-10 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                  >
                    <span className="text-xl font-medium">&times;</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white rounded-r-md flex items-center justify-center"
              >
                <FaSearch />
              </button>
            </form>
            {searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {searchSuggestions.map((s, i) => (
                  <div
                    key={i}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <FaSearch className="text-gray-400 mr-2" />
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-1/4 justify-end">
            <CSVLink
              data={exportData}
              filename={`10x-products-${new Date().toISOString().split('T')[0]}.csv`}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md flex items-center gap-2"
              data-tooltip-id="export-tooltip"
              data-tooltip-content="Export Products"
            >
              <FaDownload /> Export
            </CSVLink>
            <Link to="/admin/products/create">
              <button className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-2 rounded-md flex items-center gap-2">
                <FaPlus /> Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* Product Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#6366F1" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white">
                  <tr>
                    <th className="w-10 py-3 px-4">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          selectedProducts.length > 0 &&
                          selectedProducts.length === products.length
                        }
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    {['title', 'category', 'price', 'stock'].map(key => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className="py-3 px-4 text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          {sortConfig.key === key && (
                            <FaSort
                              className={
                                sortConfig.direction === 'ascending'
                                  ? 'transform rotate-180'
                                  : ''
                              }
                            />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => {
                      const variantPrices = product.variants.map(v => v.price);
                      const minPrice = Math.min(...variantPrices);
                      const maxPrice = Math.max(...variantPrices);
                      const priceDisplay =
                        minPrice === maxPrice
                          ? convertAndFormatPrice(minPrice)
                          : `${convertAndFormatPrice(minPrice)} - ${convertAndFormatPrice(maxPrice)}`;

                      const variantStocks = product.variants.map(v => v.stock);
                      const minStock = Math.min(...variantStocks);
                      const maxStock = Math.max(...variantStocks);
                      let stockStatus = 'normal';
                      if (minStock === 0) stockStatus = 'out';
                      else if (minStock <= 5) stockStatus = 'critical';
                      else if (minStock <= 10) stockStatus = 'low';

                      const stockDisplay =
                        minStock === maxStock
                          ? `${minStock}`
                          : `${minStock} - ${maxStock}`;

                      const sku =
                        product.sku ||
                        `10X-${(product.category || 'PRD')
                          .substring(0, 3)
                          .toUpperCase()}-${product._id.substring(0, 6).toUpperCase()}`;

                      const lastUpdated = new Date(
                        product.updatedAt || product.createdAt
                      ).toLocaleDateString();

                      return (
                        <tr
                          key={product._id}
                          className={`border-b hover:bg-gray-50 ${
                            !product.isActive ? 'bg-gray-50 text-gray-500' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                              className="w-4 h-4 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {product.thumbnail && (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <div>
                                <span className="font-medium">
                                  {product.title || 'N/A'}
                                </span>
                                {product.rating > 0 && (
                                  <div className="flex items-center text-yellow-500 text-xs mt-1">
                                    <BiSolidStar />
                                    <span className="ml-1">
                                      {product.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">
                              {product.category || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {product.discountPercentage > 0 ? (
                              <div>
                                <span className="font-medium">{priceDisplay}</span>
                                <span className="ml-2 text-xs text-red-600">
                                  -{product.discountPercentage}%
                                </span>
                              </div>
                            ) : (
                              <span>{priceDisplay}</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                stockStatus === 'out'
                                  ? 'bg-red-100 text-red-800'
                                  : stockStatus === 'critical'
                                  ? 'bg-orange-100 text-orange-800'
                                  : stockStatus === 'low'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {stockDisplay}
                              {stockStatus === 'out' && (
                                <FaExclamationTriangle className="inline ml-1" />
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() =>
                                handleBulkAction(product.isActive ? 'delete' : 'activate')
                              }
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                product.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {product.isActive ? (
                                <>
                                  <FaToggleOn className="text-green-600" /> Active
                                </>
                              ) : (
                                <>
                                  <FaToggleOff className="text-red-600" /> Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-xs font-mono">{sku}</td>
                          <td className="py-3 px-4 text-xs">{lastUpdated}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link
                                to={`/admin/products/${product._id}`}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                data-tooltip-id="view-tooltip"
                                data-tooltip-content="View Details"
                              >
                                <FaEye />
                              </Link>
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="text-indigo-600 hover:text-indigo-900 p-1"
                                data-tooltip-id="edit-tooltip"
                                data-tooltip-content="Edit Product"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                data-tooltip-id="delete-tooltip"
                                data-tooltip-content="Deactivate Product"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Stats & Pagination */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600 mb-4 md:mb-0">
                Showing {products.length} of {totalProducts} products
              </div>
              {totalPages > 1 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      setFilters(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                    }
                    disabled={filters.page === 1}
                    className={`px-3 py-1 rounded-md ${
                      filters.page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    &laquo; Prev
                  </button>
                  {[...Array(totalPages)].map((_, idx) => {
                    if (
                      idx === 0 ||
                      idx === totalPages - 1 ||
                      (idx >= filters.page - 2 && idx <= filters.page)
                    ) {
                      return (
                        <button
                          key={idx}
                          onClick={() => setFilters(prev => ({ ...prev, page: idx + 1 }))}
                          className={`px-3 py-1 rounded-md ${
                            filters.page === idx + 1
                              ? 'bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    }
                    if (
                      (idx === 1 && filters.page > 3) ||
                      (idx === totalPages - 2 && filters.page < totalPages - 2)
                    ) {
                      return <span key={idx} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  <button
                    onClick={() =>
                      setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))
                    }
                    disabled={filters.page === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      filters.page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
              <div className="mt-4 md:mt-0 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={filters.limit}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      limit: Number(e.target.value),
                      page: 1
                    }))
                  }
                  className="px-2 py-1 border border-gray-300 rounded-md"
                >
                  {[10, 25, 50, 100].map(val => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tooltips */}
            <Tooltip id="export-tooltip" place="top" effect="solid" />
            <Tooltip id="view-tooltip" place="top" effect="solid" />
            <Tooltip id="edit-tooltip" place="top" effect="solid" />
            <Tooltip id="delete-tooltip" place="top" effect="solid" />
          </>
        )}
      </div>
    </>
  );
};

export default ProductList;
