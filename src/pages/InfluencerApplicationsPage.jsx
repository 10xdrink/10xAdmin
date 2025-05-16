import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiCheckCircle, FiXCircle, FiLoader, FiSearch, FiInbox, 
  FiUserCheck, FiUserX, FiFilter, FiDownload, FiSend, FiUser, FiMail, 
  FiPhone, FiGlobe, FiLink, FiFileText, FiClipboard, FiList, FiBarChart2, FiCheck, FiX, FiTrash2
} from 'react-icons/fi';
import { 
  AiFillInstagram as Instagram, 
  AiFillYoutube as Youtube 
} from 'react-icons/ai';
import { FaRegListAlt, FaMicrophone as Mic } from 'react-icons/fa';
import { IoPhonePortrait as Smartphone } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal';
import Button from '../components/Common/Button';
import { formatDateTime } from '../utils/formatters';
import API_BASE_URL from '../config/apiConfig';
import EnlargedX from "../assets/EnlargedX.png"; // Example image for top banner

// Add custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const InfluencerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingApplication, setDeletingApplication] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resendingCredentials, setResendingCredentials] = useState(false);
  
  const navigate = useNavigate();
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/influencers?page=${currentPage}`;
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      console.log('Using token for request:', token.substring(0, 10) + '...');
      
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
        throw new Error(`Failed to fetch applications. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Applications data:', data);
      setApplications(data.data || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
      setLoading(false);
      toast.error(`Error loading applications: ${err.message}`);
    }
  };
  
  useEffect(() => {
    fetchApplications();
  }, [currentPage, statusFilter]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApplications();
  };
  
  const handleFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };
  
  const handleViewApplication = (application) => {
    setCurrentApplication(application);
    setShowViewModal(true);
  };
  
  const handleReviewApplication = (application) => {
    setCurrentApplication(application);
    setReviewStatus('approved');
    setRejectionReason('');
    setShowReviewModal(true);
  };
  
  const submitReview = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const payload = {
        status: reviewStatus,
        rejectionReason: reviewStatus === 'rejected' ? rejectionReason : undefined
      };
      
      const response = await fetch(`${API_BASE_URL}/influencers/${currentApplication._id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to review application');
      }
      
      toast.success(`Application ${reviewStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
      setShowReviewModal(false);
      fetchApplications();
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const resendCredentials = async (applicationId) => {
    setResendingCredentials(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/influencers/${applicationId}/resend-credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend credentials');
      }
      
      toast.success('Credentials resent successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResendingCredentials(false);
    }
  };
  
  const handleDeleteApplication = (application) => {
    setCurrentApplication(application);
    setShowDeleteModal(true);
  };
  
  const confirmDeleteApplication = async () => {
    setDeletingApplication(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${API_BASE_URL}/influencers/${currentApplication._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete application');
      }
      
      toast.success('Application deleted successfully');
      setShowDeleteModal(false);
      fetchApplications();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingApplication(false);
    }
  };
  
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
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1.5 inline-flex items-center rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm quantico-bold-italic">
            <FiLoader className="mr-1.5 h-3 w-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1.5 inline-flex items-center rounded-full text-xs font-medium bg-gradient-to-r from-green-400 to-green-500 text-white shadow-sm quantico-bold-italic">
            <FiCheckCircle className="mr-1.5 h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1.5 inline-flex items-center rounded-full text-xs font-medium bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm quantico-bold-italic">
            <FiXCircle className="mr-1.5 h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center rounded-full text-xs font-medium bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm quantico-bold-italic">
            <FiLoader className="mr-1.5 h-3 w-3" />
            Unknown
          </span>
        );
    }
  };
  
  const renderViewModal = () => {
    if (!currentApplication) return null;
    
    return (
      <Modal 
        isOpen={showViewModal} 
        onClose={() => setShowViewModal(false)} 
        fullWidth={true}
        size="full"
        title={
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-lg animate-fadeIn">
              {currentApplication.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
              <h3 className="text-2xl font-bold">Application Details</h3>
              <p className="text-sm text-gray-500">{formatDateTime(currentApplication.applicationDate)}</p>
            </div>
          </div>
        }
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar p-5">
          {/* Status Badge */}
          <div className="mb-6 flex justify-between items-center animate-fadeIn" style={{animationDelay: '0.15s'}}>
            <div>
              <span className="text-sm font-medium text-gray-500">Application ID:</span>
              <span className="ml-2 text-sm font-mono bg-gray-100 py-1 px-2 rounded">{currentApplication._id}</span>
            </div>
            <div>
              <span className="text-sm font-medium mr-2">Status:</span>
              {getStatusBadge(currentApplication.status)}
            </div>
          </div>

          {/* Section: Personal Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-blue-800 flex items-center">
                <FiUser className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{currentApplication.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium flex items-center">
                    <FiMail className="h-4 w-4 mr-1 text-gray-400" />
                    <a href={`mailto:${currentApplication.email}`} className="text-blue-600 hover:underline">
                      {currentApplication.email}
                    </a>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium flex items-center">
                    <FiPhone className="h-4 w-4 mr-1 text-gray-400" />
                    {currentApplication.whatsapp || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Contact Preference</p>
                  <p className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {currentApplication.contactPreference === 'email' ? 
                        <FiMail className="h-3 w-3 mr-1" /> : 
                        <FiPhone className="h-3 w-3 mr-1" />
                      }
                      {currentApplication.contactPreference}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Platform Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-purple-800 flex items-center">
                <FiGlobe className="h-5 w-5 mr-2 text-purple-600" />
                Platform Information
              </h3>
            </div>
            <div className="bg-white p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {currentApplication.platforms && currentApplication.platforms.length > 0 ? (
                    getPlatformBadges(currentApplication.platforms)
                  ) : (
                    <span className="text-gray-500 italic">No platforms selected</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Follower Range</p>
                  <p className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {currentApplication.followers || 'Not specified'}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Content Niche</p>
                  <p className="font-medium">
                    {currentApplication.niche || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Platform Details */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-green-800 flex items-center">
                <FiLink className="h-5 w-5 mr-2 text-green-600" />
                Platform Details
              </h3>
            </div>
            <div className="bg-white p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentApplication.instagram && (
                  <div className="flex items-start p-3 rounded-md border border-gray-100 bg-gray-50">
                    <Instagram className="h-5 w-5 mr-2 text-pink-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Instagram</p>
                      <p className="font-medium">{currentApplication.instagram}</p>
                    </div>
                  </div>
                )}
                {currentApplication.youtube && (
                  <div className="flex items-start p-3 rounded-md border border-gray-100 bg-gray-50">
                    <Youtube className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">YouTube</p>
                      <p className="font-medium">{currentApplication.youtube}</p>
                    </div>
                  </div>
                )}
                {currentApplication.tiktok && (
                  <div className="flex items-start p-3 rounded-md border border-gray-100 bg-gray-50">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">TikTok</p>
                      <p className="font-medium">{currentApplication.tiktok}</p>
                    </div>
                  </div>
                )}
                {currentApplication.website && (
                  <div className="flex items-start p-3 rounded-md border border-gray-100 bg-gray-50">
                    <FiGlobe className="h-5 w-5 mr-2 text-indigo-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Website/Blog</p>
                      <p className="font-medium">
                        <a href={currentApplication.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {currentApplication.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {currentApplication.podcast && (
                  <div className="flex items-start p-3 rounded-md border border-gray-100 bg-gray-50">
                    <Mic className="h-5 w-5 mr-2 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Podcast</p>
                      <p className="font-medium">{currentApplication.podcast}</p>
                    </div>
                  </div>
                )}
                {!currentApplication.instagram && !currentApplication.youtube && !currentApplication.tiktok && !currentApplication.website && !currentApplication.podcast && (
                  <div className="col-span-2 text-center py-4 text-gray-500 italic">
                    No platform details provided
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Additional Information */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-amber-800 flex items-center">
                <FiFileText className="h-5 w-5 mr-2 text-amber-600" />
                Additional Information
              </h3>
            </div>
            <div className="bg-white p-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Content Creation Experience</p>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">{currentApplication.experience || 'No information provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Partnership Goals</p>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">{currentApplication.goals || 'No information provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Why 10X?</p>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">{currentApplication.why || 'No information provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Content Schedule / Availability</p>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">{currentApplication.availability || 'No information provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Status */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-indigo-800 flex items-center">
                <FaRegListAlt className="h-5 w-5 mr-2 text-indigo-600" />
                Application Status
              </h3>
            </div>
            <div className="bg-white p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Application Date</p>
                  <p className="font-medium">{formatDateTime(currentApplication.applicationDate)}</p>
                </div>
                
                {currentApplication.status !== 'pending' && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Review Date</p>
                    <p className="font-medium">{formatDateTime(currentApplication.reviewDate)}</p>
                  </div>
                )}
              </div>
              
              {currentApplication.status === 'rejected' && currentApplication.rejectionReason && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Rejection Reason</p>
                  <div className="mt-1 p-3 bg-red-50 border border-red-100 rounded-md text-red-900">
                    {currentApplication.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 mt-4 animate-fadeIn" style={{animationDelay: '0.7s'}}>
            {currentApplication.status === 'approved' && (
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  resendCredentials(currentApplication._id);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-700 text-white p-2 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center rounded"
                disabled={resendingCredentials}
              >
                {resendingCredentials ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <FiSend className="mr-2" /> Resend Credentials
                  </>
                )}
              </Button>
            )}
            
            {currentApplication.status === 'pending' && (
              <Button
                onClick={() => {
                  setShowViewModal(false);
                  handleReviewApplication(currentApplication);
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-6 py-2 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center rounded"
              >
                <FiUserCheck className="mr-2" /> Review Application
              </Button>
            )}
            
            <Button
              onClick={() => {
                setShowViewModal(false);
                handleDeleteApplication(currentApplication);
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center rounded"
            >
              <FiTrash2 className="mr-2" /> Delete Application
            </Button>
            
            <Button
              onClick={() => setShowViewModal(false)}
              className="w-full sm:w-auto bg-gray-200 text-gray-800 px-6 py-2 hover:bg-gray-300 transition-colors flex items-center justify-center rounded"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    );
  };
  
  const renderReviewModal = () => {
    if (!currentApplication) return null;
    
    return (
      <Modal 
        isOpen={showReviewModal} 
        onClose={() => setShowReviewModal(false)} 
        size="lg"
        title={
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
              <FiList className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold">Review Application</h3>
          </div>
        }
      >
        <div className="p-5">
          <div className="mb-4 animate-fadeIn" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                {currentApplication.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-800">{currentApplication.fullName}</p>
                <p className="text-sm text-gray-500">{currentApplication.email}</p>
              </div>
            </div>
            
            <div className="mt-6 mb-6 border-t border-b border-gray-200 py-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
              <label className="block text-sm font-medium mb-2 text-gray-700">Review Status</label>
              <div className="flex gap-4">
                <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 shadow-sm">
                  <input
                    type="radio"
                    name="review-status"
                    value="approved"
                    checked={reviewStatus === 'approved'}
                    onChange={() => setReviewStatus('approved')}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <FiCheckCircle className="mr-2 text-green-500 h-5 w-5" />
                    <span className="text-green-700 font-medium">Approve Application</span>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors duration-200 shadow-sm">
                  <input
                    type="radio"
                    name="review-status"
                    value="rejected"
                    checked={reviewStatus === 'rejected'}
                    onChange={() => setReviewStatus('rejected')}
                    className="mr-2"
                  />
                  <div className="flex items-center">
                    <FiXCircle className="mr-2 text-red-500 h-5 w-5" />
                    <span className="text-red-700 font-medium">Reject Application</span>
                  </div>
                </label>
              </div>
            </div>
            
            {reviewStatus === 'rejected' && (
              <div className="mb-4 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Rejection Reason (Required)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this application..."
                  className="w-full border rounded-md p-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  required
                />
              </div>
            )}
            
            {reviewStatus === 'approved' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4 animate-fadeIn" style={{animationDelay: '0.3s'}}>
                <p className="text-yellow-700 font-medium flex items-start">
                  <FiCheckCircle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>By approving this application:</span>
                </p>
                <ul className="list-disc list-inside text-sm text-yellow-700 pl-8 mt-2 space-y-1">
                  <li>A new partner account will be created with the influencer's email</li>
                  <li>A secure password will be generated automatically</li>
                  <li>Login credentials will be sent to the influencer via email</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 border-t pt-4 mt-4 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <button 
              onClick={() => setShowReviewModal(false)}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200 flex items-center"
            >
              Cancel
            </button>
            <button 
              onClick={submitReview}
              disabled={reviewStatus === 'rejected' && !rejectionReason.trim()}
              className={`px-4 py-2 rounded-md text-white flex items-center shadow-md hover:shadow-lg transition-all duration-200 ${
                reviewStatus === 'approved' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              } ${reviewStatus === 'rejected' && !rejectionReason.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {reviewStatus === 'approved' ? (
                <>
                  <FiCheckCircle className="mr-2 h-5 w-5" />
                  Approve
                </>
              ) : (
                <>
                  <FiXCircle className="mr-2 h-5 w-5" />
                  Reject
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    );
  };
  
  const renderDeleteModal = () => {
    if (!currentApplication) return null;
    
    return (
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Application"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h3 className="text-xl text-gray-900 font-semibold text-center mb-4 quantico-bold">
            Delete Application
          </h3>
          
          <p className="text-gray-700 mb-6 text-center pt-sans-regular">
            Are you sure you want to delete the application from <strong>{currentApplication.fullName}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              className="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-md quantico-regular hover:bg-gray-300"
              disabled={deletingApplication}
            >
              Cancel
            </Button>
            
            <Button
              onClick={confirmDeleteApplication}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-5 py-2.5 rounded-md shadow-lg quantico-bold hover:shadow-xl transition-shadow"
              disabled={deletingApplication}
            >
              {deletingApplication ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete Application"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    );
  };
  
  return (
    <>
      <style>{customScrollbarStyles}</style>
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              INFLUENCER APPLICATIONS
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Manage and review influencer partner applications
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
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            {/* Search and Filter Buttons */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[400px] bg-white border border-black text-black py-3 px-4 pr-8 shadow-lg quantico-bold-italic text-lg focus:outline-none"
              />
              
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleFilterChange('all')}
                  className={`flex items-center px-4 py-3 shadow-lg quantico-bold-italic text-[16px] ${
                    statusFilter === 'all' 
                      ? 'bg-gradient-to-r from-black to-[#0821D2] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiUsers className="mr-2" /> All
                </Button>
                <Button 
                  onClick={() => handleFilterChange('pending')}
                  className={`flex items-center px-4 py-3 shadow-lg quantico-bold-italic text-[16px] ${
                    statusFilter === 'pending' 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiLoader className="mr-2" /> Pending
                </Button>
                <Button 
                  onClick={() => handleFilterChange('approved')}
                  className={`flex items-center px-4 py-3 shadow-lg quantico-bold-italic text-[16px] ${
                    statusFilter === 'approved' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiCheckCircle className="mr-2" /> Approved
                </Button>
                <Button 
                  onClick={() => handleFilterChange('rejected')}
                  className={`flex items-center px-4 py-3 shadow-lg quantico-bold-italic text-[16px] ${
                    statusFilter === 'rejected' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiXCircle className="mr-2" /> Rejected
                </Button>
              </div>
            </div>
          </div>

          {/* Rest of the component content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 p-4 rounded text-red-700 quantico-regular">
              <p>{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FiInbox className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 quantico-regular">No applications found</h3>
              <p className="text-gray-500 pt-sans-regular">
                {statusFilter !== 'all' 
                  ? `No ${statusFilter} applications match your criteria.` 
                  : 'There are no applications to display.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Applicant</th>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Platforms</th>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Followers</th>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Niche</th>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Status</th>
                      <th className="py-3 px-6 text-left quantico-bold-italic text-gray-800">Date</th>
                      <th className="py-3 px-6 text-right quantico-bold-italic text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(application => (
                      <tr key={application._id} className="border-b hover:bg-gray-100">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {application.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-md font-medium text-gray-900 quantico-regular">{application.fullName}</div>
                              <div className="text-sm text-gray-500 pt-sans-regular">{application.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 pt-sans-regular">
                          {getPlatformBadges(application.platforms)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 pt-sans-regular">
                          {application.followers || 'Not specified'}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 pt-sans-regular">
                          {application.niche || 'Not specified'}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 pt-sans-regular">
                          {formatDateTime(application.applicationDate)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-end">
                            <Button
                              onClick={() => handleViewApplication(application)}
                              className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                            >
                              View
                            </Button>
                            {application.status === 'pending' && (
                              <Button
                                onClick={() => handleReviewApplication(application)}
                                className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                              >
                                Review
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteApplication(application)}
                              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 md:mt-8 flex justify-center">
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
      
      {renderViewModal()}
      {renderReviewModal()}
      {renderDeleteModal()}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default InfluencerApplicationsPage; 