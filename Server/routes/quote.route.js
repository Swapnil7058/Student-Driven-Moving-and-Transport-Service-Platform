import express from "express";
import {
  createQuote,
  getAllQuotes,
  getJobStats,
  getQuoteByEmail,
  getQuoteById,
  respondToQuote,
  updateInvoice,
  updateQuote,
} from "../controller/quote.controller.js";
import { authorize, protect } from "../middelware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("customer"), createQuote);

router.get("/stats/summary", protect, authorize("admin"), getJobStats);

// customer routes
router.get("/customer/:email", protect, getQuoteByEmail);
router.get("/:id", protect, getQuoteById);
router.patch(
  "/:id/customer-response",
  protect,
  authorize("customer"),
  respondToQuote,
);

// admin get all quotes
router.get("/", protect, authorize("admin"), getAllQuotes);

// admin update quote
router.patch("/:id", protect, authorize("admin"), updateQuote);

//Admin update price Details
router.patch("/:id/invoice", protect, authorize("admin"), updateInvoice);

export default router;
