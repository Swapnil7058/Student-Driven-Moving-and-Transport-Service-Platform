import React, { Fragment, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";

// Public Pages
import PublicLayout from "./components/public/layout/PublicLayout.jsx";
import Home from "./components/public/Home.jsx";
import About from "./components/public/About.jsx";
import Contact from "./components/public/Contact.jsx";
import Services from "./components/public/Services.jsx";
import Pricing from "./components/public/Pricing.jsx";
import QuoteForm from "./components/features/customer/pages/Quote.jsx";
// import QuoteForm from "./components/features/customer/pages/QuoteForm.jsx";
import AuthPage from "./components/public/auth/AuthPage.jsx";
import ResetPasswordPage from "./components/public/auth/ResetPasswordPage.jsx";
import StudentRegister from "./components/public/StudentRegister.jsx";
import StudentJobAccept from "./components/public/StudentJobAccept.jsx";

// Customer routes
import CustomerDashboard from "./components/features/customer/pages/CustomerDashboard.jsx";
import CustomerProfile from "./components/features/customer/pages/CustomerProfile.jsx";
import CustomerQuotes from "./components/features/customer/pages/CustomerQuotes.jsx";
import CustomerQuoteDetails from "./components/features/customer/pages/CustomerQuoteDetails.jsx";
import CustomerSupport from "./components/features/customer/pages/customerSupport.jsx";
import CustomerFAQ from "./components/features/customer/pages/customerFaqs.jsx";
import CustomerLayout from "./components/features/customer/layout/CustomerLayout.jsx";

// Admin routes
import AdminDashboard from "./components/features/admin/pages/AdminDashboard.jsx";
import AdminQuoteDetails from "./components/features/admin/pages/AdminQuoteDetails.jsx";
import AdminJobDetails from "./components/features/admin/pages/AdminJobDetails.jsx";
import AdminOperations from "./components/features/admin/pages/AdminOperations.jsx";
import BookingSection from "./components/features/admin/pages/BookingSection.jsx";
import AdminLayout from "./components/features/admin/layout/AdminLayout.jsx";
import AdminStudents from "./components/features/admin/pages/AdminStudents";
import StudentDetails from "./components/features/admin/pages/StudentDetails.jsx";
import AdminPriceEstimator from "./components/features/admin/pages/AdminPriceEstimator.jsx";
import { socket } from "./socket-connection/socket.js";

function App() {

  useEffect(()=>{
    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    }

    const handleDisconnect = () =>{
      console.log("Socket disconnected");      
    }


    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () =>{
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };

  }, []);


  return (
    <Fragment>
      <Routes>
        {/* -------- PUBLIC ROUTES -------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/students/register" element={<StudentRegister />} />
          <Route path="/students/accept/:jobId" element={<StudentJobAccept />} />
        </Route>

        {/* -------- TEMPORARILY PUBLIC (PHASE-1) -------- */}
        <Route element={<ProtectedRoute />}>
          {/* -------- CUSTOMER ROUTES -------- */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="quote" element={<QuoteForm />} />
            <Route path="quotes" element={<CustomerQuotes />} />
            <Route path="quotes/:id" element={<CustomerQuoteDetails />} />
            <Route path="support" element={<CustomerSupport />} />
            <Route path="faqs" element={<CustomerFAQ />} />
            
          </Route>
          {/* -------- ADMIN ROUTES -------- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="quotes/:id" element={<AdminQuoteDetails />} />
            <Route
              path="/admin/quotes/:id/price-estimator"
              element={<AdminPriceEstimator />}
            />
            <Route path="bookings" element={<BookingSection />} />
            <Route path="operations" element={<AdminOperations />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="students/:studentId" element={<StudentDetails />} />
            <Route path="jobs/quote/:quoteId" element={<AdminJobDetails />} />
          </Route>
        </Route>

        {/* -------- FALLBACK -------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* <Footer /> */}
    </Fragment>
  );
}

export default App;
