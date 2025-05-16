// src/pages/ContactMessagesPage.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FiMail, FiRefreshCw, FiTrash2, FiEye, FiCheck, FiArchive, FiClock } from "react-icons/fi";
import { format } from "date-fns";
import api from "../api/api";
import Button from "../components/Common/Button";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MetricCard from "../components/Users/MetricCard";
import Modal from "../components/Common/Modal";
import { CSVLink } from "react-csv";
import EnlargedX from "../assets/EnlargedX.png";
import PageLoader from '../components/Common/PageLoader';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyFormData, setReplyFormData] = useState({
    subject: '',
    message: ''
  });
  const [sendingReply, setSendingReply] = useState(false);
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [exportData, setExportData] = useState([]);

  // CSV headers for export
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Message", key: "message" },
    { label: "Status", key: "status" },
    { label: "Date", key: "createdAt" },
  ];

  // Fetch messages
  const fetchMessages = async (page = 1, search = "", status = "") => {
    setLoading(true);
    try {
      let url = `/contact?page=${page}`;
      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;

      const response = await api.get(url);
      
      if (response.data.success) {
        setMessages(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.data.message || "Failed to fetch messages");
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // Load metrics
  const loadMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const response = await api.get("/contact?limit=1000");
      
      if (response.data.success) {
        const allMessages = response.data.data;
        
        // Calculate metrics
        const metrics = {
          total: allMessages.length,
          new: allMessages.filter(msg => msg.status === 'new').length,
          inProgress: allMessages.filter(msg => msg.status === 'in-progress').length,
          resolved: allMessages.filter(msg => msg.status === 'resolved').length,
        };
        
        setMetrics(metrics);
        
        // Prepare export data
        const exportData = allMessages.map(msg => ({
          name: msg.name,
          email: msg.email,
          message: msg.message,
          status: msg.status,
          createdAt: format(new Date(msg.createdAt), "yyyy-MM-dd HH:mm:ss"),
        }));
        
        setExportData(exportData);
      }
    } catch (err) {
      toast.error("Failed to load metrics");
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMessages(currentPage, searchTerm, statusFilter);
    loadMetrics();
  }, [currentPage, searchTerm, statusFilter]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Update message status
  const updateMessageStatus = async (id, status) => {
    try {
      console.log(`Updating message ${id} to status: ${status}`);
      
      // Ensure status is one of the allowed values
      if (!['new', 'in-progress', 'resolved'].includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be 'new', 'in-progress', or 'resolved'`);
      }
      
      const response = await api.put(`/contact/${id}`, { status });
      
      if (response.data.success) {
        toast.success("Message status updated successfully");
        fetchMessages(currentPage, searchTerm, statusFilter);
        loadMetrics();
        if (isViewModalOpen) setIsViewModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update message status");
      }
    } catch (err) {
      console.error("Error updating message status:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update message status");
    }
  };

  // Delete message
  const deleteMessage = async () => {
    try {
      const response = await api.delete(`/contact/${currentMessage._id}`);
      
      if (response.data.success) {
        toast.success("Message deleted successfully");
        setIsDeleteModalOpen(false);
        fetchMessages(currentPage, searchTerm, statusFilter);
        loadMetrics();
      } else {
        throw new Error(response.data.message || "Failed to delete message");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete message");
    }
  };

  // Open view modal
  const openViewModal = async (message) => {
    setCurrentMessage(message);
    setIsViewModalOpen(true);
    
    // If message is new, mark it as read
    if (message.status === 'new') {
      await updateMessageStatus(message._id, 'read');
    }
  };

  // Open delete modal
  const openDeleteModal = (message) => {
    setCurrentMessage(message);
    setIsDeleteModalOpen(true);
  };

  // Open reply modal
  const openReplyModal = (message) => {
    setCurrentMessage(message);
    setReplyFormData({
      subject: `RE: Message from ${message.name}`,
      message: `Hello ${message.name},\n\nThank you for contacting us.\n\n\n\nBest regards,\nThe 10X Team`
    });
    setIsReplyModalOpen(true);
  };

  // Handle reply form change
  const handleReplyFormChange = (e) => {
    const { name, value } = e.target;
    setReplyFormData({
      ...replyFormData,
      [name]: value
    });
  };

  // Send reply email
  const sendReply = async () => {
    if (!replyFormData.subject || !replyFormData.message) {
      toast.error("Please provide both subject and message");
      return;
    }

    setSendingReply(true);
    try {
      const response = await api.post(`/contact/${currentMessage._id}/reply`, {
        subject: replyFormData.subject,
        message: replyFormData.message
      });
      
      if (response.data.success) {
        toast.success("Reply sent successfully");
        await updateMessageStatus(currentMessage._id, 'resolved');
        setIsReplyModalOpen(false);
        fetchMessages(currentPage, searchTerm, statusFilter);
      } else {
        throw new Error(response.data.message || "Failed to send reply");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  // Trigger CSV download
  const triggerCSVDownload = () => {
    document.getElementById("csvDownloadButton").click();
  };

  if (loading) {
    return (
      <PageLoader 
        title="Loading Messages" 
        subtitle="Please wait while we fetch contact messages..."
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] rounded-lg shadow-xl mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="px-6 py-6 md:px-10 w-full md:w-1/2 flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-bold text-white quantico-bold-italic">
              CONTACT MESSAGES
            </h1>
            <p className="text-blue-100 mt-2 pt-sans-regular">
              Manage and respond to customer inquiries and feedback
            </p>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 h-32 overflow-hidden items-center justify-end mr-24">
            <img
              className="w-32 object-cover transition-transform duration-[2000ms] ease-in-out transform hover:-translate-y-10"
              src={EnlargedX}
              alt="10X Logo"
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard
          title="Total Messages"
          value={metrics.total}
          isLoading={loadingMetrics}
          iconType="total"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-lg"
        />
        <MetricCard
          title="New Messages"
          value={metrics.new}
          isLoading={loadingMetrics}
          iconType="new"
          className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg"
        />
        <MetricCard
          title="In Progress"
          value={metrics.inProgress}
          isLoading={loadingMetrics}
          iconType="inProgress"
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 shadow-lg"
        />
        <MetricCard
          title="Resolved Messages"
          value={metrics.resolved}
          isLoading={loadingMetrics}
          iconType="resolved"
          className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-500 shadow-lg"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          {/* Search, Filter, and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto mb-4 md:mb-0">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full md:w-[400px] bg-white border border-black text-black py-3 px-4 pr-8 shadow-lg quantico-bold-italic text-lg focus:outline-none"
            />

            {/* Status Filter */}
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                className={`px-4 py-3 rounded-md quantico-bold-italic text-base shadow-md ${
                  statusFilter === "" ? "bg-[#0821D2] text-white" : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
                onClick={() => handleStatusFilter("")}
              >
                All
              </button>
              <button
                className={`px-4 py-3 rounded-md quantico-bold-italic text-base shadow-md ${
                  statusFilter === "new" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
                onClick={() => handleStatusFilter("new")}
              >
                New
              </button>
              <button
                className={`px-4 py-3 rounded-md quantico-bold-italic text-base shadow-md ${
                  statusFilter === "in-progress" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
                onClick={() => handleStatusFilter("in-progress")}
              >
                In Progress
              </button>
              <button
                className={`px-4 py-3 rounded-md quantico-bold-italic text-base shadow-md ${
                  statusFilter === "resolved" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
                onClick={() => handleStatusFilter("resolved")}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 w-full md:w-auto">
            <Button
              onClick={() => fetchMessages(currentPage, searchTerm, statusFilter)}
              className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white px-4 py-3 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" /> Refresh
            </Button>
            <Button
              onClick={triggerCSVDownload}
              className="bg-gradient-to-r from-[#A467F7] to-[#4C03CB] text-white px-4 py-3 md:px-6 md:py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center justify-center"
            >
              <FiMail className="mr-2" /> Export CSV
            </Button>
            <CSVLink
              id="csvDownloadButton"
              data={exportData}
              headers={csvHeaders}
              filename={`contact-messages-${new Date().toISOString().split('T')[0]}.csv`}
              className="hidden"
            />
          </div>
        </div>

        {/* Messages Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center my-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl md:text-2xl text-black quantico-regular">No messages found</p>
            </div>
          ) : (
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white">
                <tr>
                  <th className="py-4 px-6 text-left quantico-bold-italic text-base md:text-lg">
                    Name
                  </th>
                  <th className="py-4 px-6 text-left quantico-bold-italic text-base md:text-lg">
                    Email
                  </th>
                  <th className="py-4 px-6 text-left quantico-bold-italic text-base md:text-lg">
                    Message
                  </th>
                  <th className="py-4 px-6 text-left quantico-bold-italic text-base md:text-lg">
                    Status
                  </th>
                  <th className="py-4 px-6 text-left quantico-bold-italic text-base md:text-lg">
                    Date
                  </th>
                  <th className="py-4 px-6 text-right quantico-bold-italic text-base md:text-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr
                    key={message._id}
                    className="border-b hover:bg-gray-50 transition duration-150"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium quantico-regular text-black">
                        {message.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center pt-sans-regular">
                        <FiMail className="mr-2 text-[#0821D2]" />
                        {message.email}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="truncate max-w-xs pt-sans-regular">
                        {message.message}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          message.status === "new"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : message.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : message.status === "resolved"
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                            : "bg-gray-100 text-gray-800 border border-gray-300"
                        }`}
                      >
                        {message.status === "in-progress" ? "In Progress" : message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 pt-sans-regular">
                      {format(new Date(message.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => openViewModal(message)}
                          className="text-[#0821D2] hover:text-blue-800 bg-blue-50 p-2 rounded-md transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(message)}
                          className="text-red-600 hover:text-red-800 bg-red-50 p-2 rounded-md transition-colors duration-200"
                          title="Delete Message"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md shadow-md quantico-bold-italic ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0821D2] text-white hover:bg-blue-700 transition-colors"
                }`}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md shadow-md quantico-bold-italic ${
                    currentPage === i + 1
                      ? "bg-[#0B0B45] text-white"
                      : "bg-[#0821D2] text-white hover:bg-blue-700 transition-colors"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md shadow-md quantico-bold-italic ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#0821D2] text-white hover:bg-blue-700 transition-colors"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* View Message Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="MESSAGE DETAILS"
        size="lg"
      >
        {currentMessage && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg shadow-md border-l-4 border-[#0821D2]">
                <h3 className="text-xl quantico-bold-italic text-[#0821D2] mb-4">Contact Information</h3>
                <p className="mb-3 pt-sans-regular">
                  <span className="font-bold">Name:</span> {currentMessage.name}
                </p>
                <p className="mb-3 pt-sans-regular">
                  <span className="font-bold">Email:</span> {currentMessage.email}
                </p>
                <p className="pt-sans-regular">
                  <span className="font-bold">Phone:</span>{" "}
                  {currentMessage.phone || "Not provided"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
                <h3 className="text-xl quantico-bold-italic text-indigo-700 mb-4">Message Details</h3>
                <p className="mb-3 pt-sans-regular">
                  <span className="font-bold">Date:</span>{" "}
                  {format(
                    new Date(currentMessage.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
                <p className="pt-sans-regular">
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ml-2 ${
                      currentMessage.status === "new"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : currentMessage.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : currentMessage.status === "resolved"
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}
                  >
                    {currentMessage.status === "in-progress" ? "In Progress" : currentMessage.status.charAt(0).toUpperCase() + currentMessage.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl quantico-bold-italic text-[#0821D2] mb-4">Message Content</h3>
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-inner">
                <p className="whitespace-pre-wrap break-words pt-sans-regular">
                  {currentMessage.message}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end">
              {currentMessage.status !== "in-progress" && (
                <Button
                  onClick={() =>
                    updateMessageStatus(currentMessage._id, "in-progress")
                  }
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center"
                >
                  <FiClock className="mr-2" /> Mark In Progress
                </Button>
              )}
              {currentMessage.status !== "resolved" && (
                <Button
                  onClick={() =>
                    updateMessageStatus(currentMessage._id, "resolved")
                  }
                  className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center"
                >
                  <FiCheck className="mr-2" /> Mark as Resolved
                </Button>
              )}
              <Button
                onClick={() => openReplyModal(currentMessage)}
                className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center"
              >
                <FiMail className="mr-2" /> Reply
              </Button>
              <Button
                onClick={() => openDeleteModal(currentMessage)}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center"
              >
                <FiTrash2 className="mr-2" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="CONFIRM DELETION"
        size="sm"
      >
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <p className="text-red-700 font-medium">
              Are you sure you want to delete this message? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-200 text-gray-800 px-4 py-3 shadow-md quantico-bold-italic hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={deleteMessage}
              className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-3 shadow-lg quantico-bold-italic hover:shadow-xl transition-shadow"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        title="SEND REPLY"
        size="lg"
      >
        {currentMessage && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg shadow-md border-l-4 border-[#0821D2]">
                <h3 className="text-xl quantico-bold-italic text-[#0821D2] mb-4">Recipient</h3>
                <p className="mb-2 pt-sans-regular">
                  <span className="font-bold">Name:</span> {currentMessage.name}
                </p>
                <p className="pt-sans-regular">
                  <span className="font-bold">Email:</span> {currentMessage.email}
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
                <h3 className="text-xl quantico-bold-italic text-indigo-700 mb-4">Original Message</h3>
                <div className="max-h-32 overflow-y-auto">
                  <p className="whitespace-pre-wrap break-words pt-sans-regular text-sm">
                    {currentMessage.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="subject" className="block text-lg font-medium text-[#0821D2] quantico-bold-italic mb-2">
                Email Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={replyFormData.subject}
                onChange={handleReplyFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0821D2] shadow-md"
                placeholder="Enter email subject line"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="message" className="block text-lg font-medium text-[#0821D2] quantico-bold-italic mb-2">
                Your Reply
              </label>
              <textarea
                id="message"
                name="message"
                value={replyFormData.message}
                onChange={handleReplyFormChange}
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0821D2] shadow-md"
                placeholder="Type your reply message here..."
              ></textarea>
              <p className="text-sm text-gray-500 mt-2 pt-sans-regular italic">
                This message will be sent directly to the customer with minimal branding and formatting.  
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setIsReplyModalOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-3 shadow-md quantico-bold-italic hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Button>
              <Button
                onClick={sendReply}
                disabled={sendingReply}
                className="bg-gradient-to-r from-[#0821D2] to-[#0B0B45] text-white px-4 py-3 shadow-lg quantico-bold-italic text-[16px] hover:shadow-xl transition-shadow flex items-center"
              >
                {sendingReply ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" /> Sending...
                  </>
                ) : (
                  <>
                    <FiMail className="mr-2" /> Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessagesPage;
