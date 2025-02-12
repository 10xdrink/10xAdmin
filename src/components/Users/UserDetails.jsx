// src/components/Users/UserDetails.jsx

import React from 'react';
import Button from '../Common/Button';
import clsx from 'clsx';
import { formatDate } from '../../utils/helpers';

const UserDetails = ({ user, metrics, onEdit, onDeactivate, onResetPassword }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex flex-col md:flex-row items-start md:items-center">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <img
            className="h-24 w-24 rounded-full object-cover"
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.name}
          />
        </div>
        {/* User Information */}
        <div className="mt-4 md:mt-0 md:ml-6">
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="mt-2 text-gray-600">{user.email}</p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Role:</span>{" "}
            {user.role.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Registered At:</span>{" "}
            {formatDate(user.createdAt)}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Last Login:</span>{" "}
            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Login Frequency:</span> {metrics.loginFrequency} times/month
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Products Purchased:</span> {metrics.productPurchasedCount}
          </p>
          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={clsx(
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                {
                  'bg-green-100 text-green-800': user.isActive === true,
                  'bg-red-100 text-red-800': user.isActive === false,
                }
              )}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </p>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <Button onClick={onEdit} className="bg-green-500 hover:bg-green-600">
          Edit
        </Button>
        {user.isActive ? (
          <Button
            onClick={onDeactivate}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Deactivate
          </Button>
        ) : (
          <Button
            onClick={onDeactivate}
            className="bg-green-500 hover:bg-green-600"
          >
            Activate
          </Button>
        )}
        <Button
          onClick={onResetPassword}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          Reset Password
        </Button>
      </div>
      {/* Additional Sections can be added here */}
    </div>
  );
};

export default UserDetails;
