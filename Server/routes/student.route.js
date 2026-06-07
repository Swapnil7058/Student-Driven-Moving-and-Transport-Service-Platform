import express from "express";
import {
  deleteStudent,
  getAllStudents,
  getStudentById,
  getStudentStats,
  registerStudent,
  resendOtp,
  updateStudentStatus,
  verifyEmail,
  verifyOtp,
} from "../controller/student.controller.js";
import { authorize, protect } from "../middelware/authMiddleware.js";
// import { registerLimiter } from "../middelware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/verify-email", verifyEmail);
router.get("/stats/summary", protect, authorize("admin"), getStudentStats);
router.get("/", protect, authorize("admin"), getAllStudents);
router.get("/:studentId", protect, authorize("admin"), getStudentById);
router.patch("/:studentId/status", protect, authorize("admin"), updateStudentStatus);
router.delete("/:studentId", protect, authorize("admin"), deleteStudent);

export default router;
