// src/routes/AppRoutes.jsx

import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import UserListPage from "../pages/UserListPage";
import UserDetailsPage from "../pages/UserDetailsPage";
import UserEditPage from "../pages/UserEditPage";
import CreateUserPage from "../pages/CreateUserPage";
import BulkUpdatePage from "../pages/BulkUpdatePage";
import InviteUserPage from "../pages/InviteUserPage";
import EnhancedSettingsPage from "../pages/EnhancedSettingsPage";
import ProtectedRoute from "../components/Common/ProtectedRoute";
import Layout from "../components/Layout/Layout";
import CategoryListPage from "../pages/CategoryListPage";
import CouponListPage from "../pages/CouponListPage";
import FAQListPage from "../pages/FAQListPage";
import TagListPage from "../pages/TagListPage";
import ReviewListPage from "../pages/ReviewListPage";
import BlogListPage from "../pages/BlogListPage"; // Import BlogListPage
import CreateBlogPage from "../components/Blogs/CreateBlogPage"; // Import CreateBlogPage
import EditBlogPage from "../components/Blogs/EditBlogPage"; // Import EditBlogPage
import BlogDetailsPage from "../components/Blogs/BlogDetailsPage"; // Import BlogDetailsPage
import { USER_ROLES } from "../utils/constants";
import OrderListPage from "../components/Orders/OrderListPage"; // Import OrderListPage
import OrderDetailsPage from "../components/Orders/OrderDetailsPage"; // Import OrderDetailsPage
// Import Product Pages
import ProductListPage from "../pages/ProductListPage";
import ProductCreatePage from "../pages/ProductCreatePage";
import ProductEditPage from "../pages/ProductEditPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import InviteSignup from "../components/Users/InviteSignup"; // Import InviteSignup component
import NewsletterSubscribersPage from "../pages/NewsletterSubscribersPage"; // Import NewsletterSubscribersPage
import ContactMessagesPage from "../pages/ContactMessagesPage"; // Import ContactMessagesPage
import InfluencerApplicationsPage from "../pages/InfluencerApplicationsPage"; // Import InfluencerApplicationsPage
import InfluencerPartnersPage from "../pages/InfluencerPartnersPage"; // Import InfluencerPartnersPage
import PartnerDetailsPage from "../pages/PartnerDetailsPage"; // Import PartnerDetailsPage

const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      
      {/* User Signup via Invitation */}
      <Route 
        path="/signup" 
        element={
          !isAuthenticated ? (
            <InviteSignup />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } 
      />

      {/* Protected Routes Nested Under Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />


        {/* Users */}
        <Route path="users" element={<UserListPage />} />
        <Route path="users/create" element={<CreateUserPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
        <Route path="users/edit/:id" element={<UserEditPage />} />

        {/* Invite User */}
        <Route path="invite-user" element={<InviteUserPage />} />

        {/* Settings */}
        <Route path="settings" element={<EnhancedSettingsPage />} />

        {/* Categories */}
        <Route path="admin/categories" element={<CategoryListPage />} />
        <Route path="admin/categories/:id" element={<CategoryListPage />} />

        {/* Coupons */}
        <Route path="coupons" element={<CouponListPage />} />

        {/* FAQs */}
        <Route path="faqs" element={<FAQListPage />} />

        {/* Newsletter Subscribers */}
        <Route path="newsletter-subscribers" element={<NewsletterSubscribersPage />} />

        {/* Contact Messages */}
        <Route path="contact-messages" element={<ContactMessagesPage />} />

        {/* Tags */}
        <Route path="admin/tags" element={<TagListPage />} />


        {/* Orders */}
        <Route path="admin/orders" element={<OrderListPage />} />
        <Route path="admin/orders/:id" element={<OrderDetailsPage />} />

        {/* Reviews */}
        <Route
          path="admin/reviews"
          element={
            <ProtectedRoute roles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PRODUCT_MANAGER]}>
              <ReviewListPage />
            </ProtectedRoute>
          }
        />

        {/* Blogs */}
        <Route path="admin/blogs" element={<BlogListPage />} />
        <Route path="admin/blogs/create" element={<CreateBlogPage />} />
        <Route path="admin/blogs/edit/:id" element={<EditBlogPage />} />
        <Route path="admin/blogs/:id" element={<BlogDetailsPage />} />

        {/* Products */}
        <Route
          path="admin/products"
          element={
            <ProtectedRoute roles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PRODUCT_MANAGER]}>
              <ProductListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products/create"
          element={
            <ProtectedRoute roles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PRODUCT_MANAGER]}>
              <ProductCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products/edit/:id"
          element={
            <ProtectedRoute roles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PRODUCT_MANAGER]}>
              <ProductEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/products/:id"
          element={
            <ProtectedRoute roles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.PRODUCT_MANAGER]}>
              <ProductDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Influencer Applications */}
        <Route path="admin/influencer-applications" element={<InfluencerApplicationsPage />} />
        <Route path="admin/influencer-partners" element={<InfluencerPartnersPage />} />
        <Route path="admin/partners/:id" element={<PartnerDetailsPage />} />

        {/* Add more protected routes here */}
      </Route>

      {/* Redirect any unknown routes */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
