// src/pages/UserListPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import BulkUpdate from "../components/Users/BulkUpdate";
import Pagination from "../components/Common/Pagination";
import Button from "../components/Common/Button";
import HighlightText from "../components/Users/HighlightText";
import { useUsers } from "../contexts/UserContext"; // Corrected import path
import usePagination from "../hooks/usePagination";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../utils/constants";
import { debounce } from "lodash";
import EnlargedX from "../assets/EnlargedX.png"; // Example image for top banner
import { Link } from "react-router-dom";
import MetricCard from "../components/Users/MetricCard"; // New MetricCard component

const UserListPage = () => {
  const {
    users,
    fetchUsers,
    loading,
    error,
    bulkUpdateUsers,
    exportUsers,
    deleteUser,
    changeUserStatus,
    getTotalUserCount,
    countUsersByRole,
    getNewUsersCount,
    getReturningUsersCount,
  } = useUsers();

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsers: 0,
    returningUsers: 0,
  });

  const { currentPage, setCurrentPage } = usePagination(totalPages, 1);
  const navigate = useNavigate();

  // Debounced fetch function to optimize API calls
  const debouncedFetchUsers = useMemo(
    () =>
      debounce(async (params) => {
        try {
          const data = await fetchUsers(params);
          setTotalPages(data.totalPages || 1);
        } catch (err) {
          toast.error(`Error fetching users: ${err}`);
        }
      }, 500),
    [fetchUsers]
  );

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      };
      await debouncedFetchUsers(params);
      await loadMetrics();
    };
    fetchData();

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [
    debouncedFetchUsers,
    currentPage,
    searchQuery,
    roleFilter,
    sortField,
    sortOrder,
  ]);

  // Function to load metrics
  const loadMetrics = async () => {
    try {
      const total = await getTotalUserCount();
      const rolesCount = await countUsersByRole();
      const newUsers = await getNewUsersCount();
      const returningUsers = await getReturningUsersCount();

      // Calculate active and inactive users based on roles
      const activeRoles = Object.values(USER_ROLES).filter(
        (role) => role !== "inactive"
      );
      const active = rolesCount
        .filter((rc) => activeRoles.includes(rc.role))
        .reduce((acc, rc) => acc + rc.count, 0);
      const inactive = rolesCount.find((rc) => rc.role === "inactive")?.count || 0;

      setMetrics({
        totalUsers: total,
        activeUsers: active,
        inactiveUsers: inactive,
        newUsers: newUsers,
        returningUsers: returningUsers,
      });
    } catch (err) {
      toast.error(`Error loading metrics: ${err}`);
    }
  };

  // Handle selection of individual user or all users
  const handleSelect = (id) => {
    if (Array.isArray(id)) {
      // Select all users
      setSelectedUserIds(id);
    } else {
      setSelectedUserIds((prev) =>
        prev.includes(id)
          ? prev.filter((userId) => userId !== id)
          : [...prev, id]
      );
    }
  };

  // Handle bulk update action
  const handleBulkUpdate = async (updates) => {
    try {
      await bulkUpdateUsers(updates);
      toast.success("Bulk update successful.");
      setSelectedUserIds([]);
      // Refetch users to reflect updates
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
      await loadMetrics();
    } catch (err) {
      toast.error(`Bulk update failed: ${err}`);
    }
  };

  // Handle exporting users
  const handleExport = async () => {
    try {
      await exportUsers("csv");
      toast.success("Users exported successfully.");
    } catch (err) {
      toast.error(`Export failed: ${err}`);
    }
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully.");
      // Refetch users to reflect deletion
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
      await loadMetrics();
    } catch (err) {
      toast.error(`Failed to delete user: ${err}`);
    }
  };

  // Handle changing user status (activate/deactivate)
  const handleChangeUserStatus = async (id, isActive) => {
    try {
      await changeUserStatus(id, isActive);
      toast.success(
        `User has been ${isActive ? "activated" : "deactivated"} successfully.`
      );
      // Refetch users to reflect status change
      fetchUsers({
        page: currentPage,
        limit: 10,
        query: searchQuery,
        role: roleFilter,
        sortField,
        sortOrder,
      });
      await loadMetrics();
    } catch (err) {
      toast.error(`Failed to change user status: ${err}`);
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc"); // Reset to ascending when changing field
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle navigation to Create User page
  const navigateToCreateUser = () => {
    navigate("/users/create");
  };

  // Status Options for Filter Dropdown (if applicable)
  const statusOptions = ["Active", "Inactive", "Pending", "Suspended"];

  return (
    <>
      {/* Top Banner */}
      <div className="main-div bg-gradient-to-r from-[#A467F7] to-[#4C03CB] flex flex-col md:flex-row items-center">
        <div className="left-col px-6 py-12 md:px-20 md:py-28 w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-6xl md:text-8xl lg:text-9xl quantico-bold-italic text-white text-center md:text-left">
            Users
          </h1>
          <p className="text-white pt-sans-regular text-xl md:text-2xl mt-4 text-center md:text-left">
            Manage your users efficiently!
          </p>
        </div>
        <div className="right-col hidden md:flex w-full md:w-1/2 h-48 md:h-[400px] overflow-hidden items-center justify-center mt-6 md:mt-0">
          <img
            className="w-44 md:w-[360px] object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-20 md:hover:-translate-y-96"
            src={EnlargedX}
            alt="Enlarged"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-start py-10 md:py-20 bg-gray-100 min-h-screen">
        <div className="w-full px-4 md:px-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <MetricCard title="Total Users" value={metrics.totalUsers} />
            <MetricCard title="Active Users" value={metrics.activeUsers} />
            <MetricCard title="Inactive Users" value={metrics.inactiveUsers} />
            <MetricCard title="New Users" value={metrics.newUsers} />
            <MetricCard title="Returning Users" value={metrics.returningUsers} />
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
            {/* Search, Filter, and Action Buttons */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[400px] bg-white border border-black text-black py-3 px-4 pr-8 shadow-lg quantico-bold-italic text-lg focus:outline-none"
              />

              <div className="relative w-full md:w-auto">
                <button
                  type="button"
                  className="w-full md:w-60 bg-white border border-black text-black py-3 px-4 pr-8 shadow-lg quantico-bold-italic text-lg focus:outline-none"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  {roleFilter
                    ? roleFilter
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : "All Roles"}
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <i className="fa-solid fa-chevron-down"></i>
                  </span>
                </button>
                {isRoleDropdownOpen && (
                  <div className="absolute z-10 w-full md:w-60 bg-white shadow-lg border border-black mt-1 rounded-md">
                    <ul>
                      <li
                        onClick={() => {
                          setRoleFilter("");
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`p-3 hover:bg-gray-200 cursor-pointer quantico-regular ${
                          roleFilter === "" ? "bg-gray-200" : ""
                        }`}
                      >
                        All Roles
                      </li>
                      {Object.values(USER_ROLES).map((role) => (
                        <li
                          key={role}
                          onClick={() => {
                            setRoleFilter(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`p-3 hover:bg-gray-200 cursor-pointer quantico-regular ${
                            roleFilter === role ? "bg-gray-200" : ""
                          }`}
                        >
                          {role
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
                <BulkUpdate
                  selectedUserIds={selectedUserIds}
                  onBulkUpdate={handleBulkUpdate}
                />
                <Button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-3 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                >
                  <i className="fa-solid fa-file-export"></i> Export Users
                </Button>
                <Button
                  onClick={navigateToCreateUser}
                  className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-3 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                >
                  <i className="fa-solid fa-user-pen"></i> Create New User
                </Button>
                <Link to="/invite-user" className="">
                  <Button className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-3 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow">
                    <i className="fa-solid fa-user-plus"></i> Invite User
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-4 text-lg md:text-xl text-black quantico-regular">
              Loading users...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-red-500 text-center mb-4 text-lg md:text-xl quantico-regular">
              {error}
            </div>
          )}

          {/* User List */}
          {!loading && !error && (
            <>
              {users.length === 0 ? (
                <p className="text-center text-xl md:text-2xl text-black quantico-regular">
                  No users found.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="py-3 px-6 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUserIds.length === users.length}
                            onChange={(e) =>
                              handleSelect(
                                e.target.checked
                                  ? users.map((user) => user._id)
                                  : []
                              )
                            }
                            className="form-checkbox h-5 w-5 text-indigo-600"
                          />
                        </th>
                        <th
                          className="py-3 px-6 text-left cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          Name
                          {sortField === "name" && (
                            <i
                              className={`ml-2 fas ${
                                sortOrder === "asc"
                                  ? "fa-arrow-up"
                                  : "fa-arrow-down"
                              }`}
                            ></i>
                          )}
                        </th>
                        <th
                          className="py-3 px-6 text-left cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          Email
                          {sortField === "email" && (
                            <i
                              className={`ml-2 fas ${
                                sortOrder === "asc"
                                  ? "fa-arrow-up"
                                  : "fa-arrow-down"
                              }`}
                            ></i>
                          )}
                        </th>
                        <th
                          className="py-3 px-6 text-left cursor-pointer"
                          onClick={() => handleSort("role")}
                        >
                          Role
                          {sortField === "role" && (
                            <i
                              className={`ml-2 fas ${
                                sortOrder === "asc"
                                  ? "fa-arrow-up"
                                  : "fa-arrow-down"
                              }`}
                            ></i>
                          )}
                        </th>
                        <th
                          className="py-3 px-6 text-left cursor-pointer"
                          onClick={() => handleSort("isActive")}
                        >
                          Status
                          {sortField === "isActive" && (
                            <i
                              className={`ml-2 fas ${
                                sortOrder === "asc"
                                  ? "fa-arrow-up"
                                  : "fa-arrow-down"
                              }`}
                            ></i>
                          )}
                        </th>
                        <th className="py-3 px-6 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b hover:bg-gray-100"
                        >
                          <td className="py-4 px-6">
                            <input
                              type="checkbox"
                              checked={selectedUserIds.includes(user._id)}
                              onChange={() => handleSelect(user._id)}
                              className="styled-checkbox form-checkbox h-5 w-5 text-indigo-600"
                            />
                          </td>

                          <td className="py-4 px-6">
                            <HighlightText
                              text={user.name}
                              highlight={searchQuery}
                            />
                          </td>
                          <td className="py-4 px-6">
                            <HighlightText
                              text={user.email}
                              highlight={searchQuery}
                            />
                          </td>
                          <td className="py-4 px-6">
                            {user.role
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (c) => c.toUpperCase())}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-white text-sm ${
                                user.isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                              <Button
                                onClick={() => navigate(`/users/${user._id}`)}
                                className="bg-gradient-to-r from-black to-[#0821D2] text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                              >
                                View
                              </Button>
                              <Button
                                onClick={() =>
                                  navigate(`/users/edit/${user._id}`)
                                }
                                className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(user._id)}
                                className="bg-gradient-to-r from-[#e27e10] to-[#f4ae3f] text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow"
                              >
                                Delete
                              </Button>
                              <Button
                                onClick={() =>
                                  handleChangeUserStatus(
                                    user._id,
                                    !user.isActive
                                  )
                                }
                                className={`${
                                  user.isActive
                                    ? "bg-gradient-to-r from-[#82e92d] to-[#53a609]"
                                    : "bg-gradient-to-r from-[#e27e10] to-[#f4ae3f]"
                                } text-white px-4 py-2 sm:px-6 sm:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow`}
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 md:mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchUsers({
                    page,
                    limit: 10,
                    query: searchQuery,
                    role: roleFilter,
                    sortField,
                    sortOrder,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserListPage;
