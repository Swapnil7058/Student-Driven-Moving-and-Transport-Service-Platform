import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./Index.css";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// import { AuthProvider } from "./components/context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
