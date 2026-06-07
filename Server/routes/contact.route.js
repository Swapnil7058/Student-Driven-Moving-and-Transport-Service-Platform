import express from "express";
import {
  createSupport,
  getSupportDetails,
} from "../controller/contact.controller.js";

const router = express.Router();


router.get("/details", getSupportDetails);
router.post("/", createSupport);

export default router;
