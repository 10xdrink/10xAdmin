// src/components/Sidebar.jsx

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiClipboard,
  FiMessageCircle,
  FiLogOut,
  FiShoppingBag,
  FiShoppingCart, // Imported FiShoppingCart for Orders
  FiSmile,
  FiBook,
  FiGift,
  FiHelpCircle,
  FiTag,
  FiMail, // Imported FiMail for Newsletter Subscribers
  FiMessageSquare, // Imported FiMessageSquare for Contact Messages
  FiUserPlus, // Imported FiUserPlus for Influencer Applications
  FiChevronDown,
  FiChevronRight,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

// Custom scrollbar styles
const scrollbarStyles = `
  .sidebar-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  .sidebar-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }
  .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const Sidebar = ({ isCollapsed }) => {
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({ influencers: false });

  const toggleSubmenu = (menu) => {
    if (!isCollapsed) {
      setExpandedMenus({
        ...expandedMenus,
        [menu]: !expandedMenus[menu]
      });
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Users", path: "/users", icon: <FiUsers /> },
    { name: "Products", path: "/admin/products", icon: <FiShoppingBag /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingCart /> },
    { name: "Categories", path: "/admin/categories", icon: <FiClipboard /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FiSmile /> },
    { name: "Blogs", path: "/admin/blogs", icon: <FiBook /> },
    // Influencers section now has submenu
    {
      name: "Influencers",
      icon: <FiUserPlus />,
      hasSubmenu: true,
      submenuKey: "influencers",
      submenuItems: [
        { name: "Applications", path: "/admin/influencer-applications", icon: <FiUserPlus /> },
        { name: "All Partners", path: "/admin/influencer-partners", icon: <FiUserCheck /> }
      ]
    },
    { name: "Coupons", path: "/coupons", icon: <FiGift /> },
    { name: "Newsletter", path: "/newsletter-subscribers", icon: <FiMail /> },
    { name: "Contact Messages", path: "/contact-messages", icon: <FiMessageSquare /> },
    { name: "FAQs", path: "/faqs", icon: <FiHelpCircle /> },
    { name: "Tags", path: "/admin/tags", icon: <FiTag /> },
    { name: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      <style>{scrollbarStyles}</style>
      <aside
        className={`bg-gray-100 dark:bg-gray-900 h-screen p-4 shadow-lg transition-width duration-300 flex flex-col ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Scrollable navigation section */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar pr-2">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <React.Fragment key={link.name}>
                {link.hasSubmenu ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleSubmenu(link.submenuKey)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg flex-shrink-0">{link.icon}</span>
                        {!isCollapsed && <span className="text-md truncate">{link.name}</span>}
                      </div>
                      {!isCollapsed && (
                        <span className="text-sm">
                          {expandedMenus[link.submenuKey] ? <FiChevronDown /> : <FiChevronRight />}
                        </span>
                      )}
                    </button>
                    
                    {(!isCollapsed && expandedMenus[link.submenuKey]) && (
                      <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                        {link.submenuItems.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-2 mt-1 rounded-md text-gray-700 dark:text-gray-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-black to-[#0821D2] text-white"
                                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
                              }`
                            }
                          >
                            <span className="text-sm flex-shrink-0">{subItem.icon}</span>
                            <span className="text-sm truncate">{subItem.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-md text-gray-800 dark:text-gray-200 ${
                        isActive
                          ? "bg-gradient-to-r from-black to-[#0821D2] text-white"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`
                    }
                  >
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    {!isCollapsed && <span className="text-md truncate">{link.name}</span>}
                  </NavLink>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Fixed logout button at bottom */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            {!isCollapsed && <span className="text-md">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
