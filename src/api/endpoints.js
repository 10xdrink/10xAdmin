// src/api/endpoints.js

const endpoints = {
  getUsers: '/users/admin/users',
  getUserById: (id) => `/users/admin/users/${id}`,
  createUser: '/users/admin/users',
  updateUser: (id) => `/users/admin/users/${id}`,
  deleteUser: (id) => `/users/admin/users/${id}`,
  resetUserPassword: (id) => `/users/admin/users/${id}/reset-password`,
  searchUsers: '/users/admin/users/search',
  exportUsers: '/users/admin/users/export',
  changeUserStatus: (id) => `/users/admin/users/${id}/status`,
  bulkUpdateUsers: '/users/admin/users/bulk-update',
  getUserActivity: (id) => `/users/admin/users/${id}/activity`,
  countUsersByRole: '/users/admin/users/count-by-role',
  countUsers: '/users/admin/users/count',
  getUserAuditLogs: (id) => `/users/admin/users/${id}/audit`,
  inviteUser: '/users/admin/users/invite',
};

export default endpoints;
