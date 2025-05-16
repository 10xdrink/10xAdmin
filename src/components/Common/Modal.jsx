// src/components/Common/Modal.jsx

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Modal component using React Portals
 * @param {Object} props - Component props
 * @param {Boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {String} [props.title=''] - Modal title
 * @param {React.ReactNode} [props.children=null] - Modal content
 * @param {Boolean} [props.fullWidth=false] - Whether to use full width styling
 * @param {String} [props.size='md'] - Size of the modal (sm, md, lg, xl, full)
 * @returns {JSX.Element|null}
 */
const Modal = ({ 
  isOpen, 
  onClose, 
  title = '', 
  children = null, 
  fullWidth = false,
  size = 'md'
}) => {
  if (!isOpen) return null;

  // Ensure that modal-root exists in the DOM
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error("Modal root element with id 'modal-root' not found in index.html.");
    return null;
  }

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Determine max width based on size prop
  const getMaxWidthClass = () => {
    switch(size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case '2xl': return 'max-w-6xl';
      case 'full': return 'max-w-[90%] sm:max-w-[85%] md:max-w-[80%]';
      default: return 'max-w-lg';
    }
  };

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      onClick={(e) => {
        // Close modal when clicking outside content area
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop with animation */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
        style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
      />
      
      {/* Modal container */}
      <div 
        className={`relative w-full ${getMaxWidthClass()} rounded-lg shadow-2xl overflow-hidden animate-scaleIn`}
        style={{ animation: 'scaleIn 0.3s ease-out forwards' }}
      >
        {/* Glass effect for premium look */}
        <div className={`bg-white dark:bg-gray-800 w-full h-full ${fullWidth ? 'flex flex-col' : ''}`}>
          {/* Modal header */}
          <div className={`flex justify-between items-center p-5 ${fullWidth ? 'border-b border-gray-200 dark:border-gray-700' : 'mb-2'}`}>
            <div className="flex-1">
              {typeof title === 'string' ? (
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
              ) : (
                title
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close Modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          {/* Modal body */}
          <div className={fullWidth ? 'flex-1 overflow-auto' : ''}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
};

export default Modal;
