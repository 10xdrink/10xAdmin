// src/pages/InviteUserPage.jsx

import React, { useState } from 'react';
import InviteUser from '../components/Users/InviteUser';
import { useUsers } from '../contexts/UserContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cancelInvitation } from '../api/userService';

const InviteUserPage = () => {
  const { inviteUser } = useUsers();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Handle user invitation
  const handleInvite = async (email, role) => {
    setLoading(true);
    setErrorMessage('');
    setPendingEmail('');
    setShowCancelButton(false);
    
    try {
      await inviteUser(email, role);
      toast.success('Invitation sent successfully!');
      setIsSuccess(true);
    } catch (err) {
      console.error('Invitation Error:', err);
      
      // Get a user-friendly error message based on the error code or message
      let displayMessage = '';
      if (err.code === 'USER_EXISTS') {
        displayMessage = `An account with the email ${email} already exists. You cannot invite existing users.`;
      } else if (err.code === 'INVITATION_EXISTS') {
        displayMessage = `An invitation has already been sent to ${email} and is still pending.`;
        // Show cancel button for this specific error
        setShowCancelButton(true);
        setPendingEmail(email);
      } else if (err.code === 'INVALID_EMAIL') {
        displayMessage = `${email} is not a valid email address.`;
      } else {
        // Generic error message with the actual error
        displayMessage = err?.message || String(err) || 'Failed to send invitation';
      }
      
      // Set both the toast and state error messages
      toast.error(displayMessage);
      setErrorMessage(displayMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle canceling a pending invitation
  const handleCancelInvitation = async () => {
    if (!pendingEmail) return;
    
    setLoading(true);
    try {
      await cancelInvitation(pendingEmail);
      toast.success(`Invitation for ${pendingEmail} canceled successfully!`);
      setErrorMessage('');
      setShowCancelButton(false);
      setPendingEmail('');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel invitation');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2">Invite New User</h1>
        <Link to="/users" className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors">
          Back to Users
        </Link>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-md">
        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Invitation Sent!</h2>
            <p className="text-gray-600 mb-6">Your invitation email has been sent successfully.</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setIsSuccess(false)} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Send Another Invitation
              </button>
              <Link 
                to="/users" 
                className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-md text-gray-700 transition-colors"
              >
                Return to Users
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">Send an invitation email to allow a new user to join your organization. They'll receive a link to set up their account.</p>
            
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                  
                  {showCancelButton && (
                    <div className="mt-3 ml-8">
                      <button
                        onClick={handleCancelInvitation}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                      >
                        {loading ? 'Canceling...' : 'Cancel Existing Invitation'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        You can cancel the existing invitation to send a new one
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <InviteUser onInvite={handleInvite} isLoading={loading} />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InviteUserPage;
