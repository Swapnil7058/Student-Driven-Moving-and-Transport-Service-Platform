import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../shared/Footer";
import Navbar from "../../Shared/Navbar";

const PublicLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
