import express from "express";
import {
  acceptJobByStudentID,
  createJob,
  getAllJobs,
  getJobById,
  getJobByQuote,
  updateJobProgress,
} from "../controller/job.controller.js";
import { authorize, protect } from "../middelware/authMiddleware.js";

const router = express.Router();


//Admin create job
router.post("/", protect, authorize("admin"), createJob);
router.get("/", protect, authorize("admin"), getAllJobs);
router.get("/quote/:quoteId", protect, getJobByQuote);

// get job details by id
router.get("/:jobId", getJobById);
router.post("/:jobId/accept-by-id", acceptJobByStudentID)
router.patch("/:jobId/progress", protect, authorize("admin"), updateJobProgress);

export default router;
