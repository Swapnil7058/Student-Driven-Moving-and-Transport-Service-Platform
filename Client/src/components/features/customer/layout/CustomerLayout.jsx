import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";
import { useAuth } from "../../../../context/AuthContext";
import Navbar from "../../../Shared/Navbar";
import Footer from "../../../shared/Footer";
import { motion, AnimatePresence } from "framer-motion";

const CustomerLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="flex flex-1 relative">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CustomerSidebar />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />

              {/* Sliding Sidebar */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-64 bg-white z-50 md:hidden shadow-lg"
              >
                <CustomerSidebar />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 bg-slate-100 p-6">
          
          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden mb-4 p-2 bg-black text-white rounded"
          >
            ☰
          </button>

          <CustomerHeader username={user?.name || "Customer"} />
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CustomerLayout;