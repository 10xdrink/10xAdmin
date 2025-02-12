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
 * @returns {JSX.Element|null}
 */
const Modal = ({ isOpen, onClose, title = '', children = null }) => {
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none focus:outline-none"
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    modalRoot
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Modal;
