import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiUser, FiMail, FiPhone, FiGlobe, FiLink, 
  FiBarChart2, FiFileText, FiMessageSquare, FiCheck, FiClock,
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

const PartnerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await fetch(`${API_BASE_URL}/influencers/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch partner details. Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPartner(data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partner details:', err);
        setError(err.message);
        setLoading(false);
        toast.error(`Error loading partner details: ${err.message}`);
      }
    };
    
    fetchPartnerDetails();
  }, [id]);

  const handleDeletePartner = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      // Check if user ID exists
      if (!partner.user || !partner.user._id) {
        // If no user account exists, delete just the application
        const response = await fetch(`${API_BASE_URL}/influencers/${partner._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete influencer application. Status: ${response.status}`);
        }
      } else {
        // Delete the influencer user account
        const response = await fetch(`${API_BASE_URL}/influencers/user/${partner.user._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // Try to parse error message from response
          try {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete influencer. Status: ${response.status}`);
          } catch (jsonError) {
            throw new Error(`Failed to delete influencer. Status: ${response.status}`);
          }
        }
      }
      
      toast.success('Influencer successfully deleted');
      
      // Redirect back to partners list after a slight delay
      setTimeout(() => {
        navigate('/admin/influencer-partners');
      }, 1500);
      
    } catch (err) {
      console.error('Error deleting influencer:', err);
      toast.error(`Error deleting influencer: ${err.message}`);
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded text-red-700 quantico-regular max-w-4xl mx-auto mt-8">
        <p>{error}</p>
        <Button 
          onClick={() => navigate('/admin/influencer-partners')}
          className="mt-4 bg-blue-600 text-white px-4 py-2"
        >
          <FiArrowLeft className="mr-2" /> Back to Partners
        </Button>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="bg-yellow-100 p-4 rounded text-yellow-700 quantico-regular max-w-4xl mx-auto mt-8">
        <p>Partner not found.</p>
        <Button 
          onClick={() => navigate('/admin/influencer-partners')}
          className="mt-4 bg-blue-600 text-white px-4 py-2"
        >
          <FiArrowLeft className="mr-2" /> Back to Partners
        </Button>
      </div>
    );
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="text-pink-500 h-6 w-6" />;
      case 'youtube':
        return <Youtube className="text-red-500 h-6 w-6" />;
      case 'tiktok':
        return <Smartphone className="text-blue-500 h-6 w-6" />;
      case 'blog':
        return <FaRegListAlt className="text-indigo-500 h-6 w-6" />;
      case 'podcast':
        return <Mic className="text-purple-500 h-6 w-6" />;
      default:
        return <FiGlobe className="text-gray-500 h-6 w-6" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <Button 
        onClick={() => navigate('/admin/influencer-partners')}
        className="mb-6 flex items-center quantico-bold text-sm bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back to Partners
      </Button>
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-xl shadow-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600 shadow-lg mr-8 mb-4 md:mb-0 border-4 border-white">
            {partner.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic mb-2">
              {partner.fullName}
            </h1>
            <p className="text-blue-100 text-xl mb-4">
              {partner.niche} Content Creator • Partner since {partner.reviewDate ? formatDateTime(partner.reviewDate) : 'Today'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {partner.platforms.map(platform => (
                <span 
                  key={platform}
                  className="px-4 py-2 bg-blue-900 bg-opacity-50 text-white rounded-full flex items-center text-sm shadow-md"
                >
                  {getPlatformIcon(platform)}
                  <span className="ml-2">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Contact & Partnership Info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold quantico-bold-italic text-gray-800 mb-6 border-b pb-3">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FiMail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-medium">Email</p>
                  <a href={`mailto:${partner.email}`} className="text-blue-600 hover:underline text-lg">{partner.email}</a>
                </div>
              </div>
              
              {partner.whatsapp && (
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FiPhone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 font-medium">WhatsApp</p>
                    <p className="text-lg">{partner.whatsapp}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <FiMessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-medium">Contact Preference</p>
                  <p className="capitalize text-lg">{partner.contactPreference}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold quantico-bold-italic text-gray-800 mb-6 border-b pb-3">Partnership Status</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <FiClock className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-medium">Application Date</p>
                  <p className="text-lg">{formatDateTime(partner.applicationDate, 'Not recorded')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                  <FiCheck className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-medium">Approval Date</p>
                  <p className="text-lg">{formatDateTime(partner.reviewDate, 'Recently approved')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <FiUser className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 font-medium">Status</p>
                  <p>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Platform Details & Content Info */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold quantico-bold-italic text-gray-800 mb-6 border-b pb-3">Platform Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {partner.instagram && (
                <div className="flex items-start p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-pink-50 hover:border-pink-100 transition-colors">
                  <Instagram className="h-8 w-8 text-pink-500 mr-4 flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-gray-500 mb-1 font-medium">Instagram</p>
                    <a href={`https://instagram.com/${partner.instagram.replace('@', '')}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline text-lg truncate block"
                    >
                      {partner.instagram}
                    </a>
                  </div>
                </div>
              )}
              
              {partner.youtube && (
                <div className="flex items-start p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-red-50 hover:border-red-100 transition-colors">
                  <Youtube className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-gray-500 mb-1 font-medium">YouTube</p>
                    <a href={partner.youtube.startsWith('http') ? partner.youtube : `https://youtube.com/${partner.youtube}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline text-lg truncate block"
                    >
                      {partner.youtube}
                    </a>
                  </div>
                </div>
              )}
              
              {partner.tiktok && (
                <div className="flex items-start p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-colors">
                  <Smartphone className="h-8 w-8 text-blue-500 mr-4 flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-gray-500 mb-1 font-medium">TikTok</p>
                    <a href={`https://tiktok.com/@${partner.tiktok.replace('@', '')}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline text-lg truncate block"
                    >
                      {partner.tiktok}
                    </a>
                  </div>
                </div>
              )}
              
              {partner.website && (
                <div className="flex items-start p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-100 transition-colors">
                  <FiGlobe className="h-8 w-8 text-indigo-500 mr-4 flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-gray-500 mb-1 font-medium">Website/Blog</p>
                    <a href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline text-lg break-words overflow-hidden"
                       title={partner.website}
                    >
                      {partner.website}
                    </a>
                  </div>
                </div>
              )}
              
              {partner.podcast && (
                <div className="flex items-start p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-purple-50 hover:border-purple-100 transition-colors">
                  <Mic className="h-8 w-8 text-purple-500 mr-4 flex-shrink-0" />
                  <div className="min-w-0 w-full">
                    <p className="text-sm text-gray-500 mb-1 font-medium">Podcast</p>
                    <p className="text-lg truncate">{partner.podcast}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold quantico-bold-italic text-gray-800 mb-6 border-b pb-3">Content Information</h2>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Followers</h3>
              <p className="text-xl">
                <span className="inline-flex items-center px-4 py-2 rounded-full font-medium bg-indigo-100 text-indigo-800">
                  {partner.followers || 'Not specified'}
                </span>
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Content Experience</h3>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <p className="whitespace-pre-wrap text-lg break-words overflow-auto max-h-[300px]">
                  {partner.experience || 'No experience information provided.'}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Partnership Goals</h3>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <p className="whitespace-pre-wrap text-lg break-words overflow-auto max-h-[300px]">
                  {partner.goals || 'No goals information provided.'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-700">Availability</h3>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <p className="whitespace-pre-wrap text-lg break-words overflow-auto max-h-[300px]">
                  {partner.availability || 'No availability information provided.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Button - Add at the end of the component return, before the ToastContainer */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-red-800 mb-3 quantico-bold">Danger Zone</h2>
          <p className="text-red-700 mb-5 text-lg">
            Permanently delete this influencer account and all associated data. This action cannot be undone.
          </p>
          <Button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-md shadow-md flex items-center transition-colors"
          >
            <FiTrash2 className="mr-2" /> Delete Influencer
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center text-red-600 mb-6">
              <FiAlertTriangle className="h-10 w-10 mr-4" />
              <h3 className="text-2xl font-bold quantico-bold">Confirm Deletion</h3>
            </div>
            <p className="mb-5 text-lg">
              Are you sure you want to delete <span className="font-bold">{partner.fullName}</span>? This will permanently remove their account and all associated data.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-6 rounded-r-md">
              <p className="text-blue-700">
                <span className="font-semibold">Note:</span> A notification email will be sent to the influencer informing them that their account has been deleted.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePartner}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md flex items-center transition-colors"
              >
                {deleting ? (
                  <>
                    <FiLoader className="animate-spin h-5 w-5 mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="mr-2" /> Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default PartnerDetailsPage; 