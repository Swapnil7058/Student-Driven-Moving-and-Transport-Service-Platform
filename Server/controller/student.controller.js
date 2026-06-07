import Students from "../models/students.model.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import crypto from "crypto";
import twilio from "twilio";
import { sendEmail } from "../utils/emailService.js";

const emitStudentStatsChanged = (req) => {
  const io = req.app.get("io");
  if (!io) return;
  io.emit("student:statsChanged");
};

const hasTwilioConfig = () =>
  Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER,
  );

const sendOtpWithTwilio = async ({ to, otp }) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: `Your Students Moving Service OTP is ${otp}. It expires in 5 minutes.`,
  });
};

const sendStudentRegistrationSms = async ({ to, name, studentId }) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: `Hi ${name || "Student"}, registration successful. Your Student ID is ${studentId}. Please keep it safe.`,
  });
};

export const registerStudent = async (req, res) => {
  try {
    const { name, email, phone, whatsapp, age, college, roles } = req.body;

    if (!name || !email || !phone || !whatsapp || !college || !roles) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const phoneNumber = parsePhoneNumberFromString(phone);

    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const formattedPhone = phoneNumber.number;

    const whatsappNumber = parsePhoneNumberFromString(whatsapp);

    if (!whatsappNumber || !whatsappNumber.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Invalid Whatsapp number",
      });
    }

    const formattedWhatsapp = whatsappNumber.number;

    if (String(age) > 30 || String(age) < 18) {
      return res.status(400).json({
        success: false,
        message: "Not elligible for job because age criteria not met",
      });
    }

    const existingStudent = await Students.findOne({
      $or: [{ email }, { whatsapp }, { phone }],
    });

    // checks if existing student data prevents dulpication
    if (existingStudent) {
      let message = "Student already exists";

      if (existingStudent.email === email) message = "Email already registered";
      else if (existingStudent.phone === phone)
        message = "Phone already registered";
      else if (existingStudent.whatsapp === whatsapp)
        message = "Whatsapp already registered";

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const rawEmailToken = crypto.randomBytes(32).toString("hex");
    const hashedEmailToken = crypto
      .createHash("sha256")
      .update(rawEmailToken)
      .digest("hex");

    const student = await Students.create({
      name,
      email,
      phone: formattedPhone,
      whatsapp: formattedWhatsapp,
      age,
      college,
      roles,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isEmailVerified: false,
      emailVerificationToken: hashedEmailToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    if (hasTwilioConfig()) {
      await sendOtpWithTwilio({ to: student.phone, otp });
      try {
        await sendStudentRegistrationSms({
          to: student.phone,
          name: student.name,
          studentId: student.studentId,
        });
      } catch (smsError) {
        console.error("STUDENT REG SMS ERROR:", smsError.message);
      }
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyEmailLink = `${frontendUrl}/students/register?verifyEmailToken=${rawEmailToken}`;
    try {
      await sendEmail({
        to: student.email,
        subject: "Verify your student email",
        html: `
          <h3>Students Moving Service</h3>
          <p>Please verify your email by clicking the link below:</p>
          <p><a href="${verifyEmailLink}">${verifyEmailLink}</a></p>
          <p>This link expires in 24 hours.</p>
        `,
      });
    } catch (mailError) {
      console.error("STUDENT EMAIL SEND ERROR:", mailError.message);
    }

    emitStudentStatsChanged(req);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent for verification.",
      data: {
        studentId: student.studentId,
      },
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { studentId, otp } = req.body;
    const normalizedStudentId = String(studentId || "").trim().toUpperCase();
    const normalizedOtp = String(otp || "").trim();

    if (!normalizedStudentId || !normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Student ID and OTP are required",
      });
    }

    const student = await Students.findOne({ studentId: normalizedStudentId });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.otp || !student.otpExpires || student.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
      });
    }

    if (student.otp !== normalizedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    student.isVerified = true;
    student.otp = undefined;
    student.otpExpires = undefined;
    await student.save();

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

export const resendOtp = async (req, res) => {
  try {
    const { studentId } = req.body;
    const normalizedStudentId = String(studentId || "").trim().toUpperCase();

    if (!normalizedStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    const student = await Students.findOne({ studentId: normalizedStudentId });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = otp;
    student.otpExpires = Date.now() + 5 * 60 * 1000;
    await student.save();

    const twilioEnabled = hasTwilioConfig();
    if (twilioEnabled) {
      await sendOtpWithTwilio({ to: student.phone, otp });
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
      data: twilioEnabled
        ? { expiresInSeconds: 300 }
        : process.env.NODE_ENV === "production"
          ? { expiresInSeconds: 300 }
          : { otp, expiresInSeconds: 300 },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
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
    const student = await Students.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired email verification link",
      });
    }

    student.isEmailVerified = true;
    student.emailVerificationToken = undefined;
    student.emailVerificationExpires = undefined;
    await student.save();

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

export const getStudentStats = async (req, res) => {
  try {
    const total = await Students.countDocuments({
      status: { $in: ["approved", "pending"] },
    });
    const pending = await Students.countDocuments({ status: "pending" });
    const onJob = await Students.countDocuments({
      status: "approved",
      isActive: false,
    });

    const available = await Students.countDocuments({
      status: "approved",
      isActive: true,
    });

    res.json({
      success: true,
      data: { total, pending, onJob, available },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    })
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const {
      status,
      role,
      isVerified,
      search,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Role filter
    if (role) {
      filter.roles = role;
    }

    // Verification filter
    if (isVerified !== undefined) {
      filter.isVerified = isVerified === "true";
    }

    // Date filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Search filter

    let sortOption = { createdAt: -1 };

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
      sortOption = { score: { $meta: "textScore" } };
    }

    const students = await Students.find(
      filter,
      search ? { score: { $meta: "textScore" } } : {},
    )
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Students.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      data: students,
    });
  } catch (err) {
    console.error("server err:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Students.findOne({ studentId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching student",
    });
  }
};

// Student Status Update
export const updateStudentStatus = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const student = await Students.findOneAndUpdate(
      { studentId },
      { status },
      { new: true },
    );

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    emitStudentStatsChanged(req);

    res.json({
      success: true,
      message: `Student ${status}`,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    await Students.findOneAndDelete({ studentId });
    emitStudentStatsChanged(req);

    res.json({
      success: true,
      message: "Student delete successful",
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to delete student",
    });
  }
};
// Separate worker registration link
// ✔ Separate job accept page
// ✔ Keep admin in full control
// ✔ No worker dashboard
