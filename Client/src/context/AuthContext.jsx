import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user {id, email, name}
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshUser = async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      setUser(null);
      throw new Error("Failed to refresh user");
    }

    const data = await res.json();
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login API Error:", error);
      return { success: false, message: "Server error during login." };
    }
  };

  const signup = async (name, phone, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }
      return { success: true, data };
    } catch (error) {
      console.error("Signup API Error:", error);
      return { success: false, message: "Server error during signup." };
    }
  };

  const sendPreSignupPhoneOtp = async (phone) => {
    const res = await fetch(`${API_BASE_URL}/auth/pre-signup/send-phone-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const verifyPreSignupPhoneOtp = async (phone, otp) => {
    const res = await fetch(
      `${API_BASE_URL}/auth/pre-signup/verify-phone-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const sendPreSignupEmailOtp = async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/pre-signup/send-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const verifyPreSignupEmailOtp = async (email, otp) => {
    const res = await fetch(
      `${API_BASE_URL}/auth/pre-signup/verify-email-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const resendSignupOtp = async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const verifySignupOtp = async (email, otp) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const verifyCustomerEmail = async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`);
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const getCustomerVerificationStatus = async (email) => {
    const queryEmail = encodeURIComponent(String(email || "").trim());
    const res = await fetch(
      `${API_BASE_URL}/auth/verification-status?email=${queryEmail}`,
    );
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data: data.data };
  };

  const resendCustomerEmailVerification = async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/resend-email-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const forgotPassword = async (email) => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const resetPassword = async (token, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message };
    }
    return { success: true, data };
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear user state regardless of server response
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    setUser(data.user);
    return data.user;
  };

  const authContextValue = {
    user,
    isLoading,
    login,
    signup,
    sendPreSignupPhoneOtp,
    verifyPreSignupPhoneOtp,
    sendPreSignupEmailOtp,
    verifyPreSignupEmailOtp,
    resendSignupOtp,
    verifySignupOtp,
    verifyCustomerEmail,
    getCustomerVerificationStatus,
    resendCustomerEmailVerification,
    forgotPassword,
    resetPassword,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
