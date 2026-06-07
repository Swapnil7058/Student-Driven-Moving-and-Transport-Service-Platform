import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/emailService.js";

const preSignupPhoneOtpStore = new Map();
const preSignupEmailOtpStore = new Map();

const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const hasTwilioConfig = () =>
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER,
  );

const formatPhoneForSms = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;

  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  const defaultCountryCode = String(
    process.env.DEFAULT_COUNTRY_CODE || "+91",
  ).trim();

  if (digits.length === 10) {
    return `${defaultCountryCode}${digits}`;
  }

  return `+${digits}`;
};

const normalizePhone = (phone) => String(phone || "").trim();

const sendOtpWithTwilio = async ({ to, otp }) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: formatPhoneForSms(to),
    body: `Your VanMan customer OTP is ${otp}. It expires in 5 minutes.`,
  });
};

const sendRegistrationSuccessSms = async ({ to, name }) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: formatPhoneForSms(to),
    body: `Hi ${name || "Customer"}, registration successful for VanMan. Your account is active now.`,
  });
};

export const sendPreSignupPhoneOtp = async (req, res) => {
  try {
    const normalizedPhone = normalizePhone(req.body.phone);
    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    preSignupPhoneOtpStore.set(normalizedPhone, {
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    if (hasTwilioConfig()) {
      try {
        await sendOtpWithTwilio({ to: normalizedPhone, otp });
      } catch (smsError) {
        console.error("PHONE OTP SEND ERROR:", smsError.message);
        if (process.env.NODE_ENV === "production") {
          return res.status(500).json({
            success: false,
            message: "Failed to send phone OTP",
          });
        }
      }
    }

    return res.json({
      success: true,
      message: "Phone OTP sent successfully",
      data:
        process.env.NODE_ENV === "production"
          ? { expiresInSeconds: 300 }
          : { otp, expiresInSeconds: 300 },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send phone OTP",
    });
  }
};

export const verifyPreSignupPhoneOtp = async (req, res) => {
  try {
    const normalizedPhone = normalizePhone(req.body.phone);
    const normalizedOtp = String(req.body.otp || "").trim();

    if (!normalizedPhone || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const phoneVerification = preSignupPhoneOtpStore.get(normalizedPhone);
    if (!phoneVerification) {
      return res.status(400).json({
        success: false,
        message: "Please send OTP first",
      });
    }

    if (phoneVerification.otpExpires < Date.now()) {
      preSignupPhoneOtpStore.delete(normalizedPhone);
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (phoneVerification.otp !== normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    preSignupPhoneOtpStore.set(normalizedPhone, {
      ...phoneVerification,
      isVerified: true,
    });

    return res.json({
      success: true,
      message: "Phone verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify phone OTP",
    });
  }
};

export const sendPreSignupEmailOtp = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    preSignupEmailOtpStore.set(normalizedEmail, {
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    let emailSendFailed = false;
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: "VanMan email verification OTP",
        html: `
          <h3>Email Verification OTP</h3>
          <p>Your verification OTP is: <b>${otp}</b></p>
          <p>This OTP expires in 10 minutes.</p>
        `,
      });
    } catch (mailError) {
      emailSendFailed = true;
      console.error("EMAIL OTP SEND ERROR:", mailError.message);
      if (process.env.NODE_ENV === "production") {
        return res.status(500).json({
          success: false,
          message: "Failed to send email OTP",
        });
      }
    }

    return res.json({
      success: true,
      message: emailSendFailed
        ? "Email OTP generated (dev fallback)"
        : "Email OTP sent successfully",
      data:
        process.env.NODE_ENV === "production"
          ? { expiresInSeconds: 600 }
          : { otp, expiresInSeconds: 600 },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email OTP",
    });
  }
};

export const verifyPreSignupEmailOtp = async (req, res) => {
  try {
    const normalizedEmail = String(req.body.email || "")
      .trim()
      .toLowerCase();
    const normalizedOtp = String(req.body.otp || "").trim();

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const emailVerification = preSignupEmailOtpStore.get(normalizedEmail);
    if (!emailVerification) {
      return res.status(400).json({
        success: false,
        message: "Please send email OTP first",
      });
    }

    if (emailVerification.otpExpires < Date.now()) {
      preSignupEmailOtpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Email OTP expired. Please request a new one.",
      });
    }

    if (emailVerification.otp !== normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid email OTP",
      });
    }

    preSignupEmailOtpStore.set(normalizedEmail, {
      ...emailVerification,
      isVerified: true,
    });

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify email OTP",
    });
  }
};

// Register customer
export const register = async (req, res) => {
  try {
    const { name, phone, whatsapp, email, password } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedPhone = normalizePhone(phone);

    if (!name || !normalizedPhone || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email and password are required",
      });
    }

    const phoneVerification = preSignupPhoneOtpStore.get(normalizedPhone);
    if (!phoneVerification?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify phone OTP before signup",
      });
    }

    const emailVerification = preSignupEmailOtpStore.get(normalizedEmail);
    if (!emailVerification?.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify email OTP before signup",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      whatsapp,
      password: hashedPassword,
      role: "customer",
      isVerified: true,
      isEmailVerified: true,
    });

    preSignupPhoneOtpStore.delete(normalizedPhone);
    preSignupEmailOtpStore.delete(normalizedEmail);

    if (hasTwilioConfig() && user.phone) {
      try {
        await sendRegistrationSuccessSms({ to: user.phone, name: user.name });
      } catch (smsError) {
        console.error("CUSTOMER REG SMS ERROR:", smsError.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        email: user.email,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (user.role !== "admin") {
      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify OTP before login",
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email before login",
        });
      }
    }

    const token = generateToken(user);
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    success: true,
    message: "Logged Out Successfully",
  });
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (hasTwilioConfig() && user.phone) {
      await sendOtpWithTwilio({ to: user.phone, otp });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
      data:
        process.env.NODE_ENV === "production"
          ? { expiresInSeconds: 300 }
          : { otp, expiresInSeconds: 300 },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedOtp = String(otp || "").trim();

    if (!normalizedEmail || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    if (user.otp !== normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired email verification link",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export const getVerificationStatus = async (req, res) => {
  try {
    const normalizedEmail = String(req.query.email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select(
      "email isVerified isEmailVerified",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: {
        email: user.email,
        isPhoneVerified: Boolean(user.isVerified),
        isEmailVerified: Boolean(user.isEmailVerified),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification status",
    });
  }
};

export const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message: "Email already verified",
      });
    }

    const rawEmailToken = crypto.randomBytes(32).toString("hex");
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(rawEmailToken)
      .digest("hex");

    user.emailVerificationToken = hashedEmailToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyEmailLink = `${frontendUrl}/auth?verifyEmailToken=${rawEmailToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your VanMan email",
      html: `
        <h3>Email Verification</h3>
        <p>Click the link below to verify your email:</p>
        <p><a href="${verifyEmailLink}">${verifyEmailLink}</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    return res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/auth/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your VanMan password",
      html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link expires in 30 minutes.</p>
      `,
    });

    return res.json({
      success: true,
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  return res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    whatsapp: req.user.whatsapp,
    role: req.user.role,
  });
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { name, email, phone, whatsapp } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    const emailOwner = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (emailOwner) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email: normalizedEmail,
        phone,
        whatsapp,
      },
      { new: true, runValidators: true },
    ).select("-password");

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
