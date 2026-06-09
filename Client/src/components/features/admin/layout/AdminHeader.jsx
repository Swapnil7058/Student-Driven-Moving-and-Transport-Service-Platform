import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-sm px-6 py-4 rounded-lg mb-6">
      
      {/* Left Side */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 relative">

        {/* Notification Icon */}
        {/* <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <span className="hidden md:block text-sm font-medium">
              {user?.name || "Admin"}
            </span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default AdminHeader;