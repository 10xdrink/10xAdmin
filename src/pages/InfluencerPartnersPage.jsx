import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiSearch, FiUserCheck, FiMail, FiPhone, 
  FiDownload, FiFilter, FiGlobe, FiBarChart2,
  FiChevronDown, FiArrowDown, FiArrowUp, FiList,
  FiTrash2, FiAlertTriangle, FiLoader
} from 'react-icons/fi';
import { 
  AiFillInstagram as Instagram, 
  AiFillYoutube as Youtube 
} from 'react-icons/ai';
import { FaRegListAlt } from 'react-icons/fa';
import { FaMicrophone as Mic } from 'react-icons/fa';
import { IoPhonePortrait as Smartphone } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';
import { formatDateTime } from '../utils/formatters';
import API_BASE_URL from '../config/apiConfig';
import EnlargedX from "../assets/EnlargedX.png";

const InfluencerPartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [followerFilter, setFollowerFilter] = useState('all');
  const [followerDropdownOpen, setFollowerDropdownOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingPartnerId, setDeletingPartnerId] = useState(null);
  
  const navigate = useNavigate();
  
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Construct query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (platformFilter && platformFilter !== 'all') params.append('platform', platformFilter);
      if (followerFilter && followerFilter !== 'all') params.append('followers', followerFilter);
      params.append('page', currentPage);
      
      const url = `${API_BASE_URL}/influencers/partners?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        toast.error('Unauthorized. Please log in again with appropriate permissions.');
        throw new Error('Unauthorized access. You need admin privileges to view this resource.');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch partners. Status: ${response.status}`);
      }
      
      const data = await response.json();
      setPartners(data.data || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError(err.message);
      setLoading(false);
      toast.error(`Error loading partners: ${err.message}`);
    }
  };
  
  useEffect(() => {
    fetchPartners();
  }, [currentPage, platformFilter, followerFilter]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPartners();
  };
  
  const platformOptions = [
    { id: 'all', name: 'All Platforms', icon: <FiUsers />, bgClass: 'from-black to-[#0821D2]' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram />, bgClass: 'from-pink-500 to-pink-600' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube />, bgClass: 'from-red-500 to-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: <Smartphone />, bgClass: 'from-blue-500 to-blue-600' },
    { id: 'blog', name: 'Blog/Website', icon: <FaRegListAlt />, bgClass: 'from-indigo-500 to-indigo-600' },
    { id: 'podcast', name: 'Podcast', icon: <Mic />, bgClass: 'from-orange-500 to-red-700' },
  ];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFilterSelection = (platform) => {
    setPlatformFilter(platform);
    setCurrentPage(1);
    setDropdownOpen(false);
    fetchPartners();
  };

  // Find the current selected platform option
  const selectedPlatform = platformOptions.find(option => option.id === platformFilter);

  const getPlatformBadges = (platforms) => {
    if (!platforms || !platforms.length) return 'None';
    
    const platformIcons = {
      instagram: {
        bg: 'bg-gradient-to-r from-pink-400 to-pink-600',
        text: 'text-white',
        icon: <Instagram className="mr-1 h-3 w-3" />
      },
      youtube: {
        bg: 'bg-gradient-to-r from-red-400 to-red-600',
        text: 'text-white',
        icon: <Youtube className="mr-1 h-3 w-3" />
      },
      tiktok: {
        bg: 'bg-gradient-to-r from-blue-400 to-blue-600',
        text: 'text-white',
        icon: <Smartphone className="mr-1 h-3 w-3" />
      },
      blog: {
        bg: 'bg-gradient-to-r from-indigo-400 to-indigo-600',
        text: 'text-white',
        icon: <FaRegListAlt className="mr-1 h-3 w-3" />
      },
      podcast: {
        bg: 'bg-gradient-to-r from-purple-400 to-purple-600',
        text: 'text-white',
        icon: <Mic className="mr-1 h-3 w-3" />
      }
    };
    
    return (
      <div className="flex flex-wrap gap-1">
        {platforms.map(platform => {
          const style = platformIcons[platform] || {
            bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
            text: 'text-white',
            icon: <FiGlobe className="mr-1 h-3 w-3" />
          };
          
          return (
            <span 
              key={platform} 
              className={`px-2 py-1 text-xs rounded-full flex items-center shadow-sm ${style.bg} ${style.text} quantico-regular`}
            >
              {style.icon}
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Function to handle data export
  const handleExportData = () => {
    try {
      if (partners.length === 0) {
        toast.info('No data available to export');
        return;
      }

      // Define CSV headers
      const headers = [
        'Full Name',
        'Email',
        'Platforms',
        'Followers',
        'Niche',
        'Partnership Date'
      ];

      // Convert partners data to CSV rows
      const csvRows = partners.map(partner => [
        partner.fullName || '',
        partner.email || '',
        (partner.platforms || []).join(', '),
        partner.followers || 'Not specified',
        partner.niche || 'Not specified',
        formatDateTime(partner.partnershipDate || partner.approvalDate || partner.reviewDate)
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `influencer-partners-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    }
  };

  const followerRanges = [
    { id: 'all', label: 'All Followers', color: 'text-gray-700' },
    { id: '1k-5k', label: '1,000 - 5,000 followers', color: 'text-pink-500' },
    { id: '5k-10k', label: '5,000 - 10,000 followers', color: 'text-blue-500' },
    { id: '10k-50k', label: '10,000 - 50,000 followers', color: 'text-green-500' },
    { id: '50k-100k', label: '50,000 - 100,000 followers', color: 'text-yellow-500' },
    { id: '100k-500k', label: '100,000 - 500,000 followers', color: 'text-gray-500' },
    { id: '500k+', label: '500,000+ followers', color: 'text-red-500' }
  ];
  
  const handleFollowerFilterChange = (range) => {
    setFollowerFilter(range);
    setFollowerDropdownOpen(false);
    setCurrentPage(1);
  };
  
  const getSelectedFollowerRange = () => {
    return followerRanges.find(range => range.id === followerFilter) || followerRanges[0];
  };

  const handleDeletePartner = async () => {
    if (!selectedPartner || !selectedPartner._id) return;
    
    setDeletingPartnerId(selectedPartner._id);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Determine if we need to delete a user account or just an application
      let endpoint;
      if (selectedPartner.user && selectedPartner.user._id) {
        // Delete the user account (which will handle the application)
        endpoint = `${API_BASE_URL}/influencers/user/${selectedPartner.user._id}`;
      } else {
        // No user account, just delete the application
        endpoint = `${API_BASE_URL}/influencers/${selectedPartner._id}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Try to parse error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to delete partner. Status: ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Failed to delete partner. Status: ${response.status}`);
        }
      }
      
      toast.success(`${selectedPartner.fullName} has been deleted successfully`);
      
      // Remove the partner from the list without refetching
      setPartners(prevPartners => prevPartners.filter(partner => partner._id !== selectedPartner._id));
      
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setDeletingPartnerId(null);
      setShowDeleteModal(false);
      setSelectedPartner(null);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              INFLUENCER PARTNERS
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              View and manage all active influencer partners
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

      {/* Main Content */}
      <div className="flex justify-center items-start py-10 md:py-20 bg-gray-100 min-h-screen">
        <div className="w-full px-4 md:px-6">
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Search Input */}
              <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-[400px] bg-white border border-black text-black py-3 px-4 shadow-lg quantico-bold-italic text-lg focus:outline-none"
                />
                <button 
                  type="submit"
                  className="bg-black text-white px-4 flex items-center justify-center shadow-lg"
                >
                  <FiSearch size={20} />
                </button>
              </form>
              
              {/* Platform Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className={`flex items-center justify-between w-64 px-4 py-3 shadow-lg quantico-bold-italic text-[16px] whitespace-nowrap bg-gradient-to-r ${selectedPlatform ? `${selectedPlatform.bgClass} text-white` : 'bg-white text-gray-700'}`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{selectedPlatform ? selectedPlatform.icon : <FiFilter />}</span>
                    <span>{selectedPlatform ? selectedPlatform.name : 'Select Platform'}</span>
                  </div>
                  <FiChevronDown className={`ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {platformOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterSelection(option.id)}
                        className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 ${
                          platformFilter === option.id ? `bg-gradient-to-r ${option.bgClass} text-white` : 'text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Follower Range Filter Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setFollowerDropdownOpen(!followerDropdownOpen)}
                  className="flex items-center justify-between w-64 px-4 py-3 shadow-lg quantico-bold-italic text-[16px] whitespace-nowrap bg-white"
                >
                  <div className="flex items-center">
                    <span className="mr-2"><FiList /></span>
                    <span className={getSelectedFollowerRange().color}>
                      {getSelectedFollowerRange().label}
                    </span>
                  </div>
                  <FiChevronDown className={`ml-2 transition-transform ${followerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {followerDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {followerRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => handleFollowerFilterChange(range.id)}
                        className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-100 ${
                          followerFilter === range.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className={`${range.color}`}>{range.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Export Button */}
            <Button 
              onClick={handleExportData}
              className="mt-4 md:mt-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:from-green-700 hover:to-green-800"
            >
              <div className="flex items-center justify-center">
                <FiDownload className="mr-2" />
                <span>Export Data</span>
              </div>
            </Button>
          </div>

          {/* Partners List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded text-red-700 quantico-regular">
              <p>{error}</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FiUsers className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 quantico-regular">No partners found</h3>
              <p className="text-gray-500 pt-sans-regular">
                {platformFilter !== 'all' 
                  ? `No partners on ${platformFilter} match your criteria.` 
                  : 'There are no partners to display.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map(partner => (
                  <div key={partner._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md mr-4">
                          {partner.fullName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold quantico-regular">{partner.fullName}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <FiMail className="mr-1" size={14} />
                            <a href={`mailto:${partner.email}`} className="hover:underline text-blue-600">
                              {partner.email}
                            </a>
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Platforms</p>
                        {getPlatformBadges(partner.platforms)}
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Niche</p>
                        <p className="font-medium">{partner.niche || 'Not specified'}</p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Followers</p>
                        <p className="font-medium">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {partner.followers || 'Not specified'}
                          </span>
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Partnership Start</p>
                        <p className="font-medium">
                          {partner.reviewDate ? formatDateTime(partner.reviewDate) : 'Recently approved'}
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Partnership Status</p>
                        <p className="font-medium">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 shadow-md quantico-bold-italic text-sm"
                          onClick={() => navigate(`/admin/partners/${partner._id}`)}
                        >
                          View Profile
                        </Button>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPartner(partner);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            disabled={deletingPartnerId === partner._id}
                          >
                            {deletingPartnerId === partner._id ? (
                              <FiLoader className="animate-spin h-4 w-4" />
                            ) : (
                              <FiTrash2 className="h-4 w-4" />
                            )}
                          </button>
                          <Button 
                            className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 py-2 shadow-md quantico-bold-italic text-sm flex items-center"
                            title="Analytics"
                          >
                            <FiBarChart2 />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-l-md ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 quantico-bold-italic'
                      }`}
                    >
                      Previous
                    </Button>
                    <div className="flex">
                      {[...Array(totalPages).keys()].map(page => (
                        <Button
                          key={page + 1}
                          onClick={() => setCurrentPage(page + 1)}
                          className={`px-4 py-2 ${
                            currentPage === page + 1
                              ? 'bg-gradient-to-r from-black to-[#0821D2] text-white'
                              : 'bg-white text-blue-600 hover:bg-gray-50'
                          } quantico-bold-italic`}
                        >
                          {page + 1}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-r-md ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 quantico-bold-italic'
                      }`}
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPartner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center text-red-600 mb-4">
              <FiAlertTriangle className="h-8 w-8 mr-3" />
              <h3 className="text-xl font-bold quantico-bold">Confirm Deletion</h3>
            </div>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-bold">{selectedPartner.fullName}</span>? This will permanently remove their account and all associated data.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex items-center">
                <FiMail className="text-blue-500 mr-2" />
                <p className="text-sm text-blue-700">
                  A notification email will be sent to the influencer at <strong>{selectedPartner.email}</strong> informing them that their account has been deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                disabled={deletingPartnerId === selectedPartner?._id}
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePartner}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                disabled={deletingPartnerId === selectedPartner?._id}
              >
                {deletingPartnerId === selectedPartner?._id ? (
                  <>
                    <FiLoader className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="h-4 w-4 mr-2" />
                    Delete Partner
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default InfluencerPartnersPage; 