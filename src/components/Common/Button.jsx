// src/components/Common/Button.jsx

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
        className,
        { 'opacity-50 cursor-not-allowed': disabled }
      )}
      {...rest}
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

Button.defaultProps = {
  onClick: () => {},
  type: 'button',
  className: '',
  disabled: false,
};

export default Button;
