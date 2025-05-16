// src/components/Common/Button.jsx

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={clsx(
        'px-4 py-2 rounded font-medium transition-colors',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
