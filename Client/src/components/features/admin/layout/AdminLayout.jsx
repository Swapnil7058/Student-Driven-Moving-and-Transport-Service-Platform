import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-64 z-50 md:hidden"
            >
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 md:p-8">

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden mb-4 p-2 bg-black text-white rounded"
        >
          ☰
        </button>

        {/* 🔥 New Header */}
        <AdminHeader />

        {/* Page Content */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;