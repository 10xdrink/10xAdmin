import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiLoader, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiArrowLeft,
  FiDollarSign
} from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  // Map status to corresponding CSS class, icon and label
  const getStatusConfig = (status) => {
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return { 
          badgeClass: 'status-badge-warning',
          icon: <FiClock className="mr-1" />,
          label: 'Pending',
          pulse: true
        };
      case 'processing':
        return { 
          badgeClass: 'status-badge-info',
          icon: <FiLoader className="mr-1 animate-spin" />,
          label: 'Processing',
          pulse: false
        };
      case 'shipped':
        return { 
          badgeClass: 'status-badge-info',
          icon: <FiTruck className="mr-1" />,
          label: 'Shipped',
          pulse: false
        };
      case 'delivered':
        return { 
          badgeClass: 'status-badge-success',
          icon: <FiCheckCircle className="mr-1" />,
          label: 'Delivered',
          pulse: false
        };
      case 'cancelled':
        return { 
          badgeClass: 'status-badge-danger',
          icon: <FiXCircle className="mr-1" />,
          label: 'Cancelled',
          pulse: false
        };
      case 'returned':
        return { 
          badgeClass: 'status-badge-danger',
          icon: <FiArrowLeft className="mr-1" />,
          label: 'Returned',
          pulse: false
        };
      case 'refunded':
        return { 
          badgeClass: 'status-badge-danger',
          icon: <FiDollarSign className="mr-1" />,
          label: 'Refunded',
          pulse: false
        };
      default:
        return { 
          badgeClass: 'status-badge-info',
          icon: null,
          label: status,
          pulse: false
        };
    }
  };

  const { badgeClass, icon, label, pulse } = getStatusConfig(status);

  // Enhanced animation variants
  const badgeVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      y: 5
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)"
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.div
      className="relative inline-block"
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={badgeVariants}
    >
      {pulse && (
        <motion.span 
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: ['0 0 0 0px rgba(251, 191, 36, 0.4)', '0 0 0 4px rgba(251, 191, 36, 0)'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        />
      )}
      
      <motion.span
        className={`status-badge ${badgeClass} inline-flex items-center`}
        style={{ 
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          cursor: 'default'
        }}
      >
        {icon}
        <span>{label}</span>
      </motion.span>
    </motion.div>
  );
};

export default StatusBadge; 