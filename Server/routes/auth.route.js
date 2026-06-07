import express from "express";
import {
  forgotPassword,
  getVerificationStatus,
  getMe,
  login,
  logout,
  register,
  sendPreSignupEmailOtp,
  sendPreSignupPhoneOtp,
  resendEmailVerification,
  resendOtp,
  resetPassword,
  updateProfile,
  verifyEmail,
  verifyPreSignupEmailOtp,
  verifyPreSignupPhoneOtp,
  verifyOtp,
} from "../controller/auth.controller.js";
import { protect } from "../middelware/authMiddleware.js";

const router = express.Router();

router.post("/signup", register);
router.post("/pre-signup/send-phone-otp", sendPreSignupPhoneOtp);
router.post("/pre-signup/verify-phone-otp", verifyPreSignupPhoneOtp);
router.post("/pre-signup/send-email-otp", sendPreSignupEmailOtp);
router.post("/pre-signup/verify-email-otp", verifyPreSignupEmailOtp);
router.post("/resend-otp", resendOtp);
router.post("/resend-email-verification", resendEmailVerification);
router.post("/verify-otp", verifyOtp);
router.get("/verify-email", verifyEmail);
router.get("/verification-status", getVerificationStatus);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);

export default router;
